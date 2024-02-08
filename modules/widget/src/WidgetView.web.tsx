import * as React from 'react';

import { WidgetViewProps } from './Widget.types';

export default function WidgetView(props: WidgetViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
