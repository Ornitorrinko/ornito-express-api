module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: '',
      user: '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    },
    seeds: {
      directory: './seeds/dev/'
    }
  },
  stage: {
    client: 'postgresql',
    connection: {
      host: '',
      database: '',
      user: '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    },
    seeds: {
      directory: './seeds/dev/'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      host: '',
      database: '',
      user: '',
      password: ''
    },
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    },
    seeds: {
      directory: './seeds/dev/'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      database: '',
      user: '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    },
    seeds: {
      directory: './seeds/dev/'
    }
  }
};