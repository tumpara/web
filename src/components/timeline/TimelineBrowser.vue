<template>
  <main
    ref="scrollContainer"
    :class="$style.container"
    tabindex="0"
    @keydown.up.prevent="focusIndex(-1)"
    @keydown.down.prevent="focusIndex(0)"
    @keydown.left.prevent="focusIndex(-1)"
    @keydown.right.prevent="focusIndex(0)"
  >
    <div
      ref="entriesContainer"
      :class="$style.entries"
      :style="{ height: `${requiredHeight ?? 1}px` }"
    >
      <template v-if="gridInfo !== undefined">
        <TimelineBrowserPreview
          v-for="edge in timeline"
          :key="edge.node.id"
          :entry="edge.node"
          :layout="indexToGridLayout(edge.index)"
          :size="gridInfo.blockSize"
          :blurhash-renderer="blurhashRenderer"
          :data-entry-index="edge.index"
          @open="$emit('openIndex', edge.index)"
          @keydown.esc.prevent="
            $event.target.parentElement.parentElement.focus()
          "
          @keydown.up.stop.prevent="focusByOffset(edge.index, 0, -1)"
          @keydown.down.stop.prevent="focusByOffset(edge.index, 0, 1)"
          @keydown.left.stop.prevent="focusByOffset(edge.index, -1, 0)"
          @keydown.right.stop.prevent="focusByOffset(edge.index, 1, 0)"
          @keydown.page-up.stop.prevent="focusByOffset(edge.index, 0, -4)"
          @keydown.page-down.stop.prevent="focusByOffset(edge.index, 0, 4)"
        ></TimelineBrowserPreview
      ></template>
    </div>

    <TimelineBrowserScrollbar
      @scroll-to="scrollContainer?.scrollTo(0, $event)"
    />
  </main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUpdated,
  PropType,
  provide,
  readonly,
  ref,
  watch,
  watchEffect,
} from 'vue';

import { TimelineSlice, useTimeline, useTimelineSlice } from './hooks';
import { GridSize } from './settings';
import TimelineBrowserPreview from './TimelineBrowserPreview.vue';
import TimelineBrowserScrollbar from './TimelineBrowserScrollbar.vue';

export interface ScrollInformation {
  topPixels: number;
  bottomPixels: number;
  topPercentage: number;
  bottomPercentage: number;
  scrollPercentage: number;
  clientHeight: number;
  totalHeight: number;
}

const GRID_SPACING = 8;

