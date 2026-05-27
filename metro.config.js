const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  net: path.resolve(__dirname, 'shims/net.js'),
  tls: path.resolve(__dirname, 'shims/tls.js'),
};

module.exports = config;
