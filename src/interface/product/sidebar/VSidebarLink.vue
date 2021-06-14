<template>
  <li class="sidebar-link-container">
    <a
      href="#"
      class="sidebar-link"
      :class="{
        'sidebar-link--active': active,
        'sidebar-link--hinted': hinted,
      }"
      v-bind="$attrs"
    >
      <div v-if="hasIcon" class="sidebar-link-icon" aria-hidden="true">
        <slot name="icon"></slot>
      </div>
      <span class="sidebar-link-label">
        <slot></slot>
      </span>
    </a>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'VSidebarLink',

  // Provide defaults for phosphor icons
  provide: {
    color: 'currentColor',
    size: 19, // TODO This should be 1.2rem, but that raises warnings
    weight: 'regular',
  },

  inheritAttrs: false,

  props: {
    active: {
      type: Boolean,
      default: false,
    },

    hinted: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { slots }) {
    const hasIcon = computed(() => !!slots.icon);

    return { hasIcon };
  },
});
</script>

<style lang="scss" src="./link.scss"></style>
