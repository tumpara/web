<template>
  <VDetails ref="details" overlay :darken="darken">
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
      <header v-if="title.length > 0" class="card-header">
        <h2>{{ title }}</h2>
        <div>
          <slot name="header"></slot>
          <button
            ref="closeButton"
            class="button--light"
            :aria-label="
              $formatMessage({
                description: 'close dialog button aria label',
                defaultMessage: 'Close this dialog',
              })
            "
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
import { defineComponent } from 'vue';

import VCard from '../cards/VCard.vue';
import VDetails from './VDetails.vue';

export default defineComponent({
  name: 'VDialog',

  components: { PhX, VCard, VDetails },

  props: {
    title: {
      type: String,
      default: '',
    },
    darken: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
<style lang="scss" src="./dialog.scss"></style>
