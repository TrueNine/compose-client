# @truenine/eslint9-config

ESLint 9 configuration package optimized for Compose Client projects, providing cache optimization, performance tuning and rule optimization.

## Features

### Performance Optimization

- **Smart Cache**: Efficient caching strategy
- **Parallel Processing**: Auto-utilize multi-core CPU for parallel checks
- **Rule Optimization**: Optional skip of performance-heavy rules
- **Progressive Check**: Prioritize critical files

### Presets

- **performance**: Performance-first, for large projects or CI
- **quality**: Quality-first, for small projects or dev
- **balanced**: Balanced config, default recommended
- **ci**: CI environment dedicated config
- **dev**: Dev environment friendly config
- **library**: Library project strict config

### Smart Ignore

- Auto-ignore build artifacts, cache dirs, compressed files
- Configurable critical file priority check
- Custom ignore pattern support

## Usage

### Basic Usage

```javascript
// eslint.config.mjs
import eslint9 from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
})
```

### Using Presets

```javascript
// eslint.config.mjs
import eslint9, { applyPreset } from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
  // Use balanced preset
  ...applyPreset('balanced'),
})
```

## Preset Details

### Performance Preset

For large projects or CI, prioritizes check speed.

### Quality Preset

For small projects or dev, prioritizes code quality.

### Balanced Preset

Default recommended, balances performance and quality.

### CI Preset

Optimized for continuous integration.

### Dev Preset

Dev environment friendly.

### Library Preset

For open-source libraries or component libraries.

## Performance Tips

1. **Enable Cache**: Add cache params in package.json scripts.
2. **Use Appropriate Preset**: Choose best preset for different environments.
3. **Configure Ignore Patterns**: Ensure unnecessary files (dist, build, node_modules) are ignored.
4. **Progressive Check**: For large projects, enable progressive check.