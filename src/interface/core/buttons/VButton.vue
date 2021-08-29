<template>
  <component
    :is="elementName"
    :class="{
      [$style.button]: true,
      [$style['button--selected']]: selected,
      [$style['button--primary']]: primary,
      [$style['button--light']]: light,
      [$style['button--small']]: small,
      [$style['button--disabled']]: disabled,
    }"
    :type="
      elementName === 'button' ? (submit ? 'submit' : 'button') : undefined
    "
    role="button"
    :disabled="disabled"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';

import { DetailsSummaryScope } from '../details/VDetails.vue';
import { RadioGroupScope } from '../forms/VRadioGroup.vue';

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
    const detailsSummary = inject(DetailsSummaryScope, false);
    const radioGroup = inject(RadioGroupScope);

    const elementName = computed(() => {
      if (radioGroup?.buttons.value) {
        return 'label';
      } else if (detailsSummary) {
        return 'summary';
      } else {
        return 'button';
      }
    });

    return { elementName };
  },
});
</script>

<style lang="scss" src="./buttons.scss" module />
