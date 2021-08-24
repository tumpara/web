<template>
  <VMenuInput v-model="query" type="text" auto-focus />
  <VMenuStatus v-if="loading">Loading...</VMenuStatus>
  <VMenuButton
    v-for="album in albums"
    v-else-if="albums.length > 0"
    :key="album.id"
    @click="$emit('selected', album)"
  >
    {{ album.name }}
  </VMenuButton>
  <VMenuStatus v-else-if="query.length > 0">No results</VMenuStatus>
  <VMenuStatus v-else>Search for an album above.</VMenuStatus>
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import { defineComponent, ref } from 'vue';

import {
  TimelineAlbumQuickSearchQuery,
  useTimelineAlbumQuickSearchQuery,
} from '@/graphql';
import { VMenuButton, VMenuInput, VMenuStatus } from '@/interface';
import { ExtractArrayMaybe } from '@/utils';

type Album = NonNullable<
  ExtractArrayMaybe<
    NonNullable<TimelineAlbumQuickSearchQuery['timelineAlbums']>['edges']
  >['node']
>;

export default defineComponent({
  name: 'TimelineAlbumSearchMenuItems',

  components: { VMenuButton, VMenuInput, VMenuStatus },

  emits: {
    selected: (value: unknown) =>
      typeof value === 'object' &&
      value !== null &&
      (value as any).id !== undefined,
  },

  setup() {
    const query = ref('');

    const { result, loading } = useTimelineAlbumQuickSearchQuery(() => ({
      query: query.value,
    }));
    const albums = useResult(
      result,
      [],
      (data) =>
        data.timelineAlbums?.edges
          .map((edge) => edge?.node)
          .filter((node) => node !== undefined) as Album[]
    );

    return { query, loading, albums };
  },
});
</script>
