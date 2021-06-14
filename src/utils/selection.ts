import {
  computed,
  ComputedRef,
  inject,
  InjectionKey,
  provide,
  readonly,
  Ref,
  ref,
} from 'vue';

const CurrentSelection: InjectionKey<Ref<unknown[]>> = Symbol();

interface UseSelectionReturn {
  /**
   * The set of currently selected items.
   */
  items: Ref<Readonly<unknown[]>>;
  /**
   * Number of currently selected items. This is simply the length of the
   * `items` ref.
   */
  count: ComputedRef<number>;
  /**
   * Toggle an item's selection.
   * @param item The item that should be toggled.
   * @return boolean Whether the item is selected after this function has
   *   completed.
   */
  toggleItem: (item: unknown) => boolean;
  /**
   * Clear all selected items.
   */
  clear: () => void;
}

/**
 * Hook that exposes utilities for interfacing with the selection
 */
export function useSelection(): UseSelectionReturn {
  const selection = inject(CurrentSelection, ref([]));
  const count = computed(() => selection.value.length);

  function toggleItem(item: unknown): boolean {
    const index = selection.value.findIndex((other) => other === item);
    if (index >= 0) {
      selection.value.splice(index, 1);
      return false;
    } else {
      selection.value.push(item);
      return true;
    }
  }

  function clear() {
    selection.value.splice(0, selection.value.length);
  }

  return {
    items: readonly(selection),
    count,
    toggleItem,
    clear,
  };
}

interface UseItemSelectionReturn {
  /**
   * Whether the item is currently selected.
   */
  selected: ComputedRef<boolean>;
  /**
   * Toggle the item's selection.
   */
  toggleSelection: () => void;
}

/**
 * Hook that exposes an interface for the selection state of a specific item.
 */
export function useItemSelection(item: unknown): UseItemSelectionReturn {
  const selection = inject(CurrentSelection, ref([]));
  const index = computed(() =>
    selection.value.findIndex((other) => other === item)
  );
  const selected = computed(() => index.value >= 0);

  function toggleSelection() {
    if (selected.value) {
      selection.value.splice(index.value, 1);
    } else {
      selection.value.push(item);
    }
  }

  return { selected, toggleSelection };
}

/**
 * Base provider function that lets underlying components use the selection API.
 */
export function provideSelection(): void {
  provide(CurrentSelection, ref([]));
}
