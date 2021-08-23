<template>
  <teleport
    v-if="scope !== null"
    :to="scope.element"
    :disabled="scope.element === undefined"
  >
    <VToolbarElementItem v-if="mode === 'normal'" v-bind="$attrs">
      <slot></slot>
    </VToolbarElementItem>

    <VButtonGroup v-else-if="mode === 'compound' && scope.mode === 'button'">
      <slot></slot>
    </VButtonGroup>

    <VPopup v-else-if="scope.mode === 'button'" direction="sw">
      <template #activator>
        <VToolbarElementItem v-bind="$attrs" mode="button">
          <slot name="menu"></slot>
        </VToolbarElementItem>
      </template>

      <VCard elevated>
        <VMenu>
          <slot></slot>
        </VMenu>
      </VCard>
    </VPopup>

    <li v-else>
      <VPopup direction="sw">
        <template #activator>
          <VToolbarElementItem v-bind="$attrs">
            <slot name="menu"></slot>
          </VToolbarElementItem>
        </template>

        <VCard elevated>
          <VMenu>
            <slot></slot>
          </VMenu>
        </VCard>
      </VPopup>
    </li>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  PropType,
  provide,
  toRef,
} from 'vue';

import { VButtonGroup, VCard, VMenu, VPopup } from '../..';
import VToolbarElementItem, { ActionMode } from './VToolbarElementItem.vue';
import { UseToolbarRenderScope } from './VToolbarSection.vue';

export default defineComponent({
  name: 'VToolbarElement',

  components: { VButtonGroup, VCard, VMenu, VPopup, VToolbarElementItem },

  inheritAttrs: false,

  props: {
    priority: {
      type: Number,
      required: true,
    },
    mode: {
      type: String as PropType<'normal' | 'compound' | 'menu'>,
      default: 'normal',
      validator: (value: string) =>
        ['normal', 'compound', 'menu'].includes(value),
    },
  },

  setup(props) {
    const useToolbarRenderScope = inject(UseToolbarRenderScope);
    if (useToolbarRenderScope === undefined) {
      throw Error(
        'VToolbarAction components must be used inside a VToolbarSection component.'
      );
    }

    const scope = useToolbarRenderScope(toRef(props, 'priority'));

    provide(
      ActionMode,
      computed(() =>
        props.mode === 'menu' ? 'menu' : scope.value?.mode ?? 'menu'
      )
    );

    return { scope };
  },
});
</script>
