import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawn} from 'node:child_process'

import {dest, parallel, series, src} from 'gulp'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import gulpPostcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import unocssPostcss from '@unocss/postcss'
import {rimraf} from 'rimraf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const basePath = joinPath('..')
export const distPath = joinPath('../dist')
export const nodeModulesPath = joinPath('../node_modules')

export async function buildUnocss(fName = 'unocss.css') {
  const cmd = `unocss "${basePath}/src/**/*.vue" -c ${basePath}/uno.config.ts -o ${distPath}/${fName} -m`
  console.log(`execute uno compile: ${cmd}   basePath ${basePath}/src`)
  await run(cmd, basePath)
}

export const buildStyle = () => {
  return src(`${basePath}/src/**/**.scss`)
    .pipe(
      gulpSass(sass)({
        includePaths: [nodeModulesPath]
      })
    )
    .pipe(gulpPostcss([unocssPostcss(), autoprefixer(), cssnano()]))
    .pipe(dest(distPath))
}
export const moveBuildStyle = () => {
  return src(`${distPath}/src/**/**`).pipe(dest(distPath))
}

export const deleteBuildStyle = () => {
  return rimraf(`${distPath}/src`)
}

export default series(
  parallel(
    async () => buildStyle(),
    async () => buildUnocss()
  )
  /*  series(
    () => moveBuildStyle(),
    () => deleteBuildStyle()
  )*/
) as unknown

export function joinPath(pattern: string): string {
  return resolve(__dirname, pattern).replaceAll('\\', '/')
}

export const run = async (command: string, path: string) => {
  const [cmd, ...args] = command.split(' ')
  return new Promise(resolve => {
    const app = spawn(cmd, args, {
      cwd: path,
      stdio: 'inherit',
      shell: true
    })
    app.on('close', resolve)
  })
}
