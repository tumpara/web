<template>
  <div :class="$style.container">
    <h2>
      {{
        $formatMessage({
          description: 'timeline search heading',
          defaultMessage: 'Search in timeline',
        })
      }}
    </h2>

    <VForm grid>
      <VRadioGroup v-model="archiveFilter" name="timeline-archive" buttons>
        <template #label>
          {{
            $formatMessage({
              description: 'timeline search archive label',
              defaultMessage: 'Archived items:',
            })
          }}
        </template>
        <VRadio id="timeline-archive-include" value="include">
          {{
            $formatMessage({
              description: 'timeline search archive option - show',
              defaultMessage: 'Show',
            })
          }}
        </VRadio>
        <VRadio id="timeline-archive-exclude" value="exclude">
          {{
            $formatMessage({
              description: 'timeline search archive option - hide',
              defaultMessage: 'Hide',
            })
          }}
        </VRadio>
        <VRadio id="timeline-archive-only" value="only">
          {{
            $formatMessage({
              description: 'timeline search archive option - only',
              defaultMessage: 'Only',
            })
          }}
        </VRadio>
      </VRadioGroup>

      <div style="grid-column: 1">
        {{
          $formatMessage({
            description: 'timeline search visibility label',
            defaultMessage: 'Visibility:',
          })
        }}
      </div>
      <VCheckbox
        v-model="visibilityPublicFilter"
        name="timeline-visiblity-public"
      >
        {{
          $formatMessage({
            description: 'timeline search visibility option - public',
            defaultMessage: 'Public',
          })
        }}
      </VCheckbox>
      <VCheckbox
        v-model="visibilityInternalFilter"
        name="timeline-visiblity-internal"
      >
        {{
          $formatMessage({
            description: 'timeline search visibility option - internal',
            defaultMessage: 'Users on this server',
          })
        }}
      </VCheckbox>
      <VCheckbox
        v-model="visibilityMembersFilter"
        name="timeline-visiblity-members"
      >
        {{
          $formatMessage({
            description: 'timeline search visibility option - members',
            defaultMessage: 'Library members',
          })
        }}
      </VCheckbox>
      <VCheckbox
        v-model="visibilityOwnersFilter"
        name="timeline-visiblity-owners"
      >
        {{
          $formatMessage({
            description: 'timeline search visibility option - members',
            defaultMessage: 'Library owners',
          })
        }}
      </VCheckbox>
    </VForm>
  </div>

  <TimelineView />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import {
  provideFullTimeline,
  provideTimelineSettings,
  TimelineView,
} from '@/components/timeline';
import { LibraryContentVisibility, TimelineEntryFilterSet } from '@/graphql';
import { VCheckbox, VForm, VRadio, VRadioGroup } from '@/interface';
import { provideSelection } from '@/utils/selection';

export default defineComponent({
  name: 'TimelineSearch',

  components: {
    TimelineView,
    VCheckbox,
    VForm,
    VRadio,
    VRadioGroup,
  },

  setup() {
    const archiveFilter = ref<'include' | 'exclude' | 'only'>('exclude');
    const visibilityPublicFilter = ref(true);
    const visibilityInternalFilter = ref(true);
    const visibilityMembersFilter = ref(true);
    const visibilityOwnersFilter = ref(true);

    const filters = computed<TimelineEntryFilterSet>(() => ({
      includeArchived: archiveFilter.value === 'include',
      onlyArchived: archiveFilter.value === 'only',
      effectiveVisibility: [
        visibilityPublicFilter.value ? LibraryContentVisibility.Public : null,
        visibilityInternalFilter.value
          ? LibraryContentVisibility.Internal
          : null,
        visibilityMembersFilter.value ? LibraryContentVisibility.Members : null,
        visibilityOwnersFilter.value ? LibraryContentVisibility.Owners : null,
      ],
    }));

    provideFullTimeline(filters);
    provideTimelineSettings();
    provideSelection();

    return {
      archiveFilter,
      visibilityPublicFilter,
      visibilityInternalFilter,
      visibilityMembersFilter,
      visibilityOwnersFilter,
    };
  },
});
</script>

<style lang="scss" module>
@use '../interface/lib/layout';

.container {
  grid-area: panel;
  width: clamp(20rem, 25vw, 30rem);
  padding: layout.$normal-gap;
  border-right: 1px solid var(--guideline-color);
  overflow-y: auto;
}
</style>
