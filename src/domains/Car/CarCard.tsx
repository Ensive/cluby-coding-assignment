import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '../../components/Button';
import type { ICar } from './types';

interface CardCardProps {
  car: ICar;
  index: number;
  onRemoveCarClick: any;
  // TODO: improve type ?
  children: JSX.Element;
  formId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginBottom: theme.spacing(2),
    },
    deleteButton: {
      marginLeft: 'auto',
    },
  }),
);

export default function CarCard({
  car,
  index,
  onRemoveCarClick,
  children,
  formId,
}: CardCardProps) {
  const classes = useStyles();
  // TODO: double check how reliable this is
  const isEmpty = car.licensePlate === '';

  // TODO: "Deleting..."
  // TODO: clean up form Id
  return (
    <Card square variant="outlined">
      <CardHeader
        avatar={
          <Avatar variant="square" aria-label="number">
            {isEmpty ? <AddIcon /> : <span>#{index}</span>}
          </Avatar>
        }
        title={car.carModel}
        subheader={car.licensePlate}
      />
      <CardContent>{children}</CardContent>
      <CardActions disableSpacing>
        <Button form={formId} type="submit">
          Save
        </Button>
        {!isEmpty && (
          <Button
            // TODO: isSubmitting
            className={classes.deleteButton}
            size="small"
            variant="text"
            color="default"
            icon={<DeleteIcon />}
            onClick={onRemoveCarClick(car)}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
