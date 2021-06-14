<template>
  <li>
    <a
      class="menu-item menu-item--clickable"
      :class="{ 'menu-item--active': active }"
      v-bind="$attrs"
    >
      <slot></slot>
    </a>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VMenuLink',

  inheritAttrs: false,

  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./menu.scss"></style>
