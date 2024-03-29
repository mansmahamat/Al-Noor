import { ConfigPlugin, withPlugins } from "@expo/config-plugins";

import { withWidgetIos } from "./ios/withWidgetIos";

export interface Props {
  widgetName: string;
  ios: {
    devTeamId: string;
    appGroupIdentifier: string;
    topLevelFiles?: string[];
  };
}

const withAppConfigs: ConfigPlugin<Props> = (config, options) => {
  return withPlugins(config, [
    [withWidgetIos, options],
  ]);
};

export default withAppConfigs;
