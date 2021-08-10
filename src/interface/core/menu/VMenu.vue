<template>
  <ul ref="container" class="menu">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'VMenu',

  setup() {
    const container = ref<HTMLUListElement>();

    return {
      container,
    };
  },
});
</script>

<style lang="scss" src="./menu.scss"></style>
