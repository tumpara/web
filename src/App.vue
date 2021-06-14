<template>
  <VApp>
    <template v-if="ready" #header-left>
      <AppHeaderTitle />
    </template>

    <template v-if="ready" #header-right>
      <AppHeaderUserInfo />
    </template>

    <router-view v-if="ready" />
  </VApp>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import AppHeaderTitle from '@/components/AppHeaderTitle.vue';
import AppHeaderUserInfo from '@/components/AppHeaderUserInfo.vue';
import { VApp } from '@/interface';

import { initializeIntl } from './intl';

export default defineComponent({
  name: 'App',

  components: { VApp, AppHeaderTitle, AppHeaderUserInfo },

  setup() {
    const { loadedLocale } = initializeIntl();

    const ready = computed(() => loadedLocale.value !== undefined);

    return { ready };
  },
});
</script>
