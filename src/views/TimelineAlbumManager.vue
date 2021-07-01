<template>
  <VSubview
    :title="
      $formatMessage({
        description: 'timeline album manager title',
        defaultMessage: 'All Albums',
      })
    "
  >
    <template #header-extra>
      <VCheckbox
        v-model="showArchived"
        name="showArchived"
        :label="
          $formatMessage({
            description: 'show archived timeline albums toggle',
            defaultMessage: 'Show archived',
          })
        "
      />
      <TimelineAlbumCreateButton @album-id="navigateToAlbum" />
    </template>

    <TimelineAlbumList mode="link" :show-archived="showArchived" />
  </VSubview>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
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
    const router = useRouter();

    const showArchived = ref(false);

    function navigateToAlbum(id: string) {
      router.push({
        name: 'TimelineAlbumDetails',
        params: { id },
      });
    }

    return {
      showArchived,
      navigateToAlbum,
    };
  },
});
</script>
