<template>
  <VView color="blue">
    <VSubview title="UI Components">
      <h2>Buttons</h2>

      <p>
        Buttons provide entry points for the user to perform
        <strong>actions</strong>. The primary variants should be used for
        features the user is most likely to use.
      </p>

      <VCard content>
        <VButton>Normal</VButton>
        <VButton selected>Selected</VButton>
        <VButton primary @click="showToast('Clicked the primary button')"
          >Primary</VButton
        >
        <VButton disabled @click="showToast('Clicked the disabled button')"
          >Disabled</VButton
        >
      </VCard>

      <h2>Inputs</h2>

      <p>
        Inputs will visually hide their label when they are not placed inside a
        form.
      </p>

      <VCard content>
        <VInput
          name="input1"
          label="First input"
          type="text"
          placeholder="Enter some stuff..."
        ></VInput>
      </VCard>

      <h2>Forms</h2>

      <VCard content>
        <VForm>
          <VInput
            name="input2"
            label="Second input"
            type="text"
            placeholder="Enter some more stuff..."
          />
          <VCheckbox name="input3" label="A checkbox" />
        </VForm>
      </VCard>

      <VCard content>
        <VForm grid>
          <VInput
            name="input4"
            label="Fourth input"
            type="text"
            placeholder="Enter some more stuff..."
          />
          <VCheckbox name="input5" label="A checkbox" />
        </VForm>
      </VCard>

      <h2>Cards</h2>

      <VCard content>A normal card.</VCard>
      <VCard elevated content>This card is elevated.</VCard>

      <h3>Toasts</h3>
      <VToast>This is the content.</VToast>

      <h2>Menus</h2>

      <p>In a card:</p>
      <VCard>
        <VMenu>
          <VMenuLink href="#">First</VMenuLink>
          <VMenuLink href="#">Second</VMenuLink>
          <VMenuLink href="#">Third</VMenuLink>
        </VMenu>
      </VCard>

      <p>In a popup:</p>
      <VPopup>
        <template #activator>
          <VButton>Popup!</VButton>
        </template>
        <VCard>
          <VMenu>
            <VMenuLink href="#">First</VMenuLink>
            <VMenuLink href="#">Second</VMenuLink>
            <VMenuLink href="#">Third</VMenuLink>
          </VMenu>
        </VCard>
      </VPopup>

      <h2>Dialogs</h2>

      <VButtonGroup>
        <VDialog title="This is the title.">
          <template #activator>
            <VButton>Open a dialog</VButton>
          </template>

          This is the dialog.
        </VDialog>

        <VDialog title="This is the title." darken>
          <template #activator>
            <VButton>This one will darken the screen.</VButton>
          </template>

          This is the dialog.
        </VDialog>
      </VButtonGroup>
    </VSubview>
  </VView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import * as gui from '@/interface';

export default defineComponent({
  name: 'Ui',

  components: gui,

  setup() {
    const { showToast } = gui.useToasts();

    return { showToast };
  },
});
</script>
