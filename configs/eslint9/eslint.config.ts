import eslint9 from './src/index'

export default eslint9({
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
})
