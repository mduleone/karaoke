const path = require('path');

const globalUtilitiesPath = path.join(__dirname, 'app/styles/global-utilities.scss').replace(/\\/g, '/');

const nextConfig = {
  turbopack: {},
  sassOptions: {
    includePaths: [__dirname],
    additionalData: `@use "${globalUtilitiesPath}" as *;`,
  },
};

module.exports = nextConfig;
