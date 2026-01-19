# @truenine/eslint9-config

This is an ESLint 9 configuration package optimized for the Compose Client project, providing cache optimization, performance tuning, and rule optimization capabilities.

## Features

### Performance Optimization

- **Smart Caching**: Supports efficient caching strategies
- **Parallel Processing**: Automatically utilizes multi-core CPUs for parallel checks
- **Rule Optimization**: Option to skip rules with high performance impact
- **Progressive Checking**: Prioritizes checking critical files

### Preset Configurations

- **performance**: Performance priority, suitable for large projects or CI environments
- **quality**: Quality priority, suitable for small projects or development environments
- **balanced**: Balanced configuration, default recommendation
- **ci**: Dedicated configuration for CI environments
- **dev**: Development environment friendly configuration
- **library**: Strict configuration for library projects

### Smart Ignore

- Automatically ignores build artifacts, cache directories, compressed files, etc.
- Configurable priority checking for critical files
- Supports custom ignore patterns

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

Suitable for large projects or CI environments, prioritizes checking speed.

### Quality Preset

Suitable for small projects or development environments, prioritizes code quality.

### Balanced Preset

Default recommended configuration, balances performance and quality.

### CI Preset

Optimized for Continuous Integration environments.

### Dev Preset

Development environment friendly configuration.

### Library Preset

Suitable for open source libraries or component libraries.

## Performance Optimization Suggestions

1. **Enable Caching**: Add cache parameters in package.json scripts.
2. **Use Appropriate Presets**: Choose the most suitable preset according to different environments.
3. **Configure Ignore Patterns**: Ensure files that do not need checking (such as dist, build, node_modules) are ignored.
4. **Progressive Checking**: For large projects, it is recommended to enable the progressive checking function.