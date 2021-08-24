<template>
  <li>
    <p class="menu-item menu-item--status" v-bind="$attrs">
      <slot></slot>
    </p>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VMenuStatus',

  inheritAttrs: false,
});
</script>

<style lang="scss" src="./menu.scss"></style>
