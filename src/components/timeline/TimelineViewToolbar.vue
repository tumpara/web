<template>
  <VToolbar :primary="selectedCount > 0 && displayMode === null">
    <div class="toolbar-section">
      <h2
        v-if="selectedCount > 0 && displayMode === null"
        class="toolbar-heading"
      >
        {{
          $formatMessage(
            {
              description: 'timeline selected count',
              defaultMessage: `Selected {selectedCount, plural,
                  =0 {nothing}
                  one {an item}
                  other { {selectedCount} items}
                }`,
            },
            { selectedCount }
          )
        }}
      </h2>
      <slot v-else name="info"></slot>
    </div>

    <VToolbarSection>
      <VToolbarElement
        v-if="selectedCount > 1"
        :priority="2"
        @click="stackSelection"
      >
        <PhStack />
        {{
          $formatMessage({
            description: 'timeline stack button',
            defaultMessage: 'Stack',
          })
        }}
      </VToolbarElement>
      <VToolbarElement
        v-if="selectedCount === 1"
        :priority="2"
        @click="clearSelectionStack"
      >
        <PhStackSimple />
        {{
          $formatMessage({
            description: 'timeline clear stack button',
            defaultMessage: 'Clear stack',
          })
        }}
      </VToolbarElement>

      <!--template #010-album-add>
        <VDialog
          v-if="selectedCount > 0 && enableAlbumAdding"
          ref="albumAddDialog"
          :title="
            $formatMessage({
              description: 'timeline album add dialog title',
              defaultMessage: 'Add to an existing album',
            })
          "
          darken
        >
          <template #activator>
            <VButton>
            </VButton>
          </template>

          <div :class="$style['album-list-container']">
            <TimelineAlbumList
              mode="selection"
              vertical
              @click="addSelectionToAlbum($event)"
            />
          </div>
        </VDialog>
      </template-->
      <VToolbarElement
        v-if="selectedCount > 0 && enableAlbumAdding"
        :priority="10"
        mode="menu"
      >
        <template #button>
          <PhTray />
          {{
            $formatMessage({
              description: 'add to timeline album button',
              defaultMessage: 'Add to album',
            })
          }}
        </template>

        <TimelineAlbumSearchMenuItems @selected="addSelectionToAlbum($event)" />
      </VToolbarElement>

      <VToolbarElement
        v-if="selectedCount > 0 && removeFromAlbumId !== undefined"
        :priority="11"
        @click="removeSelectionFromAlbum"
      >
        <PhBackspace />
        {{
          $formatMessage({
            description: 'remove from timeline album button',
            defaultMessage: 'Remove from this album',
          })
        }}
      </VToolbarElement>

      <VToolbarElement
        v-if="selectedCount > 0"
        ref="visibilityElement"
        :priority="2"
        mode="menu"
      >
        <template #button>
          <PhEye />
          {{
            $formatMessage({
              description: 'set timeline visibility menu',
              defaultMessage: 'Set visibility',
            })
          }}
        </template>

        <VToolbarElementItem @click="setSelectionVisibility(Visibility.Public)">
          {{
            $formatMessage({
              description: 'timeline visibility choice - public',
              defaultMessage: 'Public',
            })
          }}
        </VToolbarElementItem>
        <VToolbarElementItem
          @click="setSelectionVisibility(Visibility.Internal)"
        >
          {{
            $formatMessage({
              description: 'timeline visibility choice - internal',
              defaultMessage: 'All logged-in users on this server',
            })
          }}
        </VToolbarElementItem>
        <VToolbarElementItem
          @click="setSelectionVisibility(Visibility.Members)"
        >
          {{
            $formatMessage({
              description: 'timeline visibility choice - members',
              defaultMessage: "Members of the item's library",
            })
          }}
        </VToolbarElementItem>
        <VToolbarElementItem @click="setSelectionVisibility(Visibility.Owners)">
          {{
            $formatMessage({
              description: 'timeline visibility choice - owners',
              defaultMessage: 'Only owners of the library',
            })
          }}
        </VToolbarElementItem>
      </VToolbarElement>

      <VToolbarElement v-if="selectedCount > 0" :priority="4" @click="archive">
        <PhArchive />
        {{
          showUnarchiveButton
            ? $formatMessage({
                description: 'unarchive button',
                defaultMessage: 'Unarchive',
              })
            : $formatMessage({
                description: 'archive button',
                defaultMessage: 'Archive',
              })
        }}
      </VToolbarElement>

      <VToolbarElement
        v-if="displayMode === null && selectedCount === 0"
        :priority="20"
        mode="compound"
      >
        <template #button>
          <PhFrameCorners />
          {{
            $formatMessage({
              description: 'view size menu',
              defaultMessage: 'View size',
            })
          }}
        </template>

        <VToolbarElementItem
          :selected="gridSize === 150"
          @click="gridSize = 150"
        >
          <PhDotsNine />
          {{
            $formatMessage({
              description: 'compact view size button',
              defaultMessage: 'Compact',
            })
          }}
        </VToolbarElementItem>
        <VToolbarElementItem
          :selected="gridSize === 250"
          @click="gridSize = 250"
        >
          <PhGridFour />
          {{
            $formatMessage({
              description: 'normal view size button',
              defaultMessage: 'Normal',
            })
          }}
        </VToolbarElementItem>
        <VToolbarElementItem
          :selected="gridSize === 350"
          @click="gridSize = 350"
        >
          <PhSquare />
          {{
            $formatMessage({
              description: 'large view size button',
              defaultMessage: 'Large',
            })
          }}
        </VToolbarElementItem>
      </VToolbarElement>

      <!--template #100-navigation>
        <VButtonGroup v-if="displayMode !== null && displayMode > 0">
          <VButton v-if="displayMode & 1" @click="$emit('navigateDisplay', -1)">
            <PhArrowLeft />
            {{
              $formatMessage({
                description: 'timeline view previous button',
                defaultMessage: 'Previous',
              })
            }}
          </VButton>
          <VButton v-if="displayMode & 2" @click="$emit('navigateDisplay', 1)">
            {{
              $formatMessage({
                description: 'timeline view next button',
                defaultMessage: 'Next',
              })
            }}
            <PhArrowRight />
          </VButton>
        </VButtonGroup>
      </template-->

      <VToolbarElement
        v-if="displayMode !== null"
        :priority="50"
        @click="displayDetailsVisible = !displayDetailsVisible"
      >
        <PhInfo />
        {{
          displayDetailsVisible
            ? $formatMessage({
                description: 'timeline display hide details button',
                defaultMessage: 'Hide details',
              })
            : $formatMessage({
                description: 'timeline display show details button',
                defaultMessage: 'Show details',
              })
        }}
      </VToolbarElement>

      <VToolbarElement
        v-if="displayMode !== null"
        :priority="50"
        @click="$emit('closeDisplay')"
      >
        <PhX />
        {{
          $formatMessage({
            description: 'timeline view close button',
            defaultMessage: 'Close',
          })
        }}
      </VToolbarElement>
      <VToolbarElement
        v-else-if="selectedCount > 0"
        :priority="101"
        @click="clearSelection"
      >
        <PhX />
        {{
          $formatMessage({
            description: 'clear selection button',
            defaultMessage: 'Clear selection',
          })
        }}
      </VToolbarElement>
    </VToolbarSection>
  </VToolbar>
