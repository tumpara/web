<template>
  <component
    :is="radioGroup?.buttons.value ? 'VButton' : 'label'"
    :for="name"
    :selected="
      radioGroup?.buttons.value ? radioGroup?.value.value === value : undefined
    "
    class="checkbox-container"
  >
    <input
      :id="id"
      v-model="radioGroup.value.value"
      :name="radioGroup?.name.value ?? id"
      class="checkbox-control aria-only"
      type="radio"
      :value="value"
      v-bind="$attrs"
    />
    <slot v-if="radioGroup?.buttons.value"></slot>
    <template v-else>
      <span class="checkbox-mark checkbox-mark--radio" aria-hidden="true">
        <PhAsterisk />
      </span>
      <span class="checkbox-label"><slot></slot></span>
    </template>
  </component>
</template>

<script lang="ts">
import { PhAsterisk } from 'phosphor-vue';
import { defineComponent, inject, ref } from 'vue';

import VButton from '../buttons/VButton.vue';
import { Form } from './VForm.vue';
import { RadioGroupScope } from './VRadioGroup.vue';

export default defineComponent({
  name: 'VCheckbox',

  components: { PhAsterisk, VButton },

  inheritAttrs: false,

  props: {
    modelValue: { type: Boolean },

    id: {
      type: String,
      required: true,
    },

    value: {
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

    const radioGroup = inject(RadioGroupScope);

    return { form, radioGroup };
  },
});
</script>

<style lang="scss" src="./checkbox.scss"></style>
