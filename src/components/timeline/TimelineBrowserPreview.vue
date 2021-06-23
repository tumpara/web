<template>
  <div
    :class="{
      [$style.entry]: true,
      [$style.selected]: selected,
      [$style['stack-two']]:
        previewBackground !== null && entry?.stackSize >= 2,
      [$style['stack-three']]:
        previewBackground !== null && entry?.stackSize >= 3,
    }"
    :style="containerStyles"
    tabindex="0"
    @click="handleClick"
    @keypress.enter.prevent="handleClick"
    @keypress.space.prevent="toggleSelection"
  >
    <div
      :class="{
        [$style.preview]: true,
        [$style.image]: previewBackground !== null,
      }"
      :style="{
        backgroundImage:
          previewBackground !== null ? `url(${previewBackground})` : undefined,
      }"
    ></div>

    <ul v-if="selected" :class="$style.badges">
      <li :title="visibilityTooltip">{{ visibilityMessage }}</li>
    </ul>

    <button
      :class="$style['select-button']"
      :aria-label="selected ? 'Deselect entry' : 'Select entry'"
      tabindex="-1"
      @click="toggleSelection"
    >
      <PhCheckCircle weight="fill" size="16" />
    </button>
  </div>
</template>

<script lang="ts">
import { decode as decodeBlurhash } from 'blurhash';
import * as CSS from 'csstype';
import { PhCheckCircle } from 'phosphor-vue';
import { computed, defineComponent, PropType, ref, watchEffect } from 'vue';
import { useIntl } from 'vue-intl';

import {
  LibraryContentVisibility,
  TimelineEntryConnectionEdgesFragment,
} from '@/graphql';
import { ExtractArrayMaybe } from '@/utils';
import { useItemSelection, useSelection } from '@/utils/selection';

type EntryNode = NonNullable<
  ExtractArrayMaybe<TimelineEntryConnectionEdgesFragment['edges']>['node']
>;

