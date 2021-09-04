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
      name: 'luck7-fetch'
    },
    plugins: []
  }
  if (format === 'cjs') {
    config.output.exports = 'default'
    config.plugins.push(commonjs())
  }
  config.plugins.push(typescript())
  config.plugins.push(terser({ format: { comments: false } }))
  if (format === 'esm') {
    config.plugins.push(copy({
      targets: [
        { src: 'types/index.d.ts', dest: 'dist', rename: 'index.d.ts' }
      ]
    }))
  }
  return config
}
export default [
  getConfig('cjs'), 
  getConfig('esm')
]
