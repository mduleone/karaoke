const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      harperdb: 'commonjs harperdb',
    });

    return config;
  },
  sassOptions: {
    additionalData: `@use "./app/styles/global-utilities.scss" as *;`,
  },
};

module.exports = nextConfig;
