<template>
  <component
    :is="summaryElement ? 'summary' : 'button'"
    :class="{
      [$style.button]: true,
      [$style['button--selected']]: selected,
      [$style['button--primary']]: primary,
      [$style['button--light']]: light,
      [$style['button--small']]: small,
      [$style['button--disabled']]: disabled,
    }"
    :type="summaryElement ? (submit ? 'submit' : 'button') : undefined"
    role="button"
    :disabled="disabled"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import { DetailsSummaryScope } from '../details/VDetails.vue';

export default defineComponent({
  name: 'VButton',

  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const summaryElement = inject(DetailsSummaryScope, false);

    return { summaryElement };
  },
});
</script>

<style lang="scss" src="./buttons.scss" module />
