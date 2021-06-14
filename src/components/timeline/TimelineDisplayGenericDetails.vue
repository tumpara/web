<template>
  <h2>Details</h2>

  <p class="hint">
    {{
      formatMessage(
        {
          description: 'viewer sidebar id',
          defaultMessage: 'ID: { unmaskedId }',
        },
        { unmaskedId }
      )
    }}
  </p>

  <template v-if="node.timestamp">
    <hr />

    <h3>
      {{
        formatMessage({
          description: 'viewer sidebar timeline header',
          defaultMessage: 'Timeline',
        })
      }}
    </h3>
    <p>
      {{
        formatDate(node.timestamp, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      }}
    </p>
    <p class="hint">
      {{
        formatMessage(
          {
            description: 'viewer sidebar upload timestamp',
            defaultMessage: 'Uploaded {timestamp,date,::dMMMMyyyy}',
          },
          { timestamp: parseDate(node.createdAt) }
        )
      }}
    </p>
  </template>

  <template v-if="node.location?.coordinates?.length === 2">
    <hr />

    <h3>
      {{
        formatMessage({
          description: 'viewer sidebar location header',
          defaultMessage: 'Location',
        })
      }}
    </h3>
    <ul>
      <li>{{ node.location.coordinates[0] }}</li>
      <li>{{ node.location.coordinates[1] }}</li>
    </ul>
  </template>

  <slot></slot>

  <template v-if="node.filePath">
    <hr />

    <h3>
      {{
        formatMessage({
          description: 'viewer sidebar file header',
          defaultMessage: 'File',
        })
      }}
    </h3>
    <p>{{ node.filePath }}</p>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useIntl } from 'vue-intl';

import { TimelineDisplayBaseFragment } from '@/graphql';

export default defineComponent({
  name: 'TimelineDisplayGenericDetails',

  props: {
    node: Object as PropType<TimelineDisplayBaseFragment | null>,
    default: null,
  },

  setup(props) {
    const { formatMessage, formatDate } = useIntl();

    const parseDate = (input: string) => new Date(input);

    const unmaskedId = computed(
      () => atob(props.node?.id || '').split(':')[1] || '?'
    );

    return { formatMessage, formatDate, parseDate, unmaskedId };
  },
});
</script>
