module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './bin/main.js'
  },
  module: {
    loaders: [
      { loader: 'babel', query: { presets: ['react', 'es2015'] } }
    ]
  }
};
