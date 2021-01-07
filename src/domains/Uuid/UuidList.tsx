import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import type { AxiosResponse } from 'axios';

// material
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

// source
import http from '../../services/Http';
import Button from '../../components/Button';
import SchemaActions from '../../components/SchemaActions';
import SchemaForm from '../../components/SchemaForm';
import { checkAllFormsValid } from '../../helpers/checkAllFormsValid';
import type { Schema } from '../../global/types';
import type { IFormValidation } from '../Car/types';
import type { IUuid } from './types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { focusFormInput } from '../../helpers/focusFormInput';

// TODO: share styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

let editedUuidList: IUuid[] = [];
let initialUuidList: IUuid[] = [];
let formsValidationObject: IFormValidation = {};

// TODO: at some point maybe there is a reason to create reusable SchemaList + SchemaCard (?), but probably depends on future needs/plans
export default function UuidList() {
  const classes = useStyles();
  const alert = useAlert();
  const [loading, setLoading] = useState<boolean>(true);
  const [uuidSchema, setUuidSchema] = useState<Schema>({
    fields: [],
    id: '',
    title: '',
  });
  const [uuidList, setUuidList] = useState<IUuid[]>([]);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  useEffect(() => {
    loadUuidData();
  }, []);

  useEffect(() => {
    editedUuidList = [...uuidList];
    focusFormInput();
  });

  if (loading) {
    return <CircularProgress disableShrink />;
  }

  return (
    <>
      <SchemaActions
        saveInProgress={saveInProgress}
        onListSave={handleSaveChanges}
        onAddItemClick={handleAddItemClick}
        onRevertChanges={handleRevertChanges}
      />
      <Grid container spacing={2}>
        {uuidList.map((uuidItem: IUuid, index) => {
          return (
            <Grid item key={index} xs={12} sm={6} md={6} lg={4} xl={3}>
              <Card
                className={saveInProgress ? classes.disabledCard : undefined}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      className={classes.avatar}
                      variant="square"
                      aria-label="number"
                    >
                      <span>#{index + 1}</span>
                    </Avatar>
                  }
                  title={uuidItem.uuidv4 === '' ? 'New uuid' : ''}
                />
                <CardContent>
                  <SchemaForm
                    schema={uuidSchema}
                    updateItemList={handleListUpdate}
                    initialValues={{
                      uuidv4: uuidItem.uuidv4,
                    }}
                    isDisabled={saveInProgress}
                    itemIndex={index}
                    onFormsValidation={handleFormsValidation}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    className={classes.deleteButton}
                    size="small"
                    variant="text"
                    color="default"
                    icon={<DeleteIcon />}
                    onClick={handleRemoveItemClick(index)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );

  // TODO: shareable functions (if we want reduce duplications across entities
  // function handleListUpdate() {}
  // function handleAddItemClick() {}
  // function handleRemoveItemClick() {}
  // function handleRevertChanges() {}
  // function handleSaveChanges() {}
  // function handleFormsValidation() {}

  function handleListUpdate(newItem: IUuid, itemIndex: number) {
    editedUuidList[itemIndex] = newItem;
  }

  function handleAddItemClick() {
    setUuidList([
      ...editedUuidList,
      {
        uuidv4: '',
      },
    ]);
  }

  function handleRemoveItemClick(itemIndex: number) {
    return function () {
      editedUuidList = [
        ...editedUuidList.slice(0, itemIndex),
        ...editedUuidList.slice(itemIndex + 1, editedUuidList.length),
      ];

      setUuidList(editedUuidList);

      delete formsValidationObject[itemIndex];
    };
  }

  function handleRevertChanges() {
    setUuidList([...initialUuidList]);
    formsValidationObject = {};
  }

  function handleSaveChanges() {
    console.log('formsValidationObject : >>', formsValidationObject);
    if (checkAllFormsValid(formsValidationObject)) {
      saveUuidList(editedUuidList);
    } else {
      alert.error('Please check if all inputs for listed data are valid');
    }
  }

  function handleFormsValidation(
    itemIndex: number,
    isValid: boolean,
    values: any,
  ) {
    formsValidationObject[itemIndex] = isValid && values.uuidv4;
  }

  async function loadUuidData() {
    try {
      await loadUuidSchema();
      await loadUuidList();
    } catch (e) {
      alert.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadUuidSchema() {
    const response: AxiosResponse<Schema> = await http.get('/data/uuid/schema');
    setUuidSchema(response.data);
  }

  async function loadUuidList() {
    const response: AxiosResponse<{
      data: IUuid[];
      revision: number;
      schema: 'uuid';
    }> = await http.get('/data/uuid');

    setUuidList(response.data.data);
    initialUuidList = response.data.data;
  }

  async function saveUuidList(newUuidList: IUuid[]) {
    console.log('newUuidList : >>', newUuidList);
    try {
      setSaveInProgress(true);

      const { data } = await http.post('/data/uuid', newUuidList);

      if (!data.error) {
        alert.success('Uuid list data was successfully updated');
        setUuidList(editedUuidList);
        initialUuidList = editedUuidList;
      } else {
        alert.error(data.error);
      }
    } catch (e) {
      alert.error(`Error: ${e.message}`);
    } finally {
      setSaveInProgress(false);
    }
  }
}
