# @compose/eslint9-config

ESLint 9 configuration package for Compose Client projects with TypeScript, Vue, and modern JavaScript support.

## Features

- 🚀 **ESLint 9** - Latest ESLint version with flat config
- 🎯 **TypeScript** - Full TypeScript support with strict rules
- 🖖 **Vue 3** - Vue.js 3 specific linting rules
- 🎨 **Stylistic** - Code formatting and style consistency
- 🧪 **Testing** - Vitest and testing library support
- 🎭 **UnoCSS** - Atomic CSS framework integration
- ⚡ **Performance** - Optimized for fast linting

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @compose/eslint9-config

# Using npm
npm install --save-dev @compose/eslint9-config

# Using yarn
yarn add -D @compose/eslint9-config
```

## Usage

Create an `eslint.config.mjs` file in your project root:

```javascript
import eslint9 from '@compose/eslint9-config'

export default eslint9({
  // Configuration options
  // type: 'lib' for libraries, 'app' for applications
  type: 'lib',
  vue: true,
  typescript: true,
  test: true,
  unocss: false,
  stylistic: true,
  formatters: false
})
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `'app' \| 'lib'` | `'lib'` | Project type |
| `vue` | `boolean \| VueConfig` | `false` | Enable Vue.js support |
| `typescript` | `boolean \| TsConfig` | `true` | Enable TypeScript support |
| `test` | `boolean \| TestConfig` | `true` | Enable testing support |
| `unocss` | `boolean \| UnocssConfig` | `false` | Enable UnoCSS support |
| `stylistic` | `boolean \| StylisticConfig` | `true` | Enable stylistic rules |
| `formatters` | `boolean \| FormatterConfig` | `false` | Enable formatters |
| `jsx` | `boolean` | `false` | Enable JSX support |
| `pnpm` | `boolean` | `false` | Enable pnpm-specific rules |
| `ignores` | `string[]` | `[]` | Additional ignore patterns |

### Examples

#### Basic Library Configuration

```javascript
import eslint9 from '@compose/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: true,
  test: true
})
```

#### Vue Application Configuration

```javascript
import eslint9 from '@compose/eslint9-config'

export default eslint9({
  type: 'app',
  vue: true,
  typescript: true,
  unocss: true,
  formatters: true
})
```

#### Strict TypeScript Configuration

```javascript
import eslint9 from '@compose/eslint9-config'

export default eslint9({
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json'
  }
})
```

## Package Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## IDE Integration

### VS Code

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add to your `.vscode/settings.json`:

```json
{
  "eslint.experimental.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ]
}
```

## License

[LGPL-2.1-or-later](../../LICENSE)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](../../README.md) for details.

## Support

- 🐛 [Report Issues](https://github.com/TrueNine/compose-client/issues)
- 💬 [Discussions](https://github.com/TrueNine/compose-client/discussions)
- 📖 [Documentation](https://github.com/TrueNine/compose-client#readme)
