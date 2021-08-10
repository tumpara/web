<template>
  <details
    ref="container"
    class="details"
    :class="{ 'details--overlay': overlay, 'details--darken': darken }"
    :open="modelValue ? true : undefined"
    @toggle="handleToggle"
    @keydown.esc="$emit('update:modelValue', false)"
  >
    <VDetailsSummaryContainer>
      <slot name="activator"></slot>
    </VDetailsSummaryContainer>

    <slot></slot>
  </details>
</template>

<script lang="ts">
import { defineComponent, InjectionKey } from 'vue';

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
    'update:modelValue': Boolean,
  },

  setup(props, { emit }) {
    function handleToggle(event: Event) {
      const detailsElement = event.target as HTMLDetailsElement | null;
      if (detailsElement !== null) {
        emit('update:modelValue', detailsElement.open);
      }
    }

    return { handleToggle };
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
