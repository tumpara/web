<template>
  <VNavigator>
    <template #activator>
      <PhGhost size="24" />
      {{
        formatMessage({
          description: 'app header title',
          defaultMessage: 'Tumpara',
        })
      }}
    </template>

    <router-link v-slot="{ href, navigate }" :to="{ name: 'About' }" custom>
      <VNavigatorItem :href="href" color="gray" @click="navigate">
        <PhHouse />
        {{
          formatMessage({
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
          formatMessage({
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
          formatMessage({
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
        formatMessage({
          description: 'api navigator item',
          defaultMessage: 'API',
        })
      }}
    </VNavigatorItem>

    <VNavigatorItem href="/admin" color="blue">
      <PhWrench />
      {{
        formatMessage({
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
  PhGhost,
  PhHouse,
  PhPuzzlePiece,
  PhWrench,
} from 'phosphor-vue';
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import { VNavigator, VNavigatorItem } from '@/interface';

export default defineComponent({
  name: 'AppHeaderTitle',

  components: {
    PhCompass,
    PhGearSix,
    PhGhost,
    PhHouse,
    PhPuzzlePiece,
    PhWrench,
    VNavigator,
    VNavigatorItem,
  },

  setup() {
    const { formatMessage } = useIntl();

    return { formatMessage };
  },
});
</script>
