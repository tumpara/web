<template>
  <div ref="outerContainer" class="toolbar-section">
    <div ref="container" class="toolbar-section">
      <slot></slot>
    </div>

    <VPopup v-model="overflowMenuOpen" direction="sw" :class="$style.offload">
      <template #activator>
        <VButton><PhDotsThreeOutlineVertical weight="bold" /></VButton>
      </template>

      <VCard elevated>
        <VMenu ref="menuComponent">
          <VMenuButton>hi</VMenuButton>
        </VMenu>
      </VCard>
    </VPopup>
  </div>
</template>

<script lang="ts">
import { PhDotsThreeOutlineVertical } from 'phosphor-vue';
import {
  ComponentPublicInstance,
  computed,
  ComputedRef,
  defineComponent,
  InjectionKey,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  reactive,
  ref,
  watchEffect,
} from 'vue';

import { ReadonlyRef } from '@/utils';

import { VButton, VCard, VMenu, VMenuButton, VPopup } from '../..';

export type RenderMode = 'button' | 'menu';
type RenderScope = { mode: RenderMode; element?: HTMLElement };

type UseToolbarRenderScopeFunction = (
  priority: ReadonlyRef<number>
) => ComputedRef<RenderScope | null>;
export const UseToolbarRenderScope: InjectionKey<UseToolbarRenderScopeFunction> =
  Symbol();

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
  name: 'VToolbarSection',

  components: {
    PhDotsThreeOutlineVertical,
    VButton,
    VCard,
    VPopup,
    VMenu,
    VMenuButton,
  },

  setup() {
    // The reason we need an extra container for the actual buttons is because
    // otherwise the open overflow menu would trigger reflowing and everything
    // would collapse into the menu once it's opened the first time.
    const outerContainer = ref<HTMLDivElement>();
    const container = ref<HTMLDivElement>();
    const toolbarContainer = computed(
      () => outerContainer.value?.parentElement ?? undefined
    );
    const menuComponent = ref<ComponentPublicInstance<typeof VMenu>>();

    const overflowMenuOpen = ref(false);

    // Items with a higher priority than this will be rendered as buttons, the
    // rest as menu items.
    const effectivePriorityCutoff = ref(0);

    const priorities = reactive<Record<number, number>>({});
    const sortedPriorities = computed(() =>
      Object.values(priorities).sort((a, b) => a - b)
    );

    let nextPriorityKey = 0;
    function useToolbarRenderScope(priority: ReadonlyRef<number>) {
      const handle = nextPriorityKey++;
      onMounted(() => {
        priorities[handle] = priority as unknown as number;
      });
      onBeforeUnmount(() => {
        delete priorities[handle];
      });

      // The effective priority is the priority's index in the sorted total
      // list. This helps us deal with holes - for example: when actions are
      // provided with priorities 10, 20 and 15, the corresponding effective
      // priorities will be 0, 2 and 1.
      const effectivePriority = computed(() =>
        sortedPriorities.value.indexOf(priority.value)
      );

      return computed<RenderScope | null>(() => {
        if (effectivePriority.value >= effectivePriorityCutoff.value) {
          return {
            mode: 'button',
          };
        } else {
          const element: HTMLElement | undefined =
            menuComponent.value?.container;
          if (element === undefined) {
            return null;
          }
          return {
            mode: 'menu',
            element,
          };
        }
      });
    }
    provide(UseToolbarRenderScope, useToolbarRenderScope);

    let lastWidth: undefined | number = undefined;
    function reflow() {
      if (
        container.value === undefined ||
        toolbarContainer.value === undefined
      ) {
        return;
      }

      if (container.value.scrollHeight > toolbarContainer.value.clientHeight) {
        // When the container is currently overflowing, hide some buttons.
        effectivePriorityCutoff.value += 1;
      } else if (
        toolbarContainer.value.clientWidth >
        (lastWidth ?? Infinity) + 20
      ) {
        // If the container got larger since the last reflow operation, there is
        // potentially more room for new buttons again.
        effectivePriorityCutoff.value -= 1;
      }

      // We only have effective priorities 0 through
      // (sortedPriorities.length - 1), so we can limit our cutoff value
      // accordingly.
      effectivePriorityCutoff.value = Math.min(
        Math.max(effectivePriorityCutoff.value, 0),
        // -1 is intentionally not subtracted from this limit because we have a
        // case where all items are overflown.
        sortedPriorities.value.length
      );

      lastWidth = toolbarContainer.value.clientWidth;
    }

    // Make sure reflowing is performed every time the DOM gets updated (most of
    // these will be no-ops if the window size doesn't change).
    onUpdated(() => reflow());

    // Connect a resize observer to the container's parent so we can reflow when
    // necessary. The reason we connect to the parent (which is the toolbar) is
    // because our container is most likely a flex element that doesn't change
    // size with the browser window.
    watchEffect((onInvalidate) => {
      if (toolbarContainer.value === undefined) {
        return;
      }

      const observer = new ResizeObserver(() => reflow());

      observer.observe(toolbarContainer.value);
      onInvalidate(() => observer.disconnect());
    });

    return {
      outerContainer,
      container,
      menuComponent,
      overflowMenuOpen,
      priorities,
    };
  },
});
</script>

<style lang="scss" module>
.offload {
  // Make sure the menu button is rendered last (it isn't last in the DOM
  // because the other buttons are <teleport>ed there).
  order: 9999;
}
</style>
