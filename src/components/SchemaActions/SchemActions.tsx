import React from 'react';
import Button from '../Button';
import clsx from 'clsx';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import HistoryIcon from '@material-ui/icons/History';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsContainer: {
      marginBottom: theme.spacing(2),
    },
    saveChangesButton: {
      marginLeft: 'auto',
    },
    addItemButton: {
      marginLeft: theme.spacing(1),
    },
    revertChangesButton: {
      marginLeft: theme.spacing(1),
    },
    mobileButton: {
      margin: `0 0 ${theme.spacing(1)}px`,
      '&:last-child': {
        margin: 0,
      },
    },
  }),
);

interface SchemaActionsProps {
  saveInProgress: boolean;
  onListSave: () => void;
  onAddItemClick: () => void;
  onRevertChanges: () => void;
}

export default function SchemaActions({
  saveInProgress,
  onListSave,
  onAddItemClick,
  onRevertChanges,
}: SchemaActionsProps) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesXs = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Box
      display={matchesXs ? 'block' : 'flex'}
      className={classes.buttonsContainer}
    >
      <Button
        fullWidth={matchesXs}
        className={clsx(classes.saveChangesButton, {
          [classes.mobileButton]: matchesXs,
        })}
        icon={saveInProgress ? undefined : <SaveIcon />}
        onClick={onListSave}
        disabled={saveInProgress}
      >
        {saveInProgress ? (
          <CircularProgress size={24} color="inherit" disableShrink />
        ) : (
          'Save changes'
        )}
      </Button>
      <Button
        fullWidth={matchesXs}
        color="default"
        className={clsx(classes.addItemButton, {
          [classes.mobileButton]: matchesXs,
        })}
        icon={<AddIcon />}
        onClick={onAddItemClick}
        disabled={saveInProgress}
      >
        New item
      </Button>
      <Button
        fullWidth={matchesXs}
        color="default"
        className={clsx(classes.revertChangesButton, {
          [classes.mobileButton]: matchesXs,
        })}
        icon={<HistoryIcon />}
        onClick={onRevertChanges}
        disabled={saveInProgress}
      >
        Revert Changes
      </Button>
    </Box>
  );
}
