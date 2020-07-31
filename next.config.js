require("dotenv").config();

const webpack = require("webpack");
console.log({ APP_URL: process.env.APP_URL });
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const appURL = JSON.stringify(process.env.APP_URL);

module.exports = {
  webpack: (config) => {
    const env = { API_KEY: apiKey, APP_URL: appURL };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
};
