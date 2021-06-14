<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header-section app-header-section--left">
        <slot name="header-left"></slot>
      </div>
      <div class="app-header-section">
        <slot name="header-center"></slot>
      </div>
      <div class="app-header-section app-header-section--right">
        <slot name="header-right"></slot>
      </div>
    </header>

    <slot></slot>
  </div>

  <transition-group name="toast-" tag="div" class="app-toasts">
    <VToast
      v-for="toast in toasts"
      :key="toast"
      @click="unregisterToast(toast)"
    >
      {{ toast.message }}
    </VToast>
  </transition-group>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  InjectionKey,
  provide,
  reactive,
  ref,
} from 'vue';
import { useIntl } from 'vue-intl';

import VToast from '../../core/cards/VToast.vue';
import { SidebarCollapsed } from '../sidebar/VSidebar.vue';

interface Toast {
  message: string;
}

interface RegisteredToast extends Toast {
  timeoutHandle?: number;
}

type ShowToastType = (toast: Toast | string) => void;
const ShowToast: InjectionKey<ShowToastType> = Symbol();

interface UseToastsReturn {
  /**
   * Shows a given toast to the user.
   */
  showToast: ShowToastType;

  /**
   * Variation of th showToast method that append specific formatting for
   * network-related errors.
   */
  showNetworkErrorToast: (message?: string) => void;
}

/**
 * Hook that provides an interface for showing toast messages.
 */
export function useToasts(): UseToastsReturn {
  const { formatMessage } = useIntl();
  const showToast = inject(ShowToast);

  if (showToast === undefined) {
    throw Error(
      'Trying to use toast functionality, but could not find injections from parent components. Make sure VApp is a parent of the component that calls useToasts().'
    );
  }

  function showNetworkErrorToast(message?: string) {
    if (showToast === undefined) {
      return;
    }

    const networkErrorMessage = formatMessage({
      description: 'network error toast suffix',
      defaultMessage:
        'Please try again or check your connection to the server.',
    });

    if (typeof message === 'string') {
      showToast(message + '\n' + networkErrorMessage);
    } else {
      showToast(networkErrorMessage);
    }
  }

  return { showToast, showNetworkErrorToast };
}

export default defineComponent({
  name: 'VApp',

  components: { VToast },

  provide: {
    // These defaults are for Phosphor icons, which are scaled down a bit
    // because the UI is rendered at 14px.
    color: 'currentColor',
    size: 14, // TODO This should be 0.875rem, but that raises warnings
    weight: 'bold',
  },

  setup() {
    const toasts = reactive([] as RegisteredToast[]);

    function unregisterToast(toast: RegisteredToast) {
      const index = toasts.indexOf(toast);
      if (index === -1) {
        return;
      }
      toasts.splice(index, 1);
      if (toast.timeoutHandle !== undefined) {
        window.clearTimeout(toast.timeoutHandle);
      }
    }

    function showToast(toast: Toast | string) {
      const actualToast: RegisteredToast =
        typeof toast === 'string' ? { message: toast } : toast;
      toasts.push(actualToast);

      window.setTimeout(() => {
        actualToast.timeoutHandle = undefined;
        unregisterToast(actualToast);
      }, 10000);
    }
    provide(ShowToast, showToast);

    provide(SidebarCollapsed, ref(false));

    return { toasts, unregisterToast };
  },
});
</script>

<style lang="scss" src="../../core/global.scss"></style>
<style lang="scss" src="./app.scss"></style>

<style lang="scss" scoped>
@use '../../lib/motion';

.toast--enter-active,
.toast--leave-active {
  transition: opacity motion.$subtle, transform motion.$subtle;
}

.toast--enter-from,
.toast--leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.toast--move {
  transition: transform motion.$gentle;
}
</style>
