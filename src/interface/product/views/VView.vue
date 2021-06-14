<template>
  <div id="view" class="view" :class="[color ? `view--${color}` : undefined]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from 'vue';

export default defineComponent({
  name: 'VView',

  props: {
    color: {
      type: String,
      default: undefined,
      validator: (value: unknown) =>
        value === undefined ||
        (typeof value === 'string' && ['green', 'blue'].includes(value)),
    },
  },

  setup(props) {
    watchEffect((onInvalidate) => {
      if (props.color === undefined) {
        return;
      }

      const themeClass = `theme--${props.color}`;
      const element = document.querySelector(':root');
      element?.classList.add(themeClass);

      onInvalidate(() => element?.classList.remove(themeClass));
    });
  },
});
</script>

<style lang="scss" src="./view.scss"></style>

<style lang="scss">
@use '../../lib/colors';

:root.theme--green {
  @include colors.theme-green;
}

:root.theme--blue {
  @include colors.theme-blue;
}
</style>
