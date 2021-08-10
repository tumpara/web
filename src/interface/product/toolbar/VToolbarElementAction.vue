<template>
  <component :is="component">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, inject, InjectionKey, PropType } from 'vue';

import { ReadonlyRef } from '@/utils';

import { VButton, VMenuButton } from '../..';
import { RenderMode } from './VToolbarSection.vue';

export const ActionMode: InjectionKey<ReadonlyRef<RenderMode>> = Symbol();

export default defineComponent({
  name: 'VToolbarElementAction',

  props: {
    mode: {
      type: String as PropType<RenderMode | undefined>,
      required: false,
    },
  },

  setup(props) {
    const injectedMode = inject(ActionMode);

    const component = computed(() => {
      const mode = props.mode ?? injectedMode?.value ?? 'menu';
      return mode === 'menu' ? VMenuButton : VButton;
    });

    return { component };
  },
});
</script>
