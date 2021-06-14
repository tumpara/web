<template>
  <div :class="$style.container">
    <h2>
      {{
        formatMessage({
          description: 'timeline search heading',
          defaultMessage: 'Search in timeline',
        })
      }}
    </h2>
  </div>

  <TimelineView />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import {
  provideFullTimeline,
  provideTimelineSettings,
  TimelineView,
} from '@/components/timeline';
import { provideSelection } from '@/utils/selection';

export default defineComponent({
  name: 'TimelineSearch',

  components: {
    TimelineView,
  },

  setup() {
    const { formatMessage } = useIntl();

    provideFullTimeline();
    provideTimelineSettings();
    provideSelection();

    return {
      formatMessage,
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
