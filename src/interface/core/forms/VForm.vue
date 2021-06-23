<template>
  <form
    action="#"
    class="form"
    :class="{ 'form--grid': grid }"
    @submit.prevent="submit"
  >
    <slot></slot>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  InjectionKey,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  readonly,
  Ref,
  ref,
  UnwrapRef,
} from 'vue';
import { ReadonlyRefInjectionKey } from "@/utils";

interface FormContext {
  validationVisible: true;
  useInput: (validity: Ref<Readonly<boolean>>) => void;
}

export const Form = ReadonlyRefInjectionKey<UnwrapRef<FormContext>>();

export default defineComponent({
  name: 'VForm',

  props: {
    grid: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    validSubmit: null,
  },

  setup(props, { emit }) {
    const validationVisible = ref(false);

    const inputValidities: Ref<Readonly<boolean>>[] = [];
    function useInput(validStatus: Ref<Readonly<boolean>>) {
      onMounted(() => inputValidities.push(validStatus));
      onBeforeUnmount(() =>
        inputValidities.splice(inputValidities.indexOf(validStatus), 1)
      );
    }

    function submit(event: Event) {
      event.preventDefault();
      validationVisible.value = true;

      // Check whether there is an invalid input somewhere. If so, abort.
      for (const valid of inputValidities) {
        if (!valid.value) {
          return;
        }
      }

      emit('validSubmit');
    }

    provide(
      Form,
      readonly(
        reactive({
          validationVisible,
          useInput,
        })
      )
    );

    return { submit };
  },
});
</script>

<style lang="scss" src="./form.scss"></style>
