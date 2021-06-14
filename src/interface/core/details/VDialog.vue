<template>
  <VDetails ref="details" overlay :darken="darken" @open="$emit('open')">
    <template #activator>
      <slot name="activator"></slot>
    </template>

    <VCard
      elevated
      class="dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <header class="card-header">
        <h2>{{ title }}</h2>
        <div>
          <slot name="header"></slot>
          <button
            ref="closeButton"
            class="button--light"
            :aria-label="closeAria"
            @click="close"
          >
            <PhX />
          </button>
        </div>
      </header>

      <div class="card-content">
        <slot></slot>
      </div>
    </VCard>
  </VDetails>
</template>

<script lang="ts">
import { PhX } from 'phosphor-vue';
import { ComponentPublicInstance, defineComponent, ref } from 'vue';
import { useIntl } from 'vue-intl';

import VCard from '../cards/VCard.vue';
import VDetails from './VDetails.vue';

export default defineComponent({
  name: 'VDialog',

  components: { PhX, VCard, VDetails },

  props: {
    title: {
      type: String,
      required: true,
    },
    darken: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    open: null,
  },

  setup() {
    const { formatMessage } = useIntl();

    const details = ref<ComponentPublicInstance<typeof VDetails>>();

    const closeButton = ref<HTMLButtonElement>();
    const closeAria = formatMessage({
      description: 'close dialog button aria label',
      defaultMessage: 'Close this dialog',
    });

    function close() {
      details.value?.close();
    }

    return { details, closeAria, closeButton, close };
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
<style lang="scss" src="./dialog.scss"></style>