</template>

<script lang="ts">
import { useApolloClient } from '@vue/apollo-composable';
import {
  PhArchive,
  // PhArrowLeft,
  // PhArrowRight,
  PhBackspace,
  PhDotsNine,
  PhEye,
  PhFrameCorners,
  PhGridFour,
  PhInfo,
  PhSquare,
  PhStack,
  PhStackSimple,
  PhTray,
  PhX,
} from 'phosphor-vue';
import {
  ComponentPublicInstance,
  defineComponent,
  inject,
  Ref,
  ref,
} from 'vue';

import {
  LibraryContentVisibility,
  useClearTimelineStackMutation,
  useOrganizeArchiveMutation,
  useOrganizeCollectionMutation,
  useSetLibraryContentVisiblityMutation,
  useStackTimelineEntriesMutation,
} from '@/graphql';
import {
  useToasts,
  // VButton,
  // VButtonGroup,
  // VCard,
  VDialog,
  // VMenu,
  // VMenuButton,
  // VPopup,
  VToolbar,
  VToolbarElement,
  VToolbarElementItem,
  VToolbarSection,
} from '@/interface';
import { useSelection } from '@/utils/selection';

import { GridSize } from './settings';
import TimelineAlbumSearchMenuItems from './TimelineAlbumSearchMenuItems.vue';
// import TimelineAlbumList from './TimelineAlbumList.vue';

/**
 * Top toolbar for the timeline browser.
 *
 * When a selection is active, the toolbar will be flipped to display relevant
 * actions for the set of selected entries. This includes a button that
 * archives them. In order to flip this behaviour (unarchiving them instead),
 * provide a truthy value as ``showUnarchiveButton``.
 */
