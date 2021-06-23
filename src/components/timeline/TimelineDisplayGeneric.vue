<template>
  <div :class="$style.unknown">
    <p>
      {{
        $formatMessage({
          description: 'unknown timeline entry type fallback message',
          defaultMessage:
            "Cannot display this item because this client does not support it's type. Probably the server has a non-default plugin installed. Contact your administrator for details.",
        })
      }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TimelineDisplayGeneric',
});
</script>

<style lang="scss" module>
.unknown {
  display: flex;
  align-items: center;
  justify-content: center;

  > p {
    text-align: center;
  }
}
</style>
