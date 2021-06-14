<template>
  <VCard elevated class="toast">
    <div class="card-content">
      <slot></slot>
    </div>
  </VCard>
</template>

<script>
import { defineComponent } from 'vue';

import VCard from './VCard.vue';

export default defineComponent({
  name: 'VToast',

  components: { VCard },
});
</script>

<style lang="scss" src="./card.scss"></style>
<style lang="scss" src="./toast.scss"></style>
