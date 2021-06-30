<template>
  <h2 v-if="heading">{{ heading }}</h2>
  <ul class="sidebar-group">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VSidebarGroup',

  props: {
    heading: {
      type: String,
      default: undefined,
    },
  },
});
</script>

<style lang="scss" src="./sidebar.scss"></style>
