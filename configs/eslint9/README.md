# ESLint 9 Configuration Package

An ESLint 9 configuration package optimised for Compose Client projects, providing cache optimisation, performance tuning, and rule optimisation features.

## Features

### 🚀 Performance Optimisation
- **Smart Caching**: Supports metadata and content caching strategies
- **Parallel Processing**: Automatically utilises multi-core CPUs for parallel linting
- **Rule Optimisation**: Optionally skip performance-heavy rules
- **Progressive Checking**: Prioritise critical files

### 📋 Presets
- **performance**: Performance-first, for large projects or CI environments
- **quality**: Quality-first, for small projects or development environments
- **balanced**: Balanced configuration, recommended default
- **ci**: CI environment specific configuration
- **dev**: Development-friendly configuration
- **library**: Strict configuration for library projects

### 🎯 Smart Ignoring
- Auto-ignore build artifacts, cache directories, minified files, etc.
- Configurable critical file priority checking
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

### Custom Configuration

```javascript
// eslint.config.mjs
import eslint9, { applyPreset } from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  vue: true,
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
  // Custom cache configuration
  cache: {
    location: '.eslintcache',
    strategy: 'metadata',
  },
  // Performance optimisation configuration
  performance: {
    parallel: true,
    skipExpensiveRules: false,
  },
  // Rule optimisation configuration
  ruleOptimization: {
    progressive: true,
    criticalFirst: true,
    customOverrides: {
      'ts/no-explicit-any': 'warn',
      'complexity': ['warn', { max: 15 }],
    },
  },
})
```

## Configuration Options

### Cache Configuration (cache)

```typescript
cache?: boolean | {
  /** Cache location, defaults to .eslintcache */
  location?: string
  /** Cache strategy, defaults to metadata */
  strategy?: 'metadata' | 'content'
}
```

### Performance Configuration (performance)

```typescript
performance?: {
  /** Enable parallel processing, defaults to true */
  parallel?: boolean
  /** Max parallel count, defaults to CPU core count */
  maxParallel?: number
  /** Skip performance-heavy rules */
  skipExpensiveRules?: boolean
}
```

### Rule Optimisation Configuration (ruleOptimization)

```typescript
ruleOptimization?: {
  /** Enable progressive checking */
  progressive?: boolean
  /** Critical files first */
  criticalFirst?: boolean
  /** Skip performance-heavy rules */
  skipExpensive?: boolean
  /** Custom rule overrides */
  customOverrides?: Record<string, string>
}
```

## Preset Details

### Performance Preset
For large projects or CI environments, prioritising check speed:
- Metadata caching strategy enabled
- Skip performance-heavy rules
- Progressive checking enabled

### Quality Preset
For small projects or development environments, prioritising code quality:
- Content caching strategy enabled
- All quality check rules retained
- Strict error levels

### Balanced Preset
Recommended default, balancing performance and quality:
- Metadata caching strategy
- Moderate rule strictness
- Critical file priority checking enabled

### CI Preset
Optimised for continuous integration environments:
- Skip time-consuming rules
- Only critical error checks retained
- Test files ignored

### Dev Preset
Development-friendly configuration:
- More lenient rule settings
- console and debugger allowed
- Warning level instead of error level

### Library Preset
For open-source libraries or component libraries:
- Strictest rule settings
- Complete type annotations required
- Documentation comments enforced

## Performance Optimisation Tips

### 1. Enable Caching
```bash
# package.json
{
  "scripts": {
    "lint": "eslint --fix --cache --cache-location .eslintcache"
  }
}
```

### 2. Use Appropriate Presets
- Use `dev` preset for development
- Use `ci` preset for CI environments
- Use `library` preset for production libraries

### 3. Configure Ignore Patterns
Ensure `.eslintignore` or config includes files that don't need checking:
```
dist/
build/
coverage/
.turbo/
node_modules/
*.min.js
```

### 4. Progressive Checking
For large projects, enable progressive checking:
```javascript
ruleOptimization: {
  progressive: true,
  criticalFirst: true,
}
```

## Troubleshooting

### Cache Issues
If encountering cache-related issues, clear the cache:
```bash
rm -rf .eslintcache
```

### Performance Issues
If checking is too slow:
1. Enable `skipExpensiveRules` option
2. Use `performance` preset
3. Add more ignore patterns

### Rule Conflicts
If encountering rule conflicts, override via `customOverrides`:
```javascript
ruleOptimization: {
  customOverrides: {
    'conflicting-rule': 'off',
  },
}
```

## Changelog

### v1.0.0
- Initial release
- Cache optimisation support
- Preset configurations provided
- Rule optimiser integrated
