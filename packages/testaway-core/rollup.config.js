import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import filesize from 'rollup-plugin-filesize';

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file: 'dist/index.min.js',
      name: 'Testaway'
    },
    plugins: [typescript({ target: 'es2017' }), terser(), filesize()]
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file: 'dist/index.es5.min.js',
      name: 'Testaway'
    },
    plugins: [typescript({ target: 'es5' }), terser(), filesize()]
  }
];
