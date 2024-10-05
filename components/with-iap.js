const { withPlugins } = require('@expo/config-plugins');

const withIAP = (config) => {
    return withPlugins(config, [
        // Additional plugins can go here, such as react-native-iap support
    ]);
};

module.exports = withIAP;
