import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import DeleteIcon from '@material-ui/icons/Delete';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '../../components/Button';
import type { ICar } from './types';

interface CardCardProps {
  car: ICar;
  carIndex: number;
  onRemoveCarClick: any;
  // TODO: improve type ?
  children: JSX.Element;
  isDisabled: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginBottom: theme.spacing(2),
    },
    deleteButton: {
      marginLeft: 'auto',
    },
    avatar: {
      color: 'rgba(0, 0, 0, .5)',
      background: 'none',
    },
    disabledCard: {
      opacity: 0.7,
    },
  }),
);

function CarCard({
  car,
  carIndex,
  onRemoveCarClick,
  children,
  isDisabled,
}: CardCardProps) {
  const classes = useStyles();
  const isEmpty = car.licensePlate === '' && car.carModel === '';

  // TODO: clean up form Id
  return (
    <Card
      className={isDisabled ? classes.disabledCard : undefined}
      square
      variant="outlined"
    >
      <CardHeader
        avatar={
          <Avatar
            className={classes.avatar}
            variant="square"
            aria-label="number"
          >
            <span>#{carIndex + 1}</span>
          </Avatar>
        }
        title={isEmpty ? 'New Car' : car.carModel}
        subheader={car.licensePlate}
      />
      <CardContent>{children}</CardContent>
      <CardActions>
        <Button
          // TODO: isSubmitting
          className={classes.deleteButton}
          size="small"
          variant="text"
          color="default"
          icon={<DeleteIcon />}
          onClick={onRemoveCarClick(carIndex)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}

export default React.memo(CarCard, areEqual);

function areEqual(prevProps: CardCardProps, nextProps: CardCardProps) {
  // this is to rerender empty forms anyway
  // if (prevProps.car.carModel === '' && nextProps.car.licensePlate === '') {
  //   return false;
  // }

  return (
    prevProps.car === nextProps.car &&
    prevProps.isDisabled === nextProps.isDisabled
  );
}
