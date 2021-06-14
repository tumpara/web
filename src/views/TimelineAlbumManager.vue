<template>
  <VSubview :title="subviewTitle">
    <template #header-extra>
      <VCheckbox
        v-model="showArchived"
        name="showArchived"
        :label="showArchivedCheckboxLabel"
      />
      <TimelineAlbumCreateButton @album-id="navigateToAlbum" />
    </template>

    <TimelineAlbumList mode="link" :show-archived="showArchived" />
  </VSubview>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useIntl } from 'vue-intl';
import { useRouter } from 'vue-router';

import {
  TimelineAlbumCreateButton,
  TimelineAlbumList,
} from '@/components/timeline';
import { VCheckbox, VSubview } from '@/interface';

export default defineComponent({
  name: 'TimelineAlbumManager',

  components: {
    VCheckbox,
    VSubview,
    TimelineAlbumCreateButton,
    TimelineAlbumList,
  },

  setup() {
    const { formatMessage } = useIntl();
    const router = useRouter();

    const subviewTitle = formatMessage({
      description: 'timeline album manager title',
      defaultMessage: 'All Albums',
    });

    const showArchived = ref(false);
    const showArchivedCheckboxLabel = formatMessage({
      description: 'show archived timeline albums toggle',
      defaultMessage: 'Show archived',
    });

    function navigateToAlbum(id: string) {
      router.push({
        name: 'TimelineAlbumDetails',
        params: { id },
      });
    }

    return {
      subviewTitle,
      showArchived,
      showArchivedCheckboxLabel,
      navigateToAlbum,
    };
  },
});
</script>
