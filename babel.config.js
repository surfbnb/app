const presets = ['module:metro-react-native-babel-preset'];
const plugins = [];

// Enable logs only when required.
if(!process.env['ENABLE_LOGS']){
  plugins.push('transform-remove-console')
}

module.exports = { presets, plugins };