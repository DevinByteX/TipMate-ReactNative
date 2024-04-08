module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './app',
          "@components": "./app/components/index", // if you are refering common index file in folder you should add "/index" end of the path
          "@styles": "./app/styles/",  // this is working either we add end "/" or not to the path, for safe side i have added end "/" to the path
          "@navigation": "./app/navigation/"
        }
      }
    ]
  ]
};
