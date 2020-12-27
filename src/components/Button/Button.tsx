import React, { CSSProperties, ReactChildren } from 'react';
import MuiButton from '@material-ui/core/Button';
import type { PropTypes } from '@material-ui/core';

interface ButtonProps {
  color?: PropTypes.Color;
  variant?: 'text' | 'outlined' | 'contained';
  children: ReactChildren | string;
  style?: CSSProperties;
  className: string;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
}

export default function Button({
  variant,
  color,
  children,
  style,
  className,
  onClick,
  disabled,
}: ButtonProps): JSX.Element {
  const buttonProps = {
    variant: variant || 'contained',
    color: color || 'primary',
    style,
    className,
    onClick,
    disabled,
  };

  return <MuiButton {...buttonProps}>{children}</MuiButton>;
}
