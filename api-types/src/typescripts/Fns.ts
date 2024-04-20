import type {dynamic} from '@/typescripts/Types'

export type params<T extends (...args: dynamic[]) => dynamic> = Parameters<T>
export type returnType<T extends (...args: dynamic[]) => dynamic> = ReturnType<T>
