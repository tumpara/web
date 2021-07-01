<template>
  <VSubview
    :title="
      $formatMessage({
        description: 'profile title',
        defaultMessage: 'User profile settings',
      })
    "
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-html="text" />
  </VSubview>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import { VSubview } from '@/interface';

export default defineComponent({
  name: 'SettingsDjangoLink',

  components: { VSubview },

  setup() {
    const { formatMessage } = useIntl();

    const text = formatMessage(
      {
        description: 'settings django link text',
        defaultMessage:
          'For now, please use the <link>Django admin interface</link> for' +
          '    managing users, as this functionality is not implemented yet.',
      },
      {
        link: (content) => `<a href='/admin'>${content.join('')}</a>`,
      }
    );

    return { text };
  },
});
</script>
