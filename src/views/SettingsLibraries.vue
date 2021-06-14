<template>
  <VSubview :title="subviewTitle">
    <VListing>
      <VListingCard v-for="library in libraries" :key="library.id" content>
        <div>
          <code>{{ library.source }}</code> ({{ library.context }})
        </div>
        <MembershipsDialog :host-id="library.id" copy-style="members" />
      </VListingCard>
    </VListing>
  </VSubview>
</template>

<script lang="ts">
import { useResult } from '@vue/apollo-composable';
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import MembershipsDialog from '@/components/MembershipsDialog.vue';
import { useLibrariesQuery } from '@/graphql';
import { VListing, VListingCard, VSubview } from '@/interface';

interface Library {
  id: string;
  source: string;
  context: string;
}

export default defineComponent({
  name: 'SettingsLibraries',

  components: { MembershipsDialog, VListing, VListingCard, VSubview },

  setup() {
    const { formatMessage } = useIntl();

    const subviewTitle = formatMessage({
      description: 'library settings title',
      defaultMessage: 'Manage Libraries',
    });

    const query = useLibrariesQuery();
    const libraries = useResult(
      query.result,
      [] as Library[],
      (data) =>
        data.libraries?.edges
          .map((edge) => edge?.node ?? null)
          .filter((node) => node ?? false) as Library[]
    );

    return { formatMessage, subviewTitle, libraries };
  },
});
</script>

<style lang="scss" scoped>
.listing > li > :deep(.card) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
