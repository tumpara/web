import { InjectionKey, provide, Ref, ref } from 'vue';

export const GridSize: InjectionKey<Ref<number>> = Symbol();

export function provideTimelineSettings(): void {
  provide(GridSize, ref(250));
}
