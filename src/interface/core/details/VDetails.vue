<template>
  <details
    ref="container"
    class="details"
    :class="{ 'details--overlay': overlay, 'details--darken': darken }"
    @toggle="handleToggle"
    @keydown.esc="close"
  >
    <VDetailsSummaryContainer>
      <slot name="activator"></slot>
    </VDetailsSummaryContainer>

    <slot></slot>
  </details>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { ButtonElement } from '../buttons/VButton.vue';

/* eslint-disable vue/one-component-per-file */

// This container component's only purpose is to provide a default value for
// button elements. That way when using a button as the activator we still get
// an aria-compliant <summary> element that is styled like a button.
const VDetailsSummaryContainer = defineComponent({
  name: 'VDetailsSummaryContainer',
  provide: {
    [ButtonElement as symbol]: 'summary',
  },
  render() {
    return this.$slots.default?.();
  },
});

export default defineComponent({
  name: 'VDetails',

  components: { VDetailsSummaryContainer },

  props: {
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
    open: null,
  },

  setup(props, { emit }) {
    const container = ref<HTMLDetailsElement>();
    const closeButton = ref<HTMLButtonElement>();

    function close() {
      if (!container.value?.open) {
        return;
      }
      const summaryElement =
        container.value?.querySelector<HTMLElement>(':scope > summary');
      summaryElement?.click();
    }

    function handleToggle() {
      if (container.value?.open) {
        closeButton.value?.focus();
        emit('open');
      }
    }

    return { container, closeButton, close, handleToggle };
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
