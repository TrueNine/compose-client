# TypeScript Configuration

Strict TypeScript configuration with the following rules enabled:

## Strict Checks

- `strict` - Enable all strict type checking options
- `strictNullChecks` - Strict null checks
- `noImplicitAny` - Disallow implicit any types
- `noImplicitThis` - Disallow implicit this
- `noImplicitOverride` - Disallow implicit overrides

## Code Quality

- `noUnusedLocals` - Disallow unused local variables
- `noUnusedParameters` - Disallow unused parameters
- `useUnknownInCatchVariables` - Use unknown type in catch variables

## Module Resolution

- `moduleResolution: "Bundler"` - Bundler module resolution
- `verbatimModuleSyntax` - Exact module syntax
- `isolatedModules` - Isolated module compilation
- `allowJs: false` - Disallow JavaScript files

## Output Configuration

- `declaration` - Generate declaration files
- `isolatedDeclarations` - Isolated declaration generation
- `noEmit` - Do not emit output files
- `removeComments: false` - Preserve comments

## Other

- `incremental` - Incremental compilation
- `skipLibCheck` - Skip library file checks
- `target: "ESNext"` - Latest ES standard
- `module: "ESNext"` - ES module format