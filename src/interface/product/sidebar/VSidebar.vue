<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, InjectionKey, Ref, ref } from 'vue';

export const SidebarCollapsed: InjectionKey<Ref<boolean>> = Symbol();

export default defineComponent({
  name: 'VSidebar',

  setup() {
    const collapsed = inject(SidebarCollapsed, ref(false));

    return { collapsed };
  },
});
</script>

<style lang="scss" src="./sidebar.scss"></style>
