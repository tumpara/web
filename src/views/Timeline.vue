<template>
  <VView color="green">
    <VSidebar>
      <nav>
        <VSidebarGroup>
          <router-link
            v-slot="{ href, navigate, isExactActive }"
            :to="{ name: 'TimelineMain' }"
            custom
          >
            <VSidebarLink
              :active="isExactActive"
              :href="href"
              @click="navigate"
            >
              <template #icon><PhCompass /></template>
              {{
                $formatMessage({
                  description: 'timeline main navigation',
                  defaultMessage: 'Timeline',
                })
              }}
            </VSidebarLink>
          </router-link>

          <router-link
            v-slot="{ href, navigate, isActive }"
            :to="{ name: 'TimelineArchive' }"
            custom
          >
            <VSidebarLink :active="isActive" :href="href" @click="navigate">
              <template #icon><PhArchive /></template>
              {{
                $formatMessage({
                  description: 'timeline archive navigation',
                  defaultMessage: 'Archive',
                })
              }}
            </VSidebarLink>
          </router-link>

          <!--router-link
            v-slot="{ href, navigate, isActive }"
            :to="{ name: 'TimelineSearch' }"
            custom
          >
            <VSidebarLink :active="isActive" :href="href" @click="navigate">
              <template #icon><PhMagnifyingGlass /></template>
              {{
                $formatMessage({
                  description: 'timeline search navigation',
                  defaultMessage: 'Search',
                })
              }}
            </VSidebarLink>
          </router-link-->
        </VSidebarGroup>

        <VSidebarGroup :heading="albumsSidebarHeading">
          <router-link
            v-for="album in albums"
            :key="album.id"
            v-slot="{ href, navigate, isActive }"
            :to="{ name: 'TimelineAlbumDetails', params: { id: album.id } }"
            custom
          >
            <VSidebarLink :active="isActive" :href="href" @click="navigate">
              <template #icon><PhFolderNotch /></template>
              {{ album.name }}
            </VSidebarLink>
          </router-link>

          <router-link
            v-slot="{ href, navigate, isActive }"
            :to="{ name: 'TimelineAlbumManager' }"
            custom
          >
            <VSidebarLink
              :active="isActive"
              :href="href"
              hinted
              @click="navigate"
            >
              <template #icon><PhDotsThree /></template>
              {{
                $formatMessage({
                  description: 'timeline album manager navigation',
                  defaultMessage: 'Show more…',
                })
              }}
            </VSidebarLink>
          </router-link>
        </VSidebarGroup>
      </nav>
    </VSidebar>

    <router-view />
  </VView>
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import {
  PhArchive,
  PhCompass,
  PhDotsThree,
  PhFolderNotch,
  // PhMagnifyingGlass,
} from 'phosphor-vue';
import { computed, defineComponent } from 'vue';
import { useIntl } from 'vue-intl';
import { useRoute } from 'vue-router';

import {
  useTimelineAlbumDetailsQuery,
  useTimelineAlbumsQuery,
} from '@/graphql';
import { VSidebar, VSidebarGroup, VSidebarLink, VView } from '@/interface';

interface Album {
  id: string;
  name: string;
}

export default defineComponent({
  name: 'Timeline',

  components: {
    PhArchive,
    PhDotsThree,
    PhCompass,
    PhFolderNotch,
    // PhMagnifyingGlass,
    VView,
    VSidebar,
    VSidebarGroup,
    VSidebarLink,
  },

  setup() {
    const { formatMessage } = useIntl();

    const albumsSidebarHeading = formatMessage({
      description: 'timeline sidebar albums heading',
      defaultMessage: 'Albums',
    });

    const albumSampleQuery = useTimelineAlbumsQuery({ includeArchived: false });
    const albumSample = useResult(
      albumSampleQuery.result,
      [] as Album[],
      (data) =>
        data.timelineAlbums?.edges
          .map((edge) => edge?.node ?? null)
          .filter((node) => node ?? false)
          .slice(0, 5) as Album[]
    );

    const route = useRoute();
    const openAlbumId = computed(() => {
      if (route.name !== 'TimelineAlbumDetails') {
        return null;
      } else {
        return Array.isArray(route.params.id)
          ? route.params.id[0]
          : route.params.id;
      }
    });
    const openAlbumNotInSample = computed(() =>
      openAlbumId.value
        ? albumSample.value.findIndex(
            (album) => album.id === openAlbumId.value
          ) < 0
        : false
    );
    const openAlbumQuery = useTimelineAlbumDetailsQuery(
      () => ({ id: openAlbumId.value as string }),
      () => ({
        enabled: openAlbumNotInSample.value,
      })
    );
    const openAlbum = useResult(
      openAlbumQuery.result,
      null,
      (data) => data.node
    );

    const albums = computed(() =>
      openAlbumNotInSample.value && openAlbum.value
        ? [...albumSample.value, openAlbum.value]
        : albumSample.value
    );

    return { albumsSidebarHeading, albums };
  },
});
</script>
