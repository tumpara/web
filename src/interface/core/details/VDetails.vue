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

    let firstFocusableElement: HTMLElement | undefined = undefined;
    let lastFocusableElement: HTMLElement | undefined = undefined;

    function handleTabbing(
      event: KeyboardEvent,
      backward: boolean,
      destinationElement: HTMLElement | undefined
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
      destinationElement?.focus();
    }

    function handleLastForwardTab(event: KeyboardEvent) {
      handleTabbing(event, false, firstFocusableElement);
    }

    function handleFirstBackwardTab(event: KeyboardEvent) {
      handleTabbing(event, true, lastFocusableElement);
    }

    function removeTabbingHandlers() {
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
    }

    function registerTabbingHandlers() {
      if (container.value === undefined) {
        return;
      }

      const focusableElements = container.value?.querySelectorAll<HTMLElement>(
        [
          ':any-link:not([tabindex="-1"])',
          'button:not([tabindex="-1"])',
          'details:not([tabindex="-1"]) > summary:not([tabindex="-1"])',
          'input:not([tabindex="-1"])',
          'select:not([tabindex="-1"])',
          'textarea:not([tabindex="-1"])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(', ')
      );

      const applicableElements = Array.from(focusableElements)
        // Filter out any currently invisible elements from the focus list. This
        // is adapted from the jQuery source:
        // https://github.com/jquery/jquery/blob/2f8f39e457c32c454c50545b0fdaa1d7a4a2f8bd/src/css/hiddenVisibleSelectors.js#L9
        .filter(
          (element) =>
            element.offsetWidth > 0 ||
            element.offsetHeight > 0 ||
            element.getClientRects().length > 0
        )
        // Make sure we exclude the <summary> element matching this details.
        .filter(
          (element) =>
            element.tagName.toUpperCase() !== 'SUMMARY' ||
            element.parentElement !== container.value
        );

      if (applicableElements.length === 0) {
        return;
      } else {
        firstFocusableElement = applicableElements[0];
        firstFocusableElement.addEventListener(
          'keydown',
          handleFirstBackwardTab
        );
        lastFocusableElement =
          applicableElements[applicableElements.length - 1];
        lastFocusableElement.addEventListener('keydown', handleLastForwardTab);
      }

      if (
        document.activeElement !== null &&
        !applicableElements.includes(document.activeElement as HTMLElement)
      ) {
        firstFocusableElement.focus();
      }
    }

    onBeforeUpdate(() => removeTabbingHandlers());
    onUpdated(() => registerTabbingHandlers());

    function handleToggle() {
      if (container.value === undefined) {
        return;
      }
      removeTabbingHandlers();
      if (container.value.open) {
        registerTabbingHandlers();
      }
      emit('update:modelValue', container.value.open);
    }

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
