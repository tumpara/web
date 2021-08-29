<template>
  <div
    :class="{
      [$style['button-group']]: true,
      [$style['button-group--stretch']]: stretch,
      [$style['button-group--radio']]: radio,
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VButtonGroup',

  props: {
    stretch: {
      type: Boolean,
      default: false,
    },

    radio: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./buttons.scss" module />
