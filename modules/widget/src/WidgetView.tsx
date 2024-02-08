import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { WidgetViewProps } from './Widget.types';

const NativeView: React.ComponentType<WidgetViewProps> =
  requireNativeViewManager('Widget');

export default function WidgetView(props: WidgetViewProps) {
  return <NativeView {...props} />;
}
