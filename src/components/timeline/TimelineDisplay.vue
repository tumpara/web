<template>
  <main :class="$style.container">
    <component
      :is="mainComponentForTypename(edge.node.__typename)"
      v-for="edge in timeline"
      :key="edge.index"
      :class="{
        [$style.entry]: true,
        [$style['entry--active']]: edge.index === index,
      }"
      :node-id="edge.node.id"
      :active="edge.index === index"
      :aria-hidden="edge.index !== index ? 'true' : undefined"
    />
  </main>

  <aside v-if="detailsVisible" :class="$style.details">
    <component
      :is="detailsComponentForTypename(activeEdge.node.__typename)"
      v-if="activeEdge"
      :node-id="activeEdge.node.id"
    />
  </aside>
</template>

<script lang="ts">
import {
  Component,
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  Ref,
  watch,
} from 'vue';

import { useTimelineSlice } from '@/components/timeline/hooks';
import TimelineDisplayGeneric from '@/components/timeline/TimelineDisplayGeneric.vue';
import TimelineDisplayGenericDetails from '@/components/timeline/TimelineDisplayGenericDetails.vue';
import TimelineDisplayPhoto from '@/components/timeline/TimelineDisplayPhoto.vue';
import TimelineDisplayPhotoDetails from '@/components/timeline/TimelineDisplayPhotoDetails.vue';
import { SidebarCollapsed } from '@/interface';
import { useSelection } from '@/utils/selection';

const TypeComponents: Record<string, [Component, Component]> = {
  Photo: [TimelineDisplayPhoto, TimelineDisplayPhotoDetails],
};

const AllComponents: Record<string, Component> = {};
for (const componentSet of Object.values(TypeComponents)) {
  for (const component of componentSet) {
    if (component.name) {
      AllComponents[component.name] = component;
    }
  }
}

export default defineComponent({
  name: 'TimelineDisplay',

  components: {
    ...AllComponents,
    TimelineDisplayGeneric,
    TimelineDisplayGenericDetails,
  },

  props: {
    index: {
      type: Number,
      required: true,
    },
  },

  emits: {
    navigate: (offset: unknown) =>
      typeof offset === 'number' && isFinite(offset),
    close: null,
    // Emitted when the currently displayed item changes. This is used to set
    // the visible timestamp.
    timestamp: (date: unknown) => date instanceof Date,
  },

  setup(props, { emit }) {
    const selection = useSelection();

    const timeline = useTimelineSlice(
      computed(() => ({
        // useTimelineSlice will silently correct these values if the fall
        // outside of the timeline.
        startIndex: props.index - 2,
        endIndex: props.index + 2,
      }))
    );

    function mainComponentForTypename(typename: string): Component {
      return TypeComponents[typename]?.[0] ?? TimelineDisplayGeneric;
    }
    function detailsComponentForTypename(typename: string): Component {
      return TypeComponents[typename]?.[1] ?? TimelineDisplayGenericDetails;
    }

    const activeEdge = computed(() =>
      timeline.value.find((edge) => edge.index === props.index)
    );
    // Set the selection to the currently active entry's ID. This is so that the
    // toolbar component will display the appropriate buttons for placing inside
    // albums, etc.
    watch(
      activeEdge,
      (edge) => {
        selection.clear();
        if (edge) {
          selection.toggleItem(edge.node.id);
          emit('timestamp', new Date(edge.node.timestamp));
        }
      },
      { immediate: true }
    );

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        emit('navigate', -1);
      } else if (event.key === 'ArrowRight') {
        emit('navigate', 1);
      } else if (event.key === 'Escape') {
        emit('close');
      }
    }

    const appSidebarCollapsed = inject(SidebarCollapsed);

    onMounted(() => {
      window.addEventListener('keydown', handleKey);

      if (appSidebarCollapsed !== undefined) {
        appSidebarCollapsed.value = true;
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKey);

      if (appSidebarCollapsed !== undefined) {
        appSidebarCollapsed.value = false;
      }

      // Clear the selection (which holds the currently active entry) so that
      // the toolbar buttons go away.
      selection.clear();
    });

    const detailsVisible = inject<Ref<boolean>>('displayDetailsVisible');

    return {
      timeline,
      mainComponentForTypename,
      detailsComponentForTypename,
      activeEdge,
      detailsVisible,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../interface/lib/layout';
@use '../../interface/lib/motion';

$animation-offset: 4rem;

.container {
  position: relative;
  overflow: hidden;
  background-color: black;
}

.entry {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateX(#{-1 * $animation-offset});
  transition: opacity motion.$gentle, transform motion.$gentle;
}

.entry--active {
  pointer-events: auto;
  transform: translateX(0);
  opacity: 1;

  ~ .entry {
    transform: translateX($animation-offset);
  }
}

.details {
  grid-area: details;
  width: clamp(20rem, 25vw, 30rem);
  padding: layout.$large-gap;
  border-left: 1px solid var(--guideline-color);
  background-color: var(--main-bg-color);

  h2,
  h3 {
    margin: 0;
  }

  p,
  ul {
    margin: layout.$small-gap 0;
  }

  hr {
    margin: layout.$normal-gap 0;
    height: 1px;
    border: none;
    background-color: var(--guideline-color);
  }

  ul {
    padding: 0;

    > li {
      display: inline-block;
      list-style: none;

      &:not(:first-child) {
        margin-left: layout.$small-gap;
      }
    }
  }
}
</style>
