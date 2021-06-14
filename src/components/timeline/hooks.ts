import { useResult } from '@vue/apollo-composable';
import {
  computed,
  DeepReadonly,
  inject,
  InjectionKey,
  provide,
  readonly,
  Ref,
  ref,
  unref,
  watch,
} from 'vue';

import {
  AdditionalTimelineEntriesDocument,
  AdditionalTimelineEntriesQueryVariables,
  ExtractArrayMaybe,
  TimelineEntryConnectionEdgesFragment,
  TimelineEntryFilterSet,
  TimelineViewInitialFragment,
  TimelineViewMonthBucket,
  TimelineViewYearBucket,
  useTimelineQuery,
} from '@/graphql';

export interface TimelineSlice {
  startIndex: number;
  endIndex: number;
}

type InjectionKeyType<T> = T extends InjectionKey<infer Content>
  ? Content
  : never;

// This is the timeline edge type that will be provided by the
// useTimelineSlice hook. It enforces that the node is non-null.
type ValidTimelineEntryEdge = ExtractArrayMaybe<
  TimelineEntryConnectionEdgesFragment['edges']
> & {
  node: NonNullable<
    ExtractArrayMaybe<TimelineEntryConnectionEdgesFragment['edges']>['node']
  >;
};

// These two injection symbols are available to child components. They
// contain metadata about the timeline itself.
const TimelineDistribution: InjectionKey<
  Ref<
    Readonly<
      // Remove the null and undefined fields from the result.
      (TimelineViewYearBucket & {
        monthDistribution: TimelineViewMonthBucket[];
      })[]
    >
  >
> = Symbol();
const TimelineTotalCount: InjectionKey<Ref<Readonly<number>>> = Symbol();
const TimelineLoading: InjectionKey<Ref<Readonly<boolean>>> = Symbol();
// These injections are not intended to be directly consumed by child
// components. Instead, clients should use the `useTimelineSlice` hook that
// automatically takes care of pagination.
const TimelineEntryConnection: InjectionKey<
  Ref<Readonly<TimelineViewInitialFragment['entries']>>
> = Symbol();
const FetchMoreTimelineEntries: InjectionKey<
  (offset: number) => Promise<void>
> = Symbol();

interface UseTimelineReturn {
  distribution: InjectionKeyType<typeof TimelineDistribution>;
  totalCount: InjectionKeyType<typeof TimelineTotalCount>;
  loading: InjectionKeyType<typeof TimelineLoading>;
}

export function useTimeline(): UseTimelineReturn {
  const distribution = inject(TimelineDistribution, readonly(ref([])));
  const totalCount = inject(TimelineTotalCount, readonly(ref(0)));
  const loading = inject(TimelineLoading, readonly(ref(false)));

  return { distribution, totalCount, loading };
}

export function useTimelineSlice(
  requestedSlice: Ref<DeepReadonly<TimelineSlice>>
): Ref<Readonly<ValidTimelineEntryEdge[]>> {
  const connection = inject(TimelineEntryConnection);
  const fetchMoreEntries = inject(FetchMoreTimelineEntries);
  const { totalCount } = useTimeline();

  if (
    connection === undefined ||
    fetchMoreEntries === undefined ||
    totalCount === undefined
  ) {
    return readonly(ref([]));
  }

  // Calculate the slice of the timeline that is still missing (ie those
  // that are requested but not yet fetched).
  const fetchOffset = computed(() => {
    if (!requestedSlice.value) {
      return null;
    }

    // Ensure that the requested slice fits in the constraints of the timeline.
    const startIndex = Math.min(...Object.values(requestedSlice.value));
    const endIndex = Math.max(...Object.values(requestedSlice.value));
    const effectiveSlice: TimelineSlice = {
      startIndex: Math.max(startIndex, 0),
      endIndex: Math.min(endIndex, totalCount.value - 1),
    };

    // Find the index to continue pagination from. This is the last index of
    // the the first continuously available block of entries inside of
    // the requested slice.
    //
    // Example: ('-' are not yet fetched entries, 'x' are fetched entries)
    //                        |  requested slice |
    // ------xxxxx-------xxxxxxxxxx-----xxxx----xxxxx-----------
    //                            ^
    //              This will be the reference index
    let referenceIndex: number | null = null;
    for (const edge of connection.value?.edges || []) {
      if (!edge) {
        continue;
      }

      if (
        effectiveSlice.startIndex <= edge.index &&
        edge.index <= effectiveSlice.endIndex
      ) {
        if (referenceIndex) {
          if (edge.index == referenceIndex + 1) {
            referenceIndex = edge.index;
          } else {
            // We reached the end of the first continuous block.
            break;
          }
        } else {
          referenceIndex = edge.index;
        }
      }
    }

    if (!referenceIndex) {
      // No reference index was found, so start from the slice start.
      referenceIndex = effectiveSlice.startIndex - 1;
    }
    if (referenceIndex == effectiveSlice.endIndex) {
      // Everything is already available, nothing needs to be done.
      return null;
    }
    return referenceIndex + 1;
  });

  watch(fetchOffset, async (offset) => {
    if (offset === null) {
      return;
    }
    await fetchMoreEntries?.(offset);
  });

  return computed(
    () =>
      (connection.value?.edges?.filter(
        (edge) =>
          edge?.node &&
          requestedSlice.value.startIndex <= edge.index &&
          edge.index <= requestedSlice.value.endIndex
      ) as unknown as ValidTimelineEntryEdge[]) || []
  );
}

function provideTimelineMetadata(
  distribution: Ref<
    Readonly<TimelineViewInitialFragment['yearDistribution'] | undefined>
  >
) {
  provide(TimelineDistribution, distribution);

  const totalCount = computed(() => {
    if (!distribution.value) {
      return 0;
    }
    let result = 0;
    for (const year of distribution.value) {
      if (!year?.monthDistribution) {
        continue;
      }
      for (const month of year.monthDistribution) {
        result += month?.totalEntryCount || 0;
      }
    }
    return result;
  });
  provide(TimelineTotalCount, totalCount);
}

/**
 * Provider that makes the timeline available to child components.
 *
 * This will provide values for the `TimelineDistribution` and
 * `TimelineTotalCount` symbols. Further, it will make the `useTimelineSlice`
 * hook available that gives access to the actual content of the timeline.
 */
export function provideFullTimeline(
  filters: TimelineEntryFilterSet | Ref<TimelineEntryFilterSet> | undefined = {}
): void {
  const query = useTimelineQuery(computed(() => ({ filters: unref(filters) })));
  provide(TimelineLoading, readonly(query.loading));

  provideTimelineMetadata(
    useResult(query.result, null, (data) => data.timeline?.yearDistribution)
  );

  const entries = useResult(query.result, [], (data) => data.timeline?.entries);
  provide(TimelineEntryConnection, entries);

  async function fetchMoreEntries(offset: number) {
    await query.fetchMore({
      query: AdditionalTimelineEntriesDocument,
      variables: {
        filters,
        offset,
      } as AdditionalTimelineEntriesQueryVariables,
    });
  }
  provide(FetchMoreTimelineEntries, fetchMoreEntries);
}
