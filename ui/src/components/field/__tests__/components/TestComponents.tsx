import {defineComponent} from 'vue'

export const ChildInputComponent = defineComponent({
  name: 'ChildInputComponent',
  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    otherProp: String,
    adCode: String,
    x: String,
    y: String,
    z: String,
  },
  emits: ['update:modelValue', 'update:otherProp', 'update:adCode', 'update:x', 'update:y', 'update:z'],
  setup(props, {emit}) {
    return () => (
      <div>
        <span class="label-display">{props.label}</span>
        <span class="placeholder-display">{props.placeholder}</span>
        <input
          class="modelValue-input"
          value={props.modelValue}
          onInput={(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)}
        />
        <span class="modelValue-display">{props.modelValue}</span>
        <input
          class="otherProp-input"
          value={props.otherProp}
          onInput={(e: Event) => emit('update:otherProp', (e.target as HTMLInputElement).value)}
        />
        <span class="otherProp-display">{props.otherProp}</span>
        <input
          class="adCode-input"
          value={props.adCode}
          onInput={(e: Event) => emit('update:adCode', (e.target as HTMLInputElement).value)}
        />
        <span class="adCode-display">{props.adCode}</span>
        <input
          class="x-input"
          value={props.x}
          onInput={(e: Event) => emit('update:x', (e.target as HTMLInputElement).value)}
        />
        <span class="x-display">{props.x}</span>
        <input
          class="y-input"
          value={props.y}
          onInput={(e: Event) => emit('update:y', (e.target as HTMLInputElement).value)}
        />
        <span class="y-display">{props.y}</span>
        <input
          class="z-input"
          value={props.z}
          onInput={(e: Event) => emit('update:z', (e.target as HTMLInputElement).value)}
        />
        <span class="z-display">{props.z}</span>
      </div>
    )
  },
})
