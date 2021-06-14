<template>
  <component
    :is="element"
    class="card"
    :class="{
      'card--elevated': elevated,
      'card--focused': focused,
      'card--clickable': clickable,
      'card--disabled': disabled,
      'card-content': content,
    }"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VCard',

  props: {
    element: {
      type: String,
      default: 'div',
    },
    elevated: {
      type: Boolean,
      default: false,
    },
    focused: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./card.scss"></style>
