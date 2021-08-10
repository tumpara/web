<template>
  <li v-if="!summaryElement">
    <button
      class="menu-item menu-item--clickable"
      :class="{ 'menu-item--active': active }"
      v-bind="$attrs"
    >
      <slot></slot>
    </button>
  </li>

  <summary
    v-else
    class="menu-item menu-item--clickable"
    :class="{ 'menu-item--active': active }"
    v-bind="$attrs"
  >
    <slot></slot>
  </summary>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import { DetailsSummaryScope } from '@/interface/core/details/VDetails.vue';

export default defineComponent({
  name: 'VMenuButton',

  inheritAttrs: false,

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const summaryElement = inject(DetailsSummaryScope, false);

    return { summaryElement };
  },
});
</script>

<style lang="scss" src="./menu.scss"></style>
