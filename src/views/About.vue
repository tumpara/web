<template>
  <VView>
    <VSubview title="Tumpara">
      <p>
        Welcome! Click
        <router-link :to="{ name: 'TimelineMain' }">here</router-link>
        to go to your timeline.
      </p>
    </VSubview>
  </VView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { VSubview, VView } from '@/interface';

export default defineComponent({
  name: 'About',

  components: { VView, VSubview },
});
</script>
