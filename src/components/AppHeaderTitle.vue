<template>
  <VNavigator :class="$style.navigator">
    <template #activator>
      <svg
        :class="$style.wordmark"
        viewBox="0 0 1832 400"
        :aria-label="
          $formatMessage({
            description: 'app wordmark aria label',
            defaultMessage: 'Tumpara logo',
          })
        "
      >
        <g :class="$style.icon">
          <path
            :class="$style.ear"
            d="M294.01,123.419c-1.624,-10.198 2.879,-21.973 10.204,-29.253c9.79,-9.728 35.235,-24.955 48.531,-29.113c10.03,-3.136 28.473,-1.736 31.25,4.167c2.778,5.902 -12.152,20.138 -14.583,31.25c-2.43,11.111 3.922,24.314 0,35.416c-3.922,11.102 -14.436,27.025 -23.531,31.197c-9.095,4.172 -22.968,0.629 -31.038,-6.164c-8.645,-7.277 -19.061,-26.374 -20.833,-37.5Z"
          />
          <path
            :class="$style.ear"
            d="M115.942,91.676c1.171,-12.085 -27.777,-1.042 -37.5,-8.333c-9.722,-7.292 -14.236,-29.167 -20.833,-35.417c-4.565,-4.325 -13.358,-5.319 -18.75,-2.083c-6.944,4.166 -21.305,15.367 -22.917,27.083c-1.864,13.552 5.954,41.765 11.728,54.228c4.314,9.311 15.625,15.769 22.917,20.552c6.235,4.09 15.172,13 20.833,8.147c10.893,-9.339 43.352,-52.092 44.522,-64.177Z"
          />
          <path
            :class="$style.eyes"
            d="M245.833,89.583l-175,29.167l10.417,102.083l145.833,16.667l91.667,-2.083l10.417,-64.584l-83.334,-81.25Z"
          />
          <path
            :class="$style.face"
            d="M119.244,251.413c0,0 -28.497,5.767 -40.03,1.087c-11.532,-4.681 -24.211,-16.342 -29.166,-29.167c-5.903,-15.278 -9.722,-42.361 -6.25,-62.5c3.472,-20.139 13.541,-43.75 27.083,-58.333c13.542,-14.584 34.687,-22.932 54.167,-29.167c19.48,-6.236 41.631,-8.595 62.712,-8.247c21.911,0.362 47.917,4.514 68.75,10.417c19.742,5.593 41.32,13.889 56.25,25c14.269,10.618 27.734,24.784 33.333,41.666c6.215,18.736 9.198,50.97 3.955,70.747c-5.091,19.198 -21.875,38.195 -35.417,47.917c-12.727,9.137 -45.833,10.417 -45.833,10.417c-0,-0 11.923,19.215 11.575,29.631c-0.347,10.417 -4.47,25.363 -13.659,32.869c-10.957,8.95 -35.069,17.708 -52.083,20.833c-16.407,3.013 -33.605,0.991 -50,-2.083c-16.667,-3.125 -38.889,-8.681 -50,-16.667c-9.586,-6.89 -14.429,-21.605 -16.667,-31.25c-2.019,-8.707 -0.079,-18.32 3.243,-26.618c3.546,-8.862 18.037,-26.552 18.037,-26.552Zm126.637,-108.583c-9.502,4.81 -19.859,18.096 -23.679,28.86c-3.819,10.764 -5.615,27.686 0.762,35.723c6.377,8.038 24.653,12.5 37.5,12.5c12.848,0 31.945,-3.472 39.584,-12.5c7.639,-9.027 9.722,-30.902 6.25,-41.666c-3.472,-10.764 -17.014,-19.098 -27.084,-22.917c-10.069,-3.819 -23.831,-4.81 -33.333,-0Zm-120.318,-21.68c-10.764,1.389 -27.431,7.292 -33.333,16.667c-5.903,9.375 -5.903,28.819 -2.084,39.583c3.82,10.764 13.567,22.142 25,25c12.5,3.125 39.584,0.695 50,-6.25c10.417,-6.944 13.889,-24.305 12.5,-35.417c-1.389,-11.111 -12.152,-24.652 -20.833,-31.25c-8.583,-6.523 -20.558,-9.712 -31.25,-8.333Z"
          />
        </g>
        <g :class="$style.text">
          <path
            d="M533.333,105.617l0,41.566l49.6,0l0,150.4l51.167,0l0,-150.4l49.6,0l0,-41.566l-150.367,-0Z"
          />
          <path
            d="M812.533,105.617l0,115.2c0,21.6 -10.406,33.6 -28.816,33.6c-18.411,-0 -28.817,-12 -28.817,-33.6l0,-115.2l-51.167,-0l0,115.2c0,51.453 28.515,79.966 79.984,79.966c51.468,0 79.983,-28.513 79.983,-79.966l0,-115.2l-51.167,-0Z"
          />
          <path
            d="M980.783,179.203l-86.383,-79.986l0,198.366l51.167,0l-0,-94.384l35.216,32.795l35.217,-32.795l0,94.384l51.167,0l-0,-198.366l-86.384,79.986Z"
          />
          <path
            d="M1171.18,105.617l-71.977,-0l0,191.966l51.167,0l-0,-66.133l20.81,0c67.474,0 94.39,-17.852 94.39,-62.917c-0,-44.797 -26.916,-62.916 -94.39,-62.916Zm0,84.266l-20.81,0l-0,-42.7l20.81,0c32.284,0 43.223,5.338 43.223,21.35c0,16.013 -10.939,21.35 -43.223,21.35Z"
          />
          <path
            d="M1347.72,99.217l-92.8,198.366l185.6,0l-92.8,-198.366Zm-0,105.866l25.333,54.134l-50.667,-0l25.334,-54.134Z"
          />
          <path
            d="M1631.43,297.583l-46.638,-71.462c30.38,-8.26 43.438,-26.379 43.438,-57.588c0,-44.797 -26.916,-62.916 -94.389,-62.916l-71.977,-0l-0,191.966l51.166,0l0,-66.133l18.143,0l42.956,66.133l57.301,0Zm-118.4,-150.4l20.811,0c32.284,0 43.223,5.338 43.223,21.35c-0,16.013 -10.939,21.35 -43.223,21.35l-20.811,0l0,-42.7Z"
          />
          <path
            d="M1737.05,99.217l-92.8,198.366l185.6,0l-92.8,-198.366Zm0,105.866l25.333,54.134l-50.666,-0l25.333,-54.134Z"
          />
        </g>
      </svg>
    </template>

    <router-link v-slot="{ href, navigate }" :to="{ name: 'About' }" custom>
      <VNavigatorItem :href="href" color="gray" @click="navigate">
        <PhHouse />
        {{
          $formatMessage({
            description: 'home navigator item',
            defaultMessage: 'Home',
          })
        }}
      </VNavigatorItem>
    </router-link>

    <router-link
      v-slot="{ href, navigate }"
      :to="{ name: 'TimelineMain' }"
      custom
    >
      <VNavigatorItem :href="href" color="green" @click="navigate">
        <PhCompass />
        {{
          $formatMessage({
            description: 'timeline navigator item',
            defaultMessage: 'Timeline',
          })
        }}
      </VNavigatorItem>
    </router-link>

    <router-link v-slot="{ href, navigate }" :to="{ name: 'Settings' }" custom>
      <VNavigatorItem :href="href" color="blue" @click="navigate">
        <PhGearSix />
        {{
          $formatMessage({
            description: 'settings navigator item',
            defaultMessage: 'Settings',
          })
        }}
      </VNavigatorItem>
    </router-link>

    <hr />

    <VNavigatorItem href="/api/graphql" color="gray">
      <PhPuzzlePiece />
      {{
        $formatMessage({
          description: 'api navigator item',
          defaultMessage: 'API',
        })
      }}
    </VNavigatorItem>

    <VNavigatorItem href="/admin" color="blue">
      <PhWrench />
      {{
        $formatMessage({
          description: 'admin navigator item',
          defaultMessage: 'Administration',
        })
      }}
    </VNavigatorItem>
  </VNavigator>
