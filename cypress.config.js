const { defineConfig } = require('cypress');

const baseUrl = 'http://challenge:4000';
const pg = require('pg');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      on('task', {
        DATABASE({ dbConfig, sql, values }) {
          const pool = new pg.Pool(dbConfig);

          try {
            return pool.query(sql, values);
          } catch (e) {
            console.log(e.message);
          }
        },
      });
    },
  },
  env: {
    url: baseUrl,
    DB: {
      user: 'bootcamp_role',
      host: 'db',
      database: 'boardcamp',
      password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
      port: 5432,
    },
  },
  chromeWebSecurity: false,
  reporter: 'cypress-multi-reporters',
  video: false,
  reporterOptions: {
    configFile: 'reporter.json',
  },
});
