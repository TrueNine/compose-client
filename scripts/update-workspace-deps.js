#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// 需要更新的包路径
const packages = [
  'types/package.json',
  'shared/package.json',
  'vue/package.json',
  'ui/package.json',
  'external/package.json',
  'req/package.json',
  'design/package.json',
  'configs/vite/package.json',
  'configs/uno/package.json',
  'configs/eslint9/package.json',
  'configs/tsconfig/package.json',
  'psdk/wxpa/package.json',
  'psdk/tmap/package.json',
  'ext/chrome/package.json'
]

let updatedCount = 0

packages.forEach(packagePath => {
  const fullPath = resolve(rootDir, packagePath)
  
  try {
    const packageJson = JSON.parse(readFileSync(fullPath, 'utf-8'))
    let hasChanges = false
    
    // 更新 dependencies
    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach(dep => {
        if (dep.startsWith('@truenine/') && packageJson.dependencies[dep] === 'workspace:^') {
          packageJson.dependencies[dep] = 'workspace:*'
          hasChanges = true
        }
      })
    }

    // 更新 devDependencies
    if (packageJson.devDependencies) {
      Object.keys(packageJson.devDependencies).forEach(dep => {
        if (dep.startsWith('@truenine/') && packageJson.devDependencies[dep] === 'workspace:^') {
          packageJson.devDependencies[dep] = 'workspace:*'
          hasChanges = true
        }
      })
    }

    // 更新 peerDependencies
    if (packageJson.peerDependencies) {
      Object.keys(packageJson.peerDependencies).forEach(dep => {
        if (dep.startsWith('@truenine/') && packageJson.peerDependencies[dep] === 'workspace:^') {
          packageJson.peerDependencies[dep] = 'workspace:*'
          hasChanges = true
        }
      })
    }
    
    if (hasChanges) {
      writeFileSync(fullPath, JSON.stringify(packageJson, null, 2) + '\n')
      console.log(`✅ 更新 ${packageJson.name} 的 workspace 依赖`)
      updatedCount++
    } else {
      console.log(`⏭️  ${packageJson.name}: 无需更新`)
    }
  } catch (error) {
    console.error(`❌ 处理 ${packagePath} 时出错:`, error.message)
  }
})

console.log(`\n🎉 完成！共更新了 ${updatedCount} 个包的依赖配置`)
