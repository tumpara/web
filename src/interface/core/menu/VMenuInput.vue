<template>
  <li>
    <input
      ref="inputElement"
      class="menu-item menu-item--input"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'VMenuInput',

  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      default: '',
    },

    autoFocus: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    'update:modelValue': (value: unknown) => typeof value === 'string',
  },

  setup(props) {
    const inputElement = ref<HTMLInputElement>();

    watch(inputElement, (value, previousValue) => {
      if (
        props.autoFocus &&
        value !== undefined &&
        previousValue === undefined
      ) {
        value.focus();
      }
    });

    return { inputElement };
  },
});
</script>

<style lang="scss" src="./menu.scss"></style>
