"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const config_plugins_1 = require("@expo/config-plugins")
const withWidgetIos_1 = require("./ios/withWidgetIos")
const withAppConfigs = (config, options) => {
  return (0, config_plugins_1.withPlugins)(config, [
    [withWidgetIos_1.withWidgetIos, options],
  ])
}
exports.default = withAppConfigs
