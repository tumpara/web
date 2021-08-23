<template>
  <label :for="name" class="input-label" :class="{ 'aria-only': !form }">
    {{ label }}
  </label>
  <div class="input-container" :class="{ 'input-container--spread': spread }">
    <input
      :id="name"
      :name="name"
      class="input-control"
      :class="{ invalid: !valid && form?.validationVisible }"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <template v-if="form?.validationVisible">
      <p
        v-for="message in validationMessages"
        :key="message"
        class="input-validation"
      >
        {{ message }}
      </p>
    </template>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { useIntl } from 'vue-intl';

import { Form } from './VForm.vue';

export default defineComponent({
  name: 'VInput',

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

    label: {
      type: String,
      required: true,
    },

    spread: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    'update:modelValue': (value: unknown) => typeof value === 'string',
  },

  setup(props) {
    const { formatMessage } = useIntl();

    const validationMessages = computed(() => {
      const result: string[] = [];
      if (props.modelValue?.length === 0) {
        result.push(
          formatMessage({
            description: 'empty input validation message',
            defaultMessage: 'Empty values are not allowed here.',
          })
        );
      }
      return result;
    });
    const valid = computed(() => validationMessages.value.length === 0);

    const form = inject(Form, null);
    form?.useInput(valid);

    return { validationMessages, valid, form };
  },
});
</script>

<style lang="scss" src="./input.scss"></style>
