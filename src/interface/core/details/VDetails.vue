<template>
  <details
    ref="container"
    class="details"
    :class="{ 'details--overlay': overlay, 'details--darken': darken }"
    :open="modelValue ? true : undefined"
    @toggle="handleToggle"
    @keydown.esc="handleEscape"
    @keydown.tab.exact="handleTabbing(false)"
    @keydown.shift.tab.exact="handleTabbing(true)"
  >
    <VDetailsSummaryContainer>
      <slot name="activator"></slot>
    </VDetailsSummaryContainer>

    <slot v-if="!lazy || modelValue"></slot>
  </details>
</template>

<script lang="ts">
import {
  defineComponent,
  InjectionKey,
  onBeforeUnmount,
  onBeforeUpdate,
  onUpdated,
  ref,
} from 'vue';

export const DetailsSummaryScope: InjectionKey<boolean> = Symbol();

/* eslint-disable vue/one-component-per-file */

// This container component's only purpose is to provide the symbol above. That
// way when using a button (or other compatible components) as the activator we
// still get an aria-compliant <summary> element that is styled like a button.
const VDetailsSummaryContainer = defineComponent({
  name: 'VDetailsSummaryContainer',
  provide: {
    [DetailsSummaryScope as symbol]: true,
  },
  render() {
    return this.$slots.default?.();
  },
});

export default defineComponent({
  name: 'VDetails',

  components: { VDetailsSummaryContainer },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: Boolean,
      default: false,
    },
    darken: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    'update:modelValue': (value: unknown) => typeof value === 'boolean',
  },

  setup(props, { emit }) {
    const container = ref<HTMLDetailsElement>();

    function handleToggle() {
      if (container.value === undefined) {
        return;
      }
      emit('update:modelValue', container.value.open);
    }

    let firstFocusableElement: HTMLElement | undefined = undefined;
    let lastFocusableElement: HTMLElement | undefined = undefined;

    function handleTabbing(
      event: KeyboardEvent,
      backward: boolean,
      targetElement: HTMLElement | undefined
    ) {
      if (event.key !== 'Tab') {
        return;
      }
      if (!props.modelValue || !props.overlay) {
        return;
      }
      if (backward !== event.shiftKey) {
        return;
      }
      event.preventDefault();
      targetElement?.focus();
    }

    function handleLastForwardTab(event: KeyboardEvent) {
      handleTabbing(event, false, firstFocusableElement);
    }

    function handleFirstBackwardTab(event: KeyboardEvent) {
      handleTabbing(event, true, lastFocusableElement);
    }

    onBeforeUpdate(() => {
      if (firstFocusableElement !== undefined) {
        firstFocusableElement.removeEventListener(
          'keydown',
          handleFirstBackwardTab
        );
        firstFocusableElement = undefined;
      }
      if (lastFocusableElement !== undefined) {
        lastFocusableElement.removeEventListener(
          'keydown',
          handleLastForwardTab
        );
        lastFocusableElement = undefined;
      }
    });

    onUpdated(() => {
      if (container.value === undefined) {
        return;
      }

      const focusableElements = container.value?.querySelectorAll<HTMLElement>(
        [
          ':any-link:not([tabindex="-1"])',
          'button:not([tabindex="-1"])',
          'details:not([tabindex="-1"])',
          'input:not([tabindex="-1"])',
          'select:not([tabindex="-1"])',
          'textarea:not([tabindex="-1"])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(', ')
      );

      if (focusableElements.length === 0) {
        return;
      } else {
        firstFocusableElement = focusableElements[0];
        firstFocusableElement.addEventListener(
          'keydown',
          handleFirstBackwardTab
        );
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        lastFocusableElement.addEventListener('keydown', handleLastForwardTab);
      }
    });

    function handleEscape() {
      emit('update:modelValue', false);
      container.value?.querySelector('summary')?.focus();
    }

    onBeforeUnmount(() => {
      emit('update:modelValue', false);
    });

    return { container, handleToggle, handleTabbing, handleEscape };
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