export default defineComponent({
  name: 'TimelineBrowser',

  components: { TimelineBrowserPreview, TimelineBrowserScrollbar },

  props: {
    startFocusIndex: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },

  emits: {
    // Emitted when a specific index in the timeline should be opened by
    // the viewer.
    openIndex: (index: unknown) => typeof index === 'number' && isFinite(index),
    // The median timestamp that is currently visible. This is emitted when the
    // view changes.
    timestamp: (date: unknown) => date === null || date instanceof Date,
  },

  setup(props, { emit }) {
    const entriesContainer = ref<HTMLElement>();

    onMounted(() => {
      // Emit a timestamp of null on mounting so that navigation doesn't leave
      // some old timestamp active.
      emit('timestamp', null);
    });

    // The requested grid size is injected from higher components. This is the
    // minimum width and height each block should occupy (without the spacing).
    // Blocks may be larger depending on how exact a multiple the container
    // width is of the grid size.
    const requestedGridSize = inject(GridSize, ref(200));
    const containerWidth = ref<number>();
    const gridInfo = computed(() => {
      const requestedSize = requestedGridSize.value;
      if (
        entriesContainer.value === undefined ||
        containerWidth.value === undefined
      ) {
        return undefined;
      }

      const availableWidth = containerWidth.value - GRID_SPACING;
      const columnCount = Math.floor(
        availableWidth / (requestedSize + GRID_SPACING)
      );
      const blockSize = availableWidth / columnCount - GRID_SPACING;
      return { availableWidth, columnCount, blockSize };
    });

    // Monitor the container width so that the grid can be recalculated if
    // required.
    watchEffect((onInvalidate) => {
      if (entriesContainer.value === undefined) {
        return;
      }

      const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        // Need to check for Chrome's non-standard array notation here, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#examples
        containerWidth.value = (
          entry.contentBoxSize[0] || entry.contentBoxSize
        ).inlineSize;
      });
      observer.observe(entriesContainer.value);
      onInvalidate(() => observer.disconnect());
    });

    // Helper method to convert an entry's global index to the corresponding
    // grid coordinates.
    function indexToGridLayout(
      index: number
    ): { left: number; top: number } | undefined {
      if (gridInfo.value === undefined) {
        return undefined;
      }

      const sizeWithSpacing = gridInfo.value.blockSize + GRID_SPACING;
      return {
        left:
          GRID_SPACING + (index % gridInfo.value.columnCount) * sizeWithSpacing,
        top:
          GRID_SPACING +
          Math.floor(index / gridInfo.value.columnCount) * sizeWithSpacing,
      };
    }

    const { totalCount } = useTimeline();
    const requiredHeight = computed<number>(() => {
      if (gridInfo.value === undefined || totalCount.value === 0) {
        return 0;
      }
      const layout = indexToGridLayout(totalCount.value - 1);
      if (layout === undefined) {
        return 0;
      }
      return layout.top + gridInfo.value.blockSize + GRID_SPACING;
    });

    // Use the outer container (the one that provides the scrollbar) to get the
    // currently visible scroll area.
    const scrollContainer = ref<HTMLElement>();
    const visibleArea = ref<ScrollInformation>();
    provide('visibleArea', readonly(visibleArea));
    watchEffect((onInvalidate) => {
      if (scrollContainer.value === undefined) {
        return;
      }

      function handleScroll() {
        if (scrollContainer.value === undefined || requiredHeight.value === 0) {
          return;
        }

        const scrollBottom =
          scrollContainer.value.scrollTop + scrollContainer.value.clientHeight;
        visibleArea.value = {
          topPixels: scrollContainer.value.scrollTop,
          bottomPixels: scrollBottom,
          topPercentage:
            scrollContainer.value.scrollTop /
            scrollContainer.value.scrollHeight,
          bottomPercentage: scrollBottom / scrollContainer.value.scrollHeight,
          scrollPercentage:
            scrollContainer.value.scrollTop /
            (scrollContainer.value.scrollHeight -
              scrollContainer.value.clientHeight),
          clientHeight: scrollContainer.value.clientHeight,
          totalHeight: requiredHeight.value,
        };
      }

      // Both a normal scroll handler and a resize observer are added here so
      // that we can recalculate the layout on both events.
      scrollContainer.value.addEventListener('scroll', handleScroll, {
        passive: true,
      });
      const observer = new ResizeObserver(handleScroll);
      observer.observe(scrollContainer.value);
      onInvalidate(() => {
        scrollContainer.value?.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      });
    });

    // Use the visible area information from above to find the timeline slice we
    // want right now.
    const requestedSlice = ref({
      startIndex: 0,
      endIndex: 10,
    } as TimelineSlice);
    const nextSlice = ref<TimelineSlice | null>(null);
    watchEffect(() => {
      if (visibleArea.value === undefined || gridInfo.value === undefined) {
        return;
      }

      // We request 5 additional rows here because that's how fare we can
      // paginate with the keyboard.
      const topRow =
        Math.floor(
          (visibleArea.value.topPixels - GRID_SPACING) /
            (gridInfo.value.blockSize + GRID_SPACING)
        ) - 5;
      const bottomRow =
        Math.ceil(
          (visibleArea.value.bottomPixels - GRID_SPACING) /
            (gridInfo.value.blockSize + GRID_SPACING)
        ) + 5;

      const sliceCandidate = {
        startIndex: topRow * gridInfo.value.columnCount,
        endIndex:
          gridInfo.value.columnCount -
          1 +
          bottomRow * gridInfo.value.columnCount,
      };

      // Only apply the new slice if there es enough difference to warrant
      // recalculating.
      if (
        Math.abs(requestedSlice.value.startIndex - sliceCandidate.startIndex) >
          5 ||
        Math.abs(requestedSlice.value.endIndex - sliceCandidate.endIndex) > 5
      ) {
        nextSlice.value = sliceCandidate;
      }
    });
    const nextSliceApplyable = ref(true);
    // Apply the next slice, while also trying not to update too often.
    watchEffect(() => {
      if (nextSlice.value === null) {
        return;
      }

      // If the current timeline is not yet fully loaded, wait until that
      // happens.
      const requestedSize =
        Math.min(totalCount.value - 1, requestedSlice.value.endIndex) -
        Math.max(0, requestedSlice.value.startIndex);
      if (
        timeline.value.length < requestedSize ||
        timeline.value[0]?.index < requestedSlice.value.startIndex ||
        timeline.value[timeline.value.length - 1]?.index >
          requestedSlice.value.endIndex
      ) {
        return;
      }

      // If the timeout for applying new timeline slices has not yet passed,
      // wait until it has.
      if (nextSliceApplyable.value === false) {
        return;
      }

      requestedSlice.value = nextSlice.value;
      nextSlice.value = null;
      nextSliceApplyable.value = false;
      window.setTimeout(() => (nextSliceApplyable.value = true), 200);
    });
    const timeline = useTimelineSlice(readonly(requestedSlice));

    watch(timeline, (value, prevValue) => {
      if (value === prevValue || value.length === 0) {
        return;
      }
      const middleEntry = value[Math.floor(value.length / 2)];
      emit('timestamp', new Date(middleEntry.node.timestamp));
    });

    const blurhashRenderer = computed(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      return [canvas, ctx];
    });

    // Keep track of the index that should be focused. After every update, we
    // check if the corresponding DOM element is already there and perform the
    // focusing if we can.
    const focusedIndex = ref<number | null>(props.startFocusIndex);
    function tryFocusing() {
      if (focusedIndex.value === null) {
        return;
      }

      // If the scroll container is not yet present this method will be called
      // again in the next update and we will do the scrolling then.
      if (
        scrollContainer.value === undefined ||
        totalCount.value === 0 ||
        gridInfo.value === undefined
      ) {
        return;
      }

      const layout = indexToGridLayout(focusedIndex.value);
      if (layout === undefined) {
        return;
      }
      const scrollTopBefore = scrollContainer.value.scrollTop;
      scrollContainer.value.scrollTo({
        top:
          layout.top +
          gridInfo.value.blockSize / 2 -
          scrollContainer.value.clientHeight / 2,
        left: layout.left,
        // We don't use smooth scrolling here because this method gets called a
        // lot (after every keyboard navigation) and we don't want to disturb
        // the user.
        behavior: 'auto',
      });
      if (scrollContainer.value.scrollTop !== scrollTopBefore) {
        scrollContainer.value.dispatchEvent(new Event('scroll'));
      }

      const element = document.querySelector<HTMLElement>(
        `[data-entry-index="${
          totalCount.value > 0
            ? focusedIndex.value % totalCount.value
            : focusedIndex.value
        }"]`
      );
      // Like before, if the element isn't here yet we wait until the next
      // update.
      if (element === null) {
        return;
      }

      element.focus();
      focusedIndex.value = null;
    }
    onUpdated(() => tryFocusing());

    /**
     * Scroll the container to make sure a given index is visible. Then, mark it
     * accordingly so it will be focused once the corresponding DOM element is
     * visible.
     */
    function focusIndex(index: number) {
      focusedIndex.value = index;
      tryFocusing();
    }

    /**
     * Focus the entry based on an offset from a given other index.
     * This is use to allow movement through the timeline using the arrow keys.
     */
    function focusByOffset(
      reference: number,
      columnOffset: number,
      rowOffset: number
    ) {
      if (gridInfo.value === undefined) {
        return;
      }
      // Note: we don't care about overflowing to the next row when the user
      // presses the left or right keys when the left- or rightmost item is
      // already selected. That way, they can neatly paginate through the
      // entire dataset.
      focusIndex(
        reference + columnOffset + rowOffset * gridInfo.value.columnCount
      );
    }

    return {
      entriesContainer,
      gridInfo,
      indexToGridLayout,
      requiredHeight,
      scrollContainer,
      timeline,
      totalCount,
      blurhashRenderer,
      focusIndex,
      focusByOffset,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../interface/lib/layout';

.container {
  display: flex;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: layout.$focus-outline-size solid var(--focus-color);
  }
}
.entries {
  flex-grow: 1;
  position: relative;
}
</style>
