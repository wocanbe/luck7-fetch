import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import {terser} from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'

function getConfig (format) {
  const config = {
    input: 'src/Ajax.ts',
    output: {
      file: 'dist/index.' + format + '.js',
      format: format,
      name: 'luck7-fetch',
      sourceMap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      terser()
    ]
  }
  if (format === 'esm') {
    config.plugins.push(copy({
      targets: [
        { src: 'types/global.d.ts', dest: 'dist', rename: 'index.d.ts' }
      ]
    }))
  }
  return config
}
export default [
  getConfig('cjs'), 
  getConfig('esm')
]
