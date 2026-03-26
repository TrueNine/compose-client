import eslint10 from './src/index'

export default eslint10({
  type: 'lib',
  pnpm: true,
  test: true,
  ignores: [
    '**/dist',
    '**/node_modules',
    '**/.turbo',
    '**/coverage',
    '**/.agent',
    '**/.claude',
    '**/.factory',
    '**/.qoder',
    '**/.trae',
    '**/.kiro',
    'AGENTS.md',
    'README.md',
    'GEMINI.md',
    'CLAUDE.md',
    'WARP.md'
  ],
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.md', 'src/rules/*.md', 'src/rules/*.md/*.ts']
      }
    }
  }
}).then(configs => [
  ...configs,
  {
    name: '@truenine/eslint10-config/internal-rule-sources',
    files: ['src/rules/**/*.ts'],
    rules: {
      'ts/no-explicit-any': 'off',
      'ts/no-non-null-assertion': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unused-vars': 'off'
    }
  }
])
