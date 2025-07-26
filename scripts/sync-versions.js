#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// 读取根 package.json 获取目标版本
const rootPackageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))
const targetVersion = rootPackageJson.version

console.log(`🎯 目标版本: ${targetVersion}`)

// 需要同步版本的包路径
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
    const oldVersion = packageJson.version
    
    if (oldVersion !== targetVersion) {
      packageJson.version = targetVersion
      writeFileSync(fullPath, JSON.stringify(packageJson, null, 2) + '\n')
      console.log(`✅ ${packageJson.name}: ${oldVersion} → ${targetVersion}`)
      updatedCount++
    } else {
      console.log(`⏭️  ${packageJson.name}: 已是目标版本 ${targetVersion}`)
    }
  } catch (error) {
    console.error(`❌ 处理 ${packagePath} 时出错:`, error.message)
  }
})

console.log(`\n🎉 完成！共更新了 ${updatedCount} 个包的版本`)

if (updatedCount > 0) {
  console.log('\n📝 建议执行以下命令:')
  console.log('1. pnpm install  # 更新 lockfile')
  console.log('2. git add .     # 添加更改')
  console.log('3. git commit -m "chore: sync all package versions to ' + targetVersion + '"')
}
