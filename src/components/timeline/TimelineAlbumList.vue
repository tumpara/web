<template>
  <VListing :center="vertical" :blocks="!vertical">
    <template v-for="album in albums">
      <template v-if="mode === 'link'">
        <VListingCard
          :key="album.id"
          element="router-link"
          clickable
          :disabled="album.archived"
          :to="{ name: 'TimelineAlbumDetails', params: { id: album.id } }"
        >
          {{ album.name }}
        </VListingCard>
      </template>
      <template v-else-if="mode === 'selection'">
        <VListingCard
          :key="album.id"
          element="button"
          clickable
          :disabled="album.archived"
          @click="$emit('click', album)"
        >
          {{ album.name }}
        </VListingCard>
      </template>
    </template>

    <li v-if="loading || pageable" :class="$style.status">
      {{
        $formatMessage({
          description: 'loading indicator',
          defaultMessage: 'Loading…',
        })
      }}
    </li>
  </VListing>
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import { defineComponent, PropType, watchEffect } from 'vue';

import { useTimelineAlbumsQuery } from '@/graphql';
import { VListing, VListingCard } from '@/interface';

interface Album {
  id: string;
  name: string;
  archived: boolean;
}

export default defineComponent({
  name: 'TimelineAlbumList',

  components: { VListing, VListingCard },

  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },

    mode: {
      type: String as PropType<'link' | 'selection'>,
      required: true,
      validator: (value: string) => ['link', 'selection'].includes(value),
    },

    vertical: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    click: null,
  },

  setup(props) {
    const { result, loading, fetchMore, variables } = useTimelineAlbumsQuery(
      () => ({
        includeArchived: props.showArchived,
      })
    );

    const albums = useResult(
      result,
      [] as Album[],
      (data) =>
        data?.timelineAlbums?.edges
          .map((edge) => edge?.node ?? null)
          .filter((node) => node ?? false) as Album[]
    );
    const pageable = useResult(
      result,
      false,
      (data) => data?.timelineAlbums?.pageInfo.hasNextPage ?? false
    );

    // Load more albums until all are fetched.
    watchEffect(() => {
      if (result.value?.timelineAlbums?.pageInfo.hasNextPage) {
        fetchMore({
          variables: {
            cursor: result.value.timelineAlbums.pageInfo.endCursor ?? null,
            includeArchived: props.showArchived,
          },
        });
      }
    });

    return {
      loading,
      albums,
      pageable,
      variables,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../interface/lib/layout';
@use '../../interface/lib/motion';

.status {
  flex-basis: 100%;
  display: block;
  margin-bottom: layout.$small-gap;
  text-align: center;
  color: var(--hinted-fg-color);
}
</style>
