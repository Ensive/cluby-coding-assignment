import React from 'react';
import { transitions, positions, Provider } from 'react-alert';

import { AlertTemplate } from './AlertTemplate';

const options = {
  position: positions.TOP_RIGHT,
  timeout: 10000,
  offset: '0 16px 8px 0',
  // TODO: update transition?
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 9999,
    marginTop: 64 + 16,
    marginRight: 24,
  },
};

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider template={AlertTemplate} {...options}>
      {children}
    </Provider>
  );
}
