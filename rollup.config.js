import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'

const globals = {
  'babel-runtime/core-js/json/stringify': 'BabelCore.JsonStringfy',
  'babel-runtime/core-js/promise': 'BabelCore.Promise',
  'babel-runtime/core-js/symbol': 'BabelCore.symbol',
  'babel-runtime/helpers/classCallCheck': 'BabelHelpers.classCallCheck',
  'babel-runtime/helpers/createClass': 'BabelHelpers.createClass'
}
export default {
  input: 'src/Ajax.js',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'luck7-fetch',
    globals,
    banner: '/**\n* Copyright 584069777@qq.com 2018.\n*/'
  },
  // plugins: [babel({runtimeHelpers: true})],
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      'presets': [
        [require.resolve('babel-preset-env'), {modules: false}]
      ],
      plugins: [require.resolve('babel-plugin-transform-runtime')],
      'comments': true
    }),
    terser(),
    copy({
      targets: [
        { src: 'src/Ajax.d.ts', dest: 'dist', rename: 'index.d.ts' }
      ]
    })
],
  external: (id) => {
    if (/^babel-runtime\/.*$/.test(id)) {
      return true
    }
  }
}
