const pkg = require('../../package.json')

function createConfig(paths = {}, env = process.env) {
  const distPkg = {
    main: 'index.js',
    module: 'es/index.js',
    'jsnext:main': 'es/index.js',
    browser: 'dist/react-auth-wrapper.js'
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of ['name', 'author', 'version', 'license', 'keywords', 'repository', 'description']) {
    if (pkg[key]) {
      distPkg[key] = pkg[key]
    }
  }

  const commands = [{
    command: paths.eslint,
    args: ['src'],
    context: { stdio: 'inherit', env }
  }, {
    command: paths.tape,
    args: [
      '--require=jsdom',
      '--require=jsdom-global/register',
      '--require=mock-local-storage',
      '--require=@babel/register',
      'test/index.js',
      ` | ${paths.faucet}`
    ],
    context: { stdio: 'inherit', env, shell: true }
  }, {
    command: paths.babel,
    args: ['src', '--out-dir', 'build'],
    context: { stdio: 'inherit', env: { ...env, BABEL_ENV: 'cjs' } }
  }, {
    command: paths.babel,
    args: ['src', '--out-dir', 'build/es'],
    context: { stdio: 'inherit', env: { ...env, BABEL_ENV: 'es' } }
  }, {
    command: paths.rollup,
    args: ['-c'],
    context: { stdio: 'inherit', env: { ...env, NODE_ENV: 'production' } }
  }, {
    command: paths.rollup,
    args: ['-c'],
    context: { stdio: 'inherit', env: { ...env, NODE_ENV: 'development' } }
  }]

  return { commands, pkg: distPkg }
}

module.exports = createConfig
