const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
{
  defaultCommandTimeout: 100000
  pageLoadTimeout: 100000   
  requestTimeout: 200000
      

}