</template>

<script lang="ts">
import {
  PhCompass,
  PhGearSix,
  PhHouse,
  PhPuzzlePiece,
  PhWrench,
} from 'phosphor-vue';
import { defineComponent } from 'vue';

import { VNavigator, VNavigatorItem } from '@/interface';

export default defineComponent({
  name: 'AppHeaderTitle',

  components: {
    PhCompass,
    PhGearSix,
    PhHouse,
    PhPuzzlePiece,
    PhWrench,
    VNavigator,
    VNavigatorItem,
  },
});
</script>

<style lang="scss" module>
@use '../interface/lib/layout';
@use '../interface/lib/motion';

.wordmark {
  $size: 1.5rem;

  height: $size;
  overflow: visible;

  path {
    transition: fill motion.$subtle;
  }

  > .icon {
    transform: scale(1.5);
    transform-box: fill-box;
    transform-origin: center;
    transition: transform motion.$gentle;

    > .ear {
      fill: var(--widget-press-bg-color);
    }

    > .eyes {
      fill: var(--inverse-bg-color);
    }

    > .face {
      fill: var(--main-bg-color);
    }
  }

  > .text {
    fill: var(--inverse-fg-color);
    transform: scale(1.1) translateX(10%);
    transform-box: fill-box;
    transform-origin: left center;
    transition: fill motion.$subtle, transform motion.$gentle;
  }
}

.navigator > summary:hover,
.navigator[open] > summary {
  > .wordmark {
    > g {
      transform: none;
    }

    .ear {
      fill: var(--inverse-focus-bg-color);
    }

    .eyes {
      fill: var(--primary-widget-bg-color);
    }

    .face {
      fill: var(--inverse-bg-color);
    }

    > .text {
      fill: var(--main-fg-color);
    }
  }
}
</style>
