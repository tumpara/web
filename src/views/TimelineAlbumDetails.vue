<template>
  <div :class="$style.container">
    <h2 contenteditable="true" @blur="handleNameBlur($event.target)">
      {{ albumDetails?.name }}
    </h2>

    <p v-if="albumDetails?.archived" class="hint">
      {{
        formatMessage({
          description: 'archived timeline album hint',
          defaultMessage:
            'This album is archived. It will not show up unless you have the exact link or you explicitly search for archived albums.',
        })
      }}
    </p>

    <div>
      <VButtonGroup stretch>
        <VButton @click="toggleArchive">
          <PhArchive />
          {{
            albumDetails?.archived
              ? formatMessage({
                  description: 'unarchive button',
                  defaultMessage: 'Unarchive',
                })
              : formatMessage({
                  description: 'archive button',
                  defaultMessage: 'Archive',
                })
          }}
        </VButton>
        <MembershipsDialog :host-id="albumId" copy-style="sharing" />
      </VButtonGroup>
    </div>
  </div>

  <TimelineView />
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import { PhArchive } from 'phosphor-vue';
import { computed, defineComponent, provide } from 'vue';
import { useIntl } from 'vue-intl';
import { useRoute } from 'vue-router';

import MembershipsDialog from '@/components/MembershipsDialog.vue';
import {
  provideFullTimeline,
  provideTimelineSettings,
  TimelineView,
} from '@/components/timeline';
import {
  useTimelineAlbumDetailsQuery,
  useUpdateTimelineAlbumMutation,
} from '@/graphql';
import { useToasts, VButton, VButtonGroup } from '@/interface';
import { provideSelection } from '@/utils/selection';

export default defineComponent({
  name: 'TimelineAlbumDetails',

  components: {
    PhArchive,
    MembershipsDialog,
    TimelineView,
    VButton,
    VButtonGroup,
  },

  setup() {
    const { showToast, showNetworkErrorToast } = useToasts();
    const { formatMessage } = useIntl();

    const route = useRoute();
    const albumId = computed(() =>
      Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    );

    const query = useTimelineAlbumDetailsQuery(() => ({ id: albumId.value }));
    const albumDetails = useResult(query.result, null, (data) =>
      data.node?.__typename === 'TimelineAlbum' ? data.node : null
    );
    query.onError(() => {
      showNetworkErrorToast(
        formatMessage({
          description: 'timeline album details query error',
          defaultMessage:
            'Something went wrong while getting the album details.',
        })
      );
    });

    const mutation = useUpdateTimelineAlbumMutation({
      refetchQueries: ['TimelineAlbums'],
    });
    mutation.onDone(() => {
      showToast(
        formatMessage({
          description: 'timeline album update success',
          defaultMessage: 'Successfully updated information on the album.',
        })
      );
    });
    mutation.onError(() => {
      showNetworkErrorToast(
        formatMessage({
          description: 'timeline album update error',
          defaultMessage: 'Something went wrong while updating the album.',
        })
      );
    });

    function handleNameBlur(element: HTMLHeadingElement) {
      if (albumDetails.value === null) {
        return;
      }

      const value = element.innerText.trim();

      if (value.length === 0) {
        showToast(
          formatMessage({
            description: 'empty timeline album name error',
            defaultMessage: 'An album cannot have an empty name.',
          })
        );
        element.innerText = albumDetails.value.name;
        return;
      }

      mutation.mutate({
        input: {
          id: albumId.value,
          name: value,
        },
      });
    }

    function toggleArchive() {
      if (albumDetails.value === null) {
        return;
      }
      mutation.mutate({
        input: {
          id: albumId.value,
          archived: !albumDetails.value.archived,
        },
      });
    }

    provideFullTimeline(
      computed(() => ({
        albums: { include: [albumId.value] },
      }))
    );
    provideTimelineSettings();
    provideSelection();
    provide('removeFromAlbumId', albumId);

    return {
      formatMessage,
      albumId,
      albumDetails,
      handleNameBlur,
      toggleArchive,
    };
  },
});
</script>

<style lang="scss" module>
@use '../interface/lib/layout';

.container {
  grid-area: panel;
  width: clamp(20rem, 25vw, 30rem);
  padding: layout.$normal-gap;
  border-right: 1px solid var(--guideline-color);
}
</style>
