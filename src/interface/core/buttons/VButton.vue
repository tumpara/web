<template>
  <component
    :is="buttonElement"
    :class="{
      [$style.button]: true,
      [$style['button--selected']]: selected,
      [$style['button--primary']]: primary,
      [$style['button--light']]: light,
      [$style['button--small']]: small,
      [$style['button--disabled']]: disabled,
    }"
    :type="
      buttonElement === 'input' || buttonElement === 'button'
        ? buttonType
        : undefined
    "
    role="button"
    :disabled="disabled"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, inject, InjectionKey } from 'vue';

export const ButtonElement: InjectionKey<string> = Symbol();

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

  setup(props) {
    const buttonElement = inject(ButtonElement, 'button');

    const buttonType = computed(() => {
      if (buttonElement !== 'button') {
        return undefined;
      }
      return props.submit ? 'submit' : 'button';
    });

    return { buttonElement, buttonType };
  },
});
</script>

<style lang="scss" src="./buttons.scss" module />
