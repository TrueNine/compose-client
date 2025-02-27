import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import unocssPostcss from '@unocss/postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { dest, parallel, series, src } from 'gulp'
import gulpPostcss from 'gulp-postcss'
import gulpSass from 'gulp-sass'
import sass from 'sass'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const basePath = joinPath('..')
export const distPath = joinPath('../dist')
export const nodeModulesPath = joinPath('../node_modules')

export async function buildUnocss(fName = 'unocss.css') {
  const cmd = `unocss "${basePath}/src/**/*.vue" -c ${basePath}/uno.config.ts -o ${distPath}/${fName} -m`
  await run(cmd, basePath)
}

export function buildStyle() {
  return src(`${basePath}/src/**/**.scss`)
    .pipe(
      gulpSass(sass)({
        includePaths: [nodeModulesPath],
      }),
    )
    .pipe(gulpPostcss([unocssPostcss(), autoprefixer(), cssnano()]))
    .pipe(dest(distPath))
}

export default series(
  parallel(
    async () => buildStyle(),
    async () => buildUnocss(),
  ),
)

export function joinPath(pattern) {
  return resolve(__dirname, pattern).replaceAll('\\', '/')
}

export async function run(command, path) {
  const [cmd, ...args] = command.split(' ')
  return new Promise((resolve) => {
    const app = spawn(cmd, args, {
      cwd: path,
      stdio: 'inherit',
      shell: true,
    })
    app.on('close', resolve)
  })
}
