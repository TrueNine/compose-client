export interface Props {
    modelValue: boolean;
}
export interface Emits {
    (e: "update:modelValue", v: boolean): void;
}
