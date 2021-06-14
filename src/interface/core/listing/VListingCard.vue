<template>
  <li>
    <VCard v-bind="$attrs">
      <slot></slot>
    </VCard>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { VCard } from '../..';

export default defineComponent({
  name: 'VListingCard',

  components: { VCard },

  inheritAttrs: false,
});
</script>

<style lang="scss" src="./listing.scss"></style>
