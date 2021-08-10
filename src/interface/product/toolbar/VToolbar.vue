<template>
  <div class="toolbar" :class="{ 'toolbar--primary': primary }">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VToolbar',

  props: {
    primary: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./toolbar.scss"></style>
