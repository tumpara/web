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
import { IntlShape } from '@formatjs/intl';
import { defineComponent, inject } from 'vue';
import { provideIntl } from 'vue-intl';

import AppHeaderTitle from '@/components/AppHeaderTitle.vue';
import AppHeaderUserInfo from '@/components/AppHeaderUserInfo.vue';
import { VApp } from '@/interface';

import { IntlInitialized } from './intl';

export default defineComponent({
  name: 'App',

  components: { VApp, AppHeaderTitle, AppHeaderUserInfo },

  setup() {
    const ready = inject(IntlInitialized);

    // TODO This little workaround will no longer be necessary once we upgrade
    // to a version of FormatJS with this commit merged:
    // https://github.com/formatjs/formatjs/commit/0eb9dc6c60e9256db9b1bd1f00dafb000c087ac0
    const intl = inject<IntlShape>('intl');
    if (intl !== undefined) {
      provideIntl(intl);
    }

    return { ready };
  },
});
</script>
