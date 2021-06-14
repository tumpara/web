<template>
  <main id="content" class="subview" v-bind="$attrs">
    <header class="subview-header">
      <h1>{{ title }}</h1>
      <div class="subview-header-toolbar">
        <slot name="header-extra"></slot>
      </div>
    </header>
    <div class="subview-content">
      <slot></slot>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VSubview',

  inheritAttrs: false,

  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" src="./subview.scss"></style>