export default defineComponent({
  name: 'TimelineBrowserPreview',

  components: { PhCheckCircle },

  props: {
    entry: {
      type: Object as PropType<EntryNode>,
      required: true,
    },
    layout: {
      type: Object as PropType<{ left: number; top: number }>,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    blurhashRenderer: {
      type: Object as PropType<[HTMLCanvasElement, CanvasRenderingContext2D]>,
      required: true,
    },
  },

  emits: {
    open: null,
  },

  setup(props, { emit }) {
    const { formatMessage } = useIntl();

    const visibilityMessage = computed(() => {
      switch (props.entry.visibility) {
        case LibraryContentVisibility.Public:
          return formatMessage({
            description: 'library content visibility badge - public',
            defaultMessage: 'Public',
          });
        case LibraryContentVisibility.Internal:
          return formatMessage({
            description: 'library content visibility badge - internal',
            defaultMessage: 'Logged-in users',
          });
        case LibraryContentVisibility.Members:
          return formatMessage({
            description: 'library content visibility badge - members',
            defaultMessage: 'Members',
          });
        case LibraryContentVisibility.Owners:
          return formatMessage({
            description: 'library content visibility badge - owners',
            defaultMessage: 'Owners',
          });
        default:
          return undefined;
      }
    });
    const visibilityTooltip = formatMessage({
      description: 'library content visibility tooltip',
      defaultMessage:
        'This shows who can see the item, depending on whether they have an account on this server and if they are a member in the library the item is contained in.',
    });

    const { count: selectedCount } = useSelection();
    const { selected, toggleSelection: toggleItemSelection } = useItemSelection(
      props.entry.id
    );

    function toggleSelection(event: Event) {
      event.stopPropagation();
      toggleItemSelection();
    }

    const containerBackground = ref<null | string>(null);
    const previewBackground = ref<null | string>(null);

    watchEffect((onInvalidate) => {
      let watcherInvalidated = false;
      onInvalidate(() => (watcherInvalidated = true));

      if (props.entry.blurhash) {
        const [canvas, ctx] = props.blurhashRenderer;
        const imageData = ctx.createImageData(32, 32);
        imageData.data.set(decodeBlurhash(props.entry.blurhash, 32, 32));
        ctx.putImageData(imageData, 0, 0);
        containerBackground.value = canvas.toDataURL();
      }

      if (props.entry.imagePreviewUrl) {
        // Preload the image and swap out the blurhash once it is ready.
        const image = new Image();
        image.src = props.entry.imagePreviewUrl;
        image.addEventListener('load', () => {
          if (!watcherInvalidated && props.entry.imagePreviewUrl) {
            previewBackground.value = props.entry.imagePreviewUrl;
            containerBackground.value = null;
          }
        });
      }
    });

    const containerStyles = computed(() => {
      const result: CSS.Properties = {
        top: `${props.layout.top}px`,
        left: `${props.layout.left}px`,
        width: `${props.size}px`,
        height: `${props.size}px`,
      };

      if (containerBackground.value !== null) {
        result.backgroundImage = `url(${containerBackground.value}`;
      }

      return result;
    });

    function handleClick() {
      if (selectedCount.value > 0) {
        toggleItemSelection();
      } else {
        emit('open');
      }
    }

    return {
      visibilityMessage,
      visibilityTooltip,
      selectedCount,
      selected,
      toggleSelection,
      containerStyles,
      previewBackground,
      handleClick,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../interface/lib/colors';
@use '../../interface/lib/layout';
@use '../../interface/lib/motion';
@use '../../interface/lib/typography';

.entry,
.preview {
  background-color: transparent;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.entry {
  display: flex;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: padding motion.$fast, transform motion.$fast;

  &.selected {
    padding: 1rem;

    &.stack-two::before,
    &.stack-three::after {
      opacity: 0;
    }

    .select-button {
      opacity: 1;
      background-color: var(--main-bg-color);
      color: var(--primary-hinted-color);
    }
  }

  &:hover {
    z-index: 10;

    .preview {
      box-shadow: 0 0 1rem 0.5rem var(--shadow-color);
    }
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-0.2rem);

    .select-button {
      opacity: 1;
    }

    &.stack-two::before {
      transform: translateY(0.1rem);
    }

    &.stack-three::after {
      transform: translateY(0.3rem);
    }
  }

  &:focus-visible {
    outline: #{2 * layout.$focus-outline-size} solid var(--focus-color);
  }

  &.stack-two::before,
  &.stack-three::after {
    content: '';
    position: absolute;
    z-index: -1;
    background-color: var(--inverse-bg-color);
    box-shadow: layout.$widget-shadow;
    transition: opacity motion.$subtle, transform motion.$fast;
  }

  &.stack-two::before {
    bottom: -0.2rem;
    left: 2.5%;
    width: 95%;
    height: 95%;
  }

  &.stack-three::after {
    bottom: -0.4rem;
    left: 5%;
    width: 90%;
    height: 90%;
  }
}

.preview {
  flex: 1;
  align-self: stretch;
  opacity: 0;
  transition: box-shadow motion.$subtle, opacity motion.$subtle;

  &.image {
    opacity: 1;
  }
}

.badges {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: layout.$tiny-gap;
  position: absolute;
  left: 50%;
  bottom: layout.$small-gap;
  margin: 0;
  padding: 0;
  list-style: none;
  transform: translateX(-50%);

  > li {
    padding: 0 layout.$small-gap;
    line-height: 1.2rem;
    font-size: typography.$hinted-size;
    border-radius: layout.$widget-rounding;
    background-color: var(--inverse-bg-color);
    color: var(--inverse-fg-color);
    box-shadow: layout.$widget-shadow;
  }
}

.select-button {
  position: absolute;
  top: layout.$tiny-gap;
  left: layout.$tiny-gap;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 100%;
  font-size: 1.5rem;
  line-height: 1;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  transition: color motion.$subtle, opacity motion.$subtle;

  &:focus {
    opacity: 1;
  }

  &:hover {
    color: var(--inverse-fg-color);
  }
}
</style>
