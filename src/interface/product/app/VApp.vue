<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header-section app-header-section--left">
        <slot name="header-left"></slot>
      </div>
      <div class="app-header-section">
        <slot name="header-center"></slot>
      </div>
      <div class="app-header-section app-header-section--right">
        <slot name="header-right"></slot>
      </div>
    </header>

    <slot></slot>
  </div>

  <transition-group name="toast-" tag="div" class="app-toasts">
    <VToast
      v-for="toast in toasts"
      :key="toast"
      @click="unregisterToast(toast)"
    >
      {{ toast.message }}
    </VToast>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue';

import VToast from '../../core/cards/VToast.vue';
import { SidebarCollapsed } from '../sidebar/VSidebar.vue';
import { setupToasts } from './toasts';

export default defineComponent({
  name: 'VApp',

  components: { VToast },

  provide: {
    // These defaults are for Phosphor icons, which are scaled down a bit
    // because the UI is rendered at 14px.
    color: 'currentColor',
    size: 14, // TODO This should be 0.875rem, but that raises warnings
    weight: 'bold',
  },

  setup() {
    const { toasts, unregisterToast } = setupToasts();
    provide(SidebarCollapsed, ref(false));

    return { toasts, unregisterToast };
  },
});
</script>

<style lang="scss" src="../../core/global.scss"></style>
<style lang="scss" src="./app.scss"></style>

<style lang="scss" scoped>
@use '../../lib/motion';

.toast--enter-active,
.toast--leave-active {
  transition: opacity motion.$subtle, transform motion.$subtle;
}

.toast--enter-from,
.toast--leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.toast--move {
  transition: transform motion.$gentle;
}
</style>
