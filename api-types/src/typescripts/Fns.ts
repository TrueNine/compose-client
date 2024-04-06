export type params<T extends (...args: any[]) => any> = Parameters<T>
export type returnType<T extends (...args: any[]) => any> = ReturnType<T>
