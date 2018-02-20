import path from 'path'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const babelOptions = {
  exclude: 'node_modules/**',
  presets: ['es2015-rollup', 'stage-0', 'react'],
  plugins: [
    'transform-async-to-generator',
    'syntax-object-rest-spread',
    'transform-object-rest-spread',
    'transform-class-properties'
  ],
  babelrc: false
}

export default {
  input: path.resolve('src/index.js'),
  output: [{ file: 'lib/index.js', format: 'cjs' }],
  external: ['react', 'prop-types'],
  plugins: [
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    babel(babelOptions)
  ]
}
