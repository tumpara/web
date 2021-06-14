<template>
  <TimelineViewToolbar
    :display-mode="displayMode"
    @navigate-display="navigateDisplay"
    @close-display="displayedIndex = null"
  >
    <template #info>
      <h1 v-if="title" class="heading">{{ title }}</h1>
      <component
        :is="title ? 'span' : 'h1'"
        v-if="currentTimestamp !== null"
        :class="{ 'toolbar-status': !!title }"
      >
        {{ formatDate(currentTimestamp, { year: 'numeric', month: 'long' }) }}
      </component>
      <span class="toolbar-status">
        {{
          formatMessage(
            {
              description: 'timeline total count',
              defaultMessage: `{totalCount, plural,
                =0 {No items found}
                one {Showing one item}
                other {Showing about {totalCount, number, ::KK} items}
              }`,
            },
            { totalCount }
          )
        }}
      </span>
    </template>
  </TimelineViewToolbar>

  <template v-if="totalCount">
    <TimelineBrowser
      v-if="displayedIndex === null"
      :start-focus-index="lastDisplayedIndex"
      @open-index="displayedIndex = $event"
      @timestamp="currentTimestamp = $event"
    />
    <TimelineDisplay
      v-else
      :index="displayedIndex"
      @navigate="navigateDisplay"
      @close="displayedIndex = null"
      @timestamp="currentTimestamp = $event"
    />
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, provide, ref, watch } from 'vue';
import { useIntl } from 'vue-intl';

import { useTimeline } from './hooks';
import TimelineBrowser from './TimelineBrowser.vue';
import TimelineBrowserScrollbar from './TimelineBrowserScrollbar.vue';
import TimelineDisplay from './TimelineDisplay.vue';
import TimelineViewToolbar from './TimelineViewToolbar.vue';

export default defineComponent({
  name: 'TimelineView',

  components: {
    TimelineBrowser,
    TimelineBrowserScrollbar,
    TimelineDisplay,
    TimelineViewToolbar,
  },

  props: {
    title: String,
  },

  setup() {
    const { formatDate, formatMessage } = useIntl();

    const { totalCount } = useTimeline();
    const currentTimestamp = ref<null | Date>(null);

    const displayedIndex = ref<null | number>(null);
    function navigateDisplay(offset: number) {
      if (displayedIndex.value === null) {
        return;
      }
      let value = Math.max(0, displayedIndex.value + offset);
      value = Math.min(totalCount.value, value);
      displayedIndex.value = value;
    }

    // This variable corresponds to the displayMode prop on TimelineViewToolbar.
    // See there for details.
    const displayMode = computed(() => {
      if (displayedIndex.value === null || totalCount.value === 0) {
        return null;
      }
      let result = 0;
      if (displayedIndex.value > 0) {
        result |= 1;
      }
      if (displayedIndex.value < totalCount.value - 1) {
        result |= 2;
      }
      return result;
    });

    const displayDetailsVisible = ref(false);
    provide('displayDetailsVisible', displayDetailsVisible);

    const lastDisplayedIndex = ref<number | null>(null);
    watch(displayedIndex, (value, oldValue) => {
      // When the currently displayed index get's set to null (when the display
      // closes), save the last value so that the browser can focus the index
      // again.
      if (value === null && oldValue !== null) {
        lastDisplayedIndex.value = oldValue;
        displayDetailsVisible.value = false;
      }
    });

    return {
      formatDate,
      formatMessage,
      displayedIndex,
      navigateDisplay,
      totalCount,
      currentTimestamp,
      displayMode,
      lastDisplayedIndex,
    };
  },
});
</script>
