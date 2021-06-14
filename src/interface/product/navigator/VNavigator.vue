<template>
  <VPopup ref="popup" direction="se">
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
import { ComponentPublicInstance, defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import VButton from '../../core/buttons/VButton.vue';
import VCard from '../../core/cards/VCard.vue';
import VPopup from '../../core/details/VPopup.vue';

export default defineComponent({
  name: 'VDialog',

  components: { VCard, VButton, VPopup },

  setup() {
    const popup = ref<ComponentPublicInstance<typeof VPopup>>();

    const router = useRouter();
    watch(router.currentRoute, () => {
      popup.value?.close();
    });

    return { popup };
  },
});
</script>

<style lang="scss" src="./navigator.scss"></style>
