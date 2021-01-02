import React from 'react';
import { AlertComponentPropsWithStyle } from 'react-alert';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiAlert-action': {
        alignItems: 'flex-start',
      },
    },
  }),
);

export const AlertTemplate = ({
  style,
  options,
  message,
  close,
}: AlertComponentPropsWithStyle) => {
  const classes = useStyles();
  return (
    <MuiAlert
      severity={options.type}
      style={style}
      onClose={close}
      variant="filled"
      className={classes.root}
    >
      {message}
    </MuiAlert>
  );
};
