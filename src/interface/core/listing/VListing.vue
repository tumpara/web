<template>
  <ul
    class="listing"
    :class="{ 'listing--center': center, 'listing--blocks': blocks }"
  >
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VListing',

  props: {
    center: {
      type: Boolean,
      default: false,
    },

    blocks: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./listing.scss"></style>
