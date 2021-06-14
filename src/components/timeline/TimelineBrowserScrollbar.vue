<template>
  <div :class="$style.scrollbar">
    <div :class="$style.container">
      <div
        :class="$style.inner"
        @click="handleClick"
        @mouseleave="mouseTop = null"
        @mousemove="mouseTop = $event.offsetY"
      >
        <span
          v-for="mark in marks"
          :key="mark"
          :class="$style.mark"
          :style="mark.style"
        >
          {{ mark.content }}
        </span>
        <div
          v-if="scrollLeaderStyle !== null"
          :class="{
            [$style.leader]: true,
            [$style['leader--hinted']]: mouseLeaderStyle !== null,
          }"
          :style="scrollLeaderStyle"
        ></div>
        <div
          v-if="mouseLeaderStyle !== null"
          :class="$style.leader"
          :style="mouseLeaderStyle"
        >
          <span v-if="mouseLeaderLabel !== null">{{ mouseLeaderLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, DeepReadonly, defineComponent, inject, Ref, ref } from 'vue';
import { useIntl } from 'vue-intl';

import { useTimeline } from './hooks';
import { ScrollInformation } from './TimelineBrowser.vue';

export default defineComponent({
  name: 'TimelineBrowserScrollbar',

  emits: {
    scrollTo: (target: unknown) =>
      typeof target === 'number' && isFinite(target),
  },

  setup(props, { emit }) {
    const { formatDate } = useIntl();

    const { totalCount, distribution } = useTimeline();

    function mouseOffsetToDate(offset: number): Date | null {
      if (totalCount.value === 0 || distribution.value.length === 0) {
        return null;
      }

      const targetIndex = Math.max(
        0,
        Math.min(totalCount.value - 1, Math.round(offset * totalCount.value))
      );
      let currentIndex = 0;

      // Find the first year that contains the desired index. That's the one
      // where the currentIndex is below the wanted index, but above it when
      // we add the entry count for that year to it.
      let year: typeof distribution.value[number] | undefined = undefined;
      let i = 0;
      do {
        if (year !== undefined) {
          currentIndex += year.totalEntryCount;
        }
        year = distribution.value[i];
        i += 1;
      } while (currentIndex + year.totalEntryCount < targetIndex);

      if (year.monthDistribution.length === 0) {
        return null;
      }

      // Do the same thing as above, but for the month. That way we can pinpoint
      // where the index is placed chronologically.
      let month: typeof year.monthDistribution[number] | undefined = undefined;
      i = 0;
      do {
        if (month !== undefined) {
          currentIndex += month.totalEntryCount;
        }
        month = year.monthDistribution[i];
        i += 1;
      } while (currentIndex + month.totalEntryCount < targetIndex);

      return new Date(year.year, month.month - 1);
    }

    const marks = computed(() => {
      if (totalCount.value === 0 || distribution.value.length === 0) {
        return [];
      }

      const start = distribution.value[0];
      const end = distribution.value[distribution.value.length - 1];

      const result = [
        {
          content: start.year,
          style: {
            top: '1rem',
          },
        },
        {
          content: end.year,
          style: {
            top: 'calc(100% - 1rem)',
          },
        },
      ];

      // Add marks for those years at about 1/4, 1/2 and 3/4 of the dataset.
      for (const targetIndex of [0.25, 0.5, 0.75].map(
        (factor) => (totalCount.value as number) * factor
      )) {
        let year: typeof distribution.value[number] | undefined = undefined;
        let i = 0,
          startIndex = 0;
        do {
          if (year !== undefined) {
            startIndex += year.totalEntryCount;
          }
          year = distribution.value[i];
          i += 1;
        } while (startIndex + year.totalEntryCount < targetIndex);

        // startIndex is now the first index of the year. We want to position
        // the mark exactly in the middle of that year.
        const middleIndex = startIndex + year.totalEntryCount / 2;
        result.push({
          content: year.year,
          style: {
            top: Math.round((middleIndex / totalCount.value) * 100) + '%',
          },
        });
      }
      return result;
    });

    const visibleArea =
      inject<Ref<DeepReadonly<ScrollInformation>>>('visibleArea');
    const scrollLeaderStyle = computed(() => {
      if (visibleArea?.value === undefined) {
        return null;
      }

      return {
        transform: `translateY(${
          visibleArea.value.scrollPercentage * visibleArea.value.clientHeight
        }px)`,
      };
    });

    const mouseTop = ref<number | null>(null);
    const mouseLeaderStyle = computed(() =>
      mouseTop.value !== null
        ? { transform: `translateY(${mouseTop.value}px)` }
        : null
    );
    const mouseLeaderLabel = computed(() => {
      if (mouseTop.value === null || visibleArea?.value === undefined) {
        return null;
      }
      const date = mouseOffsetToDate(
        mouseTop.value / visibleArea.value.clientHeight
      );

      return date !== null
        ? formatDate(date, { year: 'numeric', month: 'long' })
        : null;
    });

    function handleClick(event: MouseEvent) {
      if (visibleArea?.value === undefined) {
        return {};
      }

      const scrollTarget =
        (event.offsetY / (event.target as HTMLElement).clientHeight) *
        visibleArea.value.totalHeight;
      emit('scrollTo', scrollTarget);
    }

    return {
      marks,
      scrollLeaderStyle,
      mouseTop,
      mouseLeaderStyle,
      mouseLeaderLabel,
      handleClick,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../interface/lib/colors';
@use '../../interface/lib/layout';
@use '../../interface/lib/typography';

$width: 2.5rem;

// Wrapper around the entire set of elements. This is the one that is flexbox-
// positioned from the view.
.scrollbar {
  flex: 0 $width;
  position: sticky;
  top: 0;
  z-index: 10;
  border-left: 1px solid var(--guideline-color);
  background-color: var(--secondary-background);
}

// Outer container that makes sure no overflow gets out (otherwise the user
// could continue scrolling at the end of the list).
.container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

// Inner container that listens to touch events.
.inner {
  position: absolute;
  top: 0;
  right: 0;
  width: $width;
  height: 100%;
  pointer-events: all;
}

.mark {
  display: inline-block;
  position: absolute;
  width: 100%;
  line-height: 1;
  font-size: typography.$hinted-size;
  text-align: center;
  color: var(--hinted-fg-color);
  pointer-events: none;
  transform: translateY(-50%);
}

.leader {
  position: absolute;
  width: 100%;
  height: 0.2rem;
  margin-top: -0.1rem;
  background-color: var(--primary-widget-bg-color);
  box-shadow: 0 0 6px var(--focus-color);
  pointer-events: none;

  > span {
    display: inline-block;
    position: absolute;
    top: 0.1rem;
    right: 100%;
    padding: 0 layout.$small-gap;
    line-height: 1.5rem;
    font-size: typography.$hinted-size;
    font-weight: typography.$heading-weight;
    white-space: nowrap;
    background-color: var(--main-bg-color);
    box-shadow: layout.$subtle-shadow;
    transform: translateY(-50%);
  }
}

.leader--hinted {
  background-color: var(--hinted-fg-color);
  box-shadow: none;
}
</style>
