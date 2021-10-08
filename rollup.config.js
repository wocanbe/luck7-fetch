import typescript from '@rollup/plugin-typescript'
import {terser} from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'

function getConfig (format) {
  const fileExt = format === 'iife' ? 'min' : format
  const config = {
    input: 'src/Ajax.ts',
    output: {
      file: 'dist/index.' + fileExt + '.js',
      format: format,
      name: 'L7Fetch'
    },
    plugins: []
  }
  config.plugins.push(typescript())
  config.plugins.push(terser({ format: { comments: false } }))
  if (format === 'esm') {
    config.plugins.push(copy({
      targets: [
        { src: 'types/index.d.ts', dest: 'dist' }
      ]
    }))
  }
  return config
}
export default [
  getConfig('esm'), 
  getConfig('iife')
]
