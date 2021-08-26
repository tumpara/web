<template>
  <VDetails
    :model-value="modelValue"
    overlay
    @update:modelValue="$emit('update:modelValue', $event)"
  >
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

          <VButton
            light
            :aria-label="
              $formatMessage({
                description: 'close dialog button aria label',
                defaultMessage: 'Close this dialog',
              })
            "
            @click="$emit('update:modelValue', false)"
          >
            <PhX />
          </VButton>
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

import VButton from '../buttons/VButton.vue';
import VCard from '../cards/VCard.vue';
import VDetails from './VDetails.vue';

export default defineComponent({
  name: 'VDialog',

  components: { PhX, VButton, VCard, VDetails },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },

  emits: {
    'update:modelValue': (value: unknown) => typeof value === 'boolean',
  },
});
</script>

<style lang="scss" src="./details.scss"></style>
<style lang="scss" src="./dialog.scss"></style>
