import React, { CSSProperties, ReactChildren } from 'react';
import MuiButton from '@material-ui/core/Button';
import type { PropTypes } from '@material-ui/core';

interface ButtonProps {
  color?: PropTypes.Color;
  variant?: 'text' | 'outlined' | 'contained';
  children: ReactChildren | string;
  style?: CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  form?: string;
}

export default function Button({
  variant,
  color,
  children,
  style = { textTransform: 'initial' },
  className,
  onClick,
  disabled,
  icon,
  size,
  type = 'button',
  form,
}: ButtonProps): JSX.Element {
  const buttonProps = {
    variant: variant || 'contained',
    color: color || 'primary',
    style,
    className,
    onClick,
    disabled,
    startIcon: icon,
    size,
    type,
    form,
  };

  return (
    <MuiButton {...buttonProps} disableElevation>
      {children}
    </MuiButton>
  );
}
