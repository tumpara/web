<template>
  <TimelineDisplayGenericDetails v-if="node" :node="node">
    <hr />

    <h3>
      {{
        formatMessage({
          description: 'viewer sidebar photo header',
          defaultMessage: 'Photo',
        })
      }}
    </h3>
    <p v-if="node.width && node.height">
      {{ node.width }} × {{ node.height }}
      <template v-if="node.megapixels">({{ node.megapixels }} MP)</template>
    </p>
    <p v-else-if="node.megapixels">{{ node.megapixels }} MP</p>

    <p>{{ node.cameraName }}</p>

    <ul class="hint">
      <li v-if="node.apertureSize">ƒ/{{ node.apertureSize }}</li>
      <li v-if="node.exposureTimeFraction">
        {{ node.exposureTimeFraction[0] }} /
        {{ node.exposureTimeFraction[1] }} s
      </li>
      <li v-if="node.focalLength">
        {{ formatNumber(node.focalLength, { maximumFractionDigits: 2 }) }} mm
      </li>
      <li v-if="node.isoValue">ISO {{ node.isoValue }}</li>
    </ul>
  </TimelineDisplayGenericDetails>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useIntl } from 'vue-intl';

import TimelineDisplayGenericDetails from './TimelineDisplayGenericDetails.vue';
import { useNode } from './TimelineDisplayPhoto.vue';

export default defineComponent({
  name: 'TimelineDisplayPhotoDetails',
  components: { TimelineDisplayGenericDetails },
  props: {
    nodeId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { formatMessage, formatNumber } = useIntl();

    const node = useNode(props);

    return { formatMessage, formatNumber, node };
  },
});
</script>
