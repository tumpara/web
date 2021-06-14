<template>
  <ul class="menu">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VMenu',
});
</script>

<style lang="scss" src="./menu.scss"></style>
