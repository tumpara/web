<template>
  <div class="input-label" :class="{ 'aria-only': !form }">
    <slot name="label"></slot>
  </div>
  <VButtonGroup v-if="buttons" stretch radio>
    <slot></slot>
  </VButtonGroup>
  <div v-else class="input-subgrid">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  InjectionKey,
  provide,
  Ref,
  ref,
  toRef,
  watch,
} from 'vue';

import { ReadonlyRef } from '@/utils';

import VButtonGroup from '../buttons/VButtonGroup.vue';
import { Form } from './VForm.vue';

export const RadioGroupScope: InjectionKey<{
  name: ReadonlyRef<string>;
  buttons: ReadonlyRef<boolean>;
  value: Ref<string>;
}> = Symbol();

export default defineComponent({
  name: 'VInput',

  components: { VButtonGroup },

  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      required: true,
    },

    buttons: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    'update:modelValue': (value: unknown) => typeof value === 'string',
  },

  setup(props, { emit }) {
    const form = inject(Form, null);
    form?.useInput(ref(true));

    const currentValue = ref(props.modelValue);
    watch(props, (value, previousValue) => {
      if (value.modelValue !== previousValue.modelValue) {
        currentValue.value = value.modelValue;
      }
    });
    watch(currentValue, (value, previousValue) => {
      if (value !== previousValue) {
        emit('update:modelValue', value);
      }
    });

    provide(RadioGroupScope, {
      name: toRef(props, 'name'),
      buttons: toRef(props, 'buttons'),
      value: currentValue,
    });

    return { form };
  },
});
</script>

<style lang="scss" src="./input.scss"></style>
