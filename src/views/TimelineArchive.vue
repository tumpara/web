<template>
  <TimelineView title="Archive" />
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
  name: 'TimelineArchive',

  components: {
    TimelineView,
  },

  setup() {
    provideFullTimeline({ onlyArchived: true });
    provideTimelineSettings();
    provideSelection();

    // This is used by the toolbar to show an 'Unarchive' button instead
    // of 'Archive'.
    provide('showUnarchiveButton', true);
    provide('enableAlbumAdding', true);
  },
});
</script>
