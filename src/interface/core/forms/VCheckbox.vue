<template>
  <label :for="name" class="checkbox-container">
    <input
      :id="name"
      :name="name"
      class="checkbox-control aria-only"
      type="checkbox"
      :checked="modelValue"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="checkbox-mark" aria-hidden="true"><PhCheck /></span>
    <span class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { PhCheck } from 'phosphor-vue';
import { defineComponent, inject, ref } from 'vue';

import { Form } from './VForm.vue';

export default defineComponent({
  name: 'VCheckbox',

  components: { PhCheck },

  inheritAttrs: false,

  props: {
    modelValue: { type: Boolean },

    name: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },

  emits: {
    'update:modelValue': (value: unknown) => typeof value === 'boolean',
  },

  setup() {
    const form = inject(Form, null);
    form?.useInput(ref(true));

    return { form };
  },
});
</script>

<style lang="scss" src="./checkbox.scss"></style>
