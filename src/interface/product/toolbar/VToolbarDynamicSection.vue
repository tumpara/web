<template>
  <div ref="container" class="toolbar-section">
    <slot v-for="name in visibleSlots" :name="name"></slot>

    <VDialog
      v-if="hiddenSlots.length > 0"
      :class="$style['offload-dialog']"
      overlay
    >
      <template #activator>
        <VButton><PhDotsThreeOutlineVertical weight="bold" /></VButton>
      </template>

      <div :class="$style.offload">
        <slot v-for="name in hiddenSlots" :name="name"></slot>
      </div>
    </VDialog>
  </div>
</template>

<script lang="ts">
import { PhDotsThreeOutlineVertical } from 'phosphor-vue';
import { computed, defineComponent, onUpdated, ref, watchEffect } from 'vue';

import { VButton, VDialog } from '../..';

/**
 * A toolbar section that dynamically offloads content into a popup when no more
 * space is available.
 *
 * Items / groups that should be offloaded together should be provided in
 * individual slots. They will be rendered in the order they are given in (with
 * the default slot last). When space is tight, the slot with the smallest name
 * (alphabetically) will be hidden first:
 *
 *    <template #prio-1> <button>Do something</button> </template>
 *    <template #prio-2> <button>Something else</button> </template>
 *
 * In the above example, the second button will stay visible longer than the
 * first one.
 *
 * Note: due to how slot rendering works in vue, you cannot have a v-if
 * directive on the slot templates. So this will *not* work:
 *    <template v-if="condition" #name> <button>Hi!</button> </template>
 * In this case, the button will not become visible if `condition` starts out
 * falsy and becomes truthy.
 */
export default defineComponent({
  name: 'VToolbarDynamicSection',

  components: {
    PhDotsThreeOutlineVertical,
    VButton,
    VDialog,
  },

  setup(props, { slots }) {
    const container = ref<HTMLDivElement>();
    const containerParent = computed(
      () => container.value?.parentElement ?? undefined
    );

    const slotData = computed(() => {
      const result = Object.keys(slots);

      const sortedResult = result.slice().sort();
      const defaultIndex = result.indexOf('default');
      if (defaultIndex >= 0) {
        sortedResult.splice(defaultIndex, 1);
        sortedResult.push('default');
      }

      return result.map((name) => ({
        name,
        priority: sortedResult.indexOf(name),
      }));
    });

    const minimumPriority = ref(-1);
    let lastWidth: undefined | number = undefined;
    function reflow() {
      if (
        container.value === undefined ||
        containerParent.value === undefined
      ) {
        return;
      }

      if (containerParent.value.clientWidth > (lastWidth ?? Infinity)) {
        // If the container got larger since the last reflow operation, we need
        // to check if we can give the buttons more room again.
        minimumPriority.value -= 1;
      } else {
        // If not, we just check if the container is currently overflowing. If
        // so, hide some buttons.
        if (container.value.scrollHeight > container.value.clientHeight) {
          minimumPriority.value += 1;
        }
      }

      lastWidth = containerParent.value.clientWidth;
    }

    // Make sure reflowing is performed every time the DOM gets update (most of
    // these will be no-ops if the window size doesn't change).
    onUpdated(() => reflow());

    // Connect a resize observer to the container's parent so we can reflow when
    // necessary. The reason we connect to the parent (which is the toolbar) is
    // because our container is most likely a flex element that doesn't change
    // size with the browser window.
    watchEffect((onInvalidate) => {
      if (containerParent.value === undefined) {
        return;
      }

      const observer = new ResizeObserver(() => reflow());

      observer.observe(containerParent.value);
      onInvalidate(() => observer.disconnect());
    });

    const visibleSlots = computed(() =>
      slotData.value
        .filter((slot) => slot.priority >= minimumPriority.value)
        .map((slot) => slot.name)
    );
    const hiddenSlots = computed(() =>
      slotData.value
        .filter((slot) => slot.priority < minimumPriority.value)
        .map((slot) => slot.name)
    );

    return { container, minimumPriority, visibleSlots, hiddenSlots };
  },
});
</script>

<style lang="scss" module>
@use '../../lib/layout';

.offload-dialog > div {
  min-width: unset;
}

.offload {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: layout.$small-gap;

  > *,
  > *:not(:last-child),
  > *:not(:first-child) {
    margin-inline: 0;
  }
}
</style>
