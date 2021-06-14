<template>
  <VButton :disabled="loading" @click="mutate">
    <PhPlusCircle />
    {{
      formatMessage({
        description: 'create timeline album button',
        defaultMessage: 'Create',
      })
    }}
  </VButton>
</template>

<script lang="ts">
import { PhPlusCircle } from 'phosphor-vue';
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import { useCreateTimelineAlbumMutation } from '@/graphql';
import { VButton } from '@/interface';
import { useToasts } from '@/interface/product/app/VApp.vue';

export default defineComponent({
  name: 'TimelineAlbumCreateButton',

  components: { VButton, PhPlusCircle },

  emits: {
    // The ID of the new album, once it is created.
    albumId: (id: unknown) => typeof id === 'string' && id.length > 0,
  },

  setup(props, { emit }) {
    const { showNetworkErrorToast } = useToasts();
    const { formatMessage } = useIntl();

    const mutation = useCreateTimelineAlbumMutation({
      variables: {
        input: {
          name: formatMessage({
            description: 'default timeline album name',
            defaultMessage: 'Unnamed album',
          }),
        },
      },
    });

    mutation.onDone((result) => {
      const albumId = result.data?.createTimelineAlbum?.album?.id ?? null;
      if (albumId !== null) {
        emit('albumId', albumId);
      }
    });

    mutation.onError(() =>
      showNetworkErrorToast(
        formatMessage({
          description: 'timeline album create error',
          defaultMessage: 'Something went wrong while creating a new album.',
        })
      )
    );

    return {
      formatMessage,
      loading: mutation.loading,
      mutate: mutation.mutate,
    };
  },
});
</script>
