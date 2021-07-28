<template>
  <VPopup v-model="popupOpen" direction="se">
    <template #activator>
      <VButton class="navigator-activator">
        <slot name="activator"></slot>
      </VButton>
    </template>

    <VCard class="navigator" elevated>
      <slot></slot>
    </VCard>
  </VPopup>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import VButton from '../../core/buttons/VButton.vue';
import VCard from '../../core/cards/VCard.vue';
import VPopup from '../../core/details/VPopup.vue';

export default defineComponent({
  name: 'VDialog',

  components: { VCard, VButton, VPopup },

  setup() {
    const popupOpen = ref(false);

    const router = useRouter();
    watch(router.currentRoute, () => (popupOpen.value = false));

    return { popupOpen };
  },
});
</script>

<style lang="scss" src="./navigator.scss"></style>
