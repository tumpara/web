<template>
  <div :class="$style.photo">
    <img v-if="node" :src="node?.imagePreviewUrl" :alt="altText" />
  </div>
</template>

<script lang="ts">
import { useResult, UseResultReturn } from '@vue/apollo-composable';
import { defineComponent, UnwrapRef } from 'vue';
import { useIntl } from 'vue-intl';

import {
  TimelineDisplayPhotoQuery,
  useTimelineDisplayPhotoQuery,
} from '@/graphql';

type NodeType = NonNullable<TimelineDisplayPhotoQuery['node']> & {
  __typename: 'Photo';
};

export function useNode(props: {
  nodeId: UnwrapRef<string>;
}): UseResultReturn<NodeType | null> {
  const { result } = useTimelineDisplayPhotoQuery(() => ({
    id: props.nodeId,
  }));
  return useResult<TimelineDisplayPhotoQuery, null, NodeType | null>(
    result,
    null,
    (data) => (data.node?.__typename === 'Photo' ? data.node : null)
  );
}

export default defineComponent({
  name: 'TimelineDisplayPhoto',

  props: {
    nodeId: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const { formatMessage } = useIntl();

    const node = useNode(props);

    const altText = formatMessage({
      description: 'timeline display photo alt text',
      // TODO This alt text should be a litte bit more descriptive, perhaps
      //   include the timestamp and location?
      defaultMessage: 'Preview for a photo',
    });

    return { node, altText };
  },
});
</script>

<style lang="scss" module>
.photo {
  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
