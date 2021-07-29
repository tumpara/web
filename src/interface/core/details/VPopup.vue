<template>
  <VDetails ref="details" overlay>
    <template #activator>
      <slot name="activator"></slot>
    </template>

    <div
      class="details-popup"
      :class="{
        'details-popup--nw': direction === 'nw',
        'details-popup--ne': direction === 'ne',
        'details-popup--sw': direction === 'sw',
        'details-popup--se': direction === 'se',
      }"
    >
      <slot></slot>
    </div>
  </VDetails>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import VDetails from './VDetails.vue';

export default defineComponent({
  name: 'VPopup',

  components: { VDetails },

  props: {
    direction: {
      type: String as PropType<'nw' | 'ne' | 'sw' | 'se'>,
      required: true,
      validator: (value: string) => ['nw', 'ne', 'sw', 'se'].includes(value),
    },
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
<style lang="scss" src="./popup.scss"></style>
