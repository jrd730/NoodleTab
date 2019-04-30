import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/noodle-tab.js',
  output: {
    file: './build/bundle.js',
    format: 'cjs',
    exports: 'named'
  },

  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),

    commonjs({
      ignoreGlobal: false,  
      sourceMap: false,  
    })
  ]
};