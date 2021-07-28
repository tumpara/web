import { inject, InjectionKey, provide, reactive, UnwrapRef } from 'vue';
import { useIntl } from 'vue-intl';

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
      process.env.NODE_ENV === 'production'
        ? undefined
        : 'Trying to use toast functionality, but could not find injections from parent components. Make sure VApp is a parent of the component that calls useToasts().'
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

interface SetupToastsReturn {
  toasts: UnwrapRef<RegisteredToast[]>;
  unregisterToast: (toast: RegisteredToast) => void;
}

export function setupToasts(): SetupToastsReturn {
  const toasts = reactive<RegisteredToast[]>([]);

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

  return { toasts, unregisterToast };
}
