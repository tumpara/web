<template>
  <TimelineView />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';

import {
  provideFullTimeline,
  provideTimelineSettings,
  TimelineView,
} from '@/components/timeline';
import { provideSelection } from '@/utils/selection';

export default defineComponent({
  name: 'TimelineMain',

  components: {
    TimelineView,
  },

  setup() {
    provideFullTimeline();
    provideTimelineSettings();
    provideSelection();

    provide('enableAlbumAdding', true);
  },
});
</script>
