<template>
  <a
    class="navigator-item"
    :class="[color ? `navigator-item--${color}` : undefined]"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VNavigatorItem',

  provide: {
    size: 42,
    weight: 'duotone',
  },

  props: {
    color: {
      type: String,
      default: undefined,
      validator: (value: unknown) =>
        value === undefined ||
        (typeof value === 'string' &&
          ['gray', 'green', 'blue'].includes(value)),
    },
  },
});
</script>

<style lang="scss" src="./navigator.scss"></style>