export default defineComponent({
  name: 'TimelineBrowserToolbar',

  components: {
    PhArchive,
    // PhArrowLeft,
    // PhArrowRight,
    PhBackspace,
    PhDotsNine,
    PhEye,
    PhFrameCorners,
    PhGridFour,
    PhInfo,
    PhSquare,
    PhStack,
    PhStackSimple,
    PhTray,
    PhX,
    // VButton,
    // VButtonGroup,
    // VCard,
    // VDialog,
    // VMenu,
    // VMenuButton,
    // VPopup,
    VToolbar,
    VToolbarElement,
    VToolbarElementItem,
    VToolbarSection,
    TimelineAlbumSearchMenuItems,
    // TimelineAlbumList,
  },

  props: {
    // The current state of the display component. If this is null, the display
    // is not active. If this is an integer that is a combination of the
    // following flags:
    // - 1: Backwards navigation is possible
    // - 2: Forwards navigation is possible
    displayMode: {
      type: Number,
      default: null,
    },
  },

  emits: {
    navigateDisplay: (offset: unknown) => typeof offset === 'number',
    closeDisplay: null,
  },

  setup() {
    const { showNetworkErrorToast } = useToasts();
    const { resolveClient } = useApolloClient();

    const gridSize = inject(GridSize);
    const {
      count: selectedCount,
      clear: clearSelection,
      items: selectedIds,
      toggleItem: toggleItemSelection,
    } = useSelection();

    function clearSelectionAndApolloCache() {
      clearSelection();
      // Reset the store after the mutation ran so that we make sure nothing
      // gets left in cache.
      resolveClient().resetStore();
    }

    //
    // Archive
    //

    const showUnarchiveButton = inject<boolean>('showUnarchiveButton', false);
    const archiveMutation = useOrganizeArchiveMutation(() => ({
      variables: showUnarchiveButton
        ? {
            unarchiveIds: selectedIds.value as string[],
          }
        : {
            archiveIds: selectedIds.value as string[],
          },
    }));
    archiveMutation.onError(() => showNetworkErrorToast());
    archiveMutation.onDone(clearSelectionAndApolloCache);

    //
    // Albums
    //

    const enableAlbumAdding = inject<boolean>('enableAlbumAdding', false);
    const albumAddDialog = ref<ComponentPublicInstance<typeof VDialog>>();

    const collectionMutation = useOrganizeCollectionMutation({});
    collectionMutation.onError(() => showNetworkErrorToast());
    collectionMutation.onDone(() => {
      clearSelectionAndApolloCache();
      albumAddDialog.value?.close();
    });

    function addSelectionToAlbum(album: { id: string }) {
      if (!enableAlbumAdding) {
        return;
      }
      collectionMutation.mutate({
        collectionId: album.id,
        addItemIds: selectedIds.value as string[],
      });
    }

    const removeFromAlbumId = inject<Ref<string | undefined>>(
      'removeFromAlbumId',
      ref(undefined)
    );
    function removeSelectionFromAlbum() {
      if (removeFromAlbumId.value === undefined) {
        return;
      }
      collectionMutation.mutate({
        collectionId: removeFromAlbumId.value,
        removeItemIds: selectedIds.value as string[],
      });
    }

    //
    // Stacking
    //

    const stackMutation = useStackTimelineEntriesMutation({});
    collectionMutation.onError(() => showNetworkErrorToast());
    stackMutation.onDone((result) => {
      clearSelectionAndApolloCache();

      // After creating / updating a stack, select the representative.
      const representativeId = (
        result.data?.stackTimelineEntries?.entries ?? []
      ).find((entry) => entry?.stackRepresentative)?.id;
      if (representativeId !== undefined) {
        toggleItemSelection(representativeId);
      }
    });
    function stackSelection() {
      if (selectedCount.value <= 1) {
        return;
      }
      stackMutation.mutate({ ids: selectedIds.value as string[] });
    }

    const clearStackMutation = useClearTimelineStackMutation({});
    collectionMutation.onError(() => showNetworkErrorToast());
    clearStackMutation.onDone((result) => {
      clearSelectionAndApolloCache();

      // After the stack has been cleared, select the entries again. This lets
      // the user re-stack them after modifying the selection.
      for (const entry of result.data?.unstackTimelineEntry?.entries ?? []) {
        if (entry === null) {
          continue;
        }
        toggleItemSelection(entry.id);
      }
    });
    function clearSelectionStack() {
      if (selectedCount.value !== 1) {
        return;
      }
      clearStackMutation.mutate({ id: selectedIds.value[0] as string });
    }

    //
    // Visibility
    //

    const visibilityElement =
      ref<ComponentPublicInstance<typeof VToolbarElement>>();
    function closeVisibilityElementMenu() {
      if (visibilityElement.value !== undefined) {
        visibilityElement.value.menuOpen = false;
      }
    }

    const visibilityMutation = useSetLibraryContentVisiblityMutation({});
    visibilityMutation.onError(() => {
      showNetworkErrorToast();
      closeVisibilityElementMenu();
    });
    visibilityMutation.onDone(() => closeVisibilityElementMenu());

    function setSelectionVisibility(visibility: LibraryContentVisibility) {
      visibilityMutation.mutate({
        ids: selectedIds.value as string[],
        visibility,
      });
    }

    //
    // Other
    //

    const displayDetailsVisible = inject<Ref<boolean>>('displayDetailsVisible');

    return {
      gridSize,
      selectedCount,
      clearSelection,
      // Archive
      showUnarchiveButton,
      archive: archiveMutation.mutate,
      // Albums
      enableAlbumAdding,
      addSelectionToAlbum,
      removeFromAlbumId,
      removeSelectionFromAlbum,
      // Stacking
      stackSelection,
      clearSelectionStack,
      // Visibility
      Visibility: LibraryContentVisibility,
      visibilityElement,
      setSelectionVisibility,
      // Other
      displayDetailsVisible,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../interface/lib/layout';

.album-list-container {
  margin: #{-1 * layout.$normal-gap};
  padding: layout.$normal-gap;
  max-height: 60vh;
  overflow-y: auto;

  > ul {
    margin-top: 0;
  }
}
</style>
