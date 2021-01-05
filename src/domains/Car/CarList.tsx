import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useAlert } from 'react-alert';

// material
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

// source
import { API_HOST_URL, authHeadersRequestConfig } from '../../global/constants';
import SchemaForm from '../../components/SchemaForm';
import CarCard from './CarCard';
import type { Schema } from '../../global/types';
import type { CarFormValidation, ICar } from './types';
import SchemaActions from '../../components/SchemaActions';

// TODO: shall we optimize this?
// in memory values, serves as intermediate state.
let editedCarList: ICar[] = [];
let initialCarList: ICar[] = [];
let carFormsValidationObject: CarFormValidation = {};

export default function CarList() {
  const alert = useAlert();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [carsSchema, setCarsSchema] = useState<Schema>({
    fields: [],
    id: '',
    title: '',
  });
  const [carList, setCarList] = useState<ICar[]>([]);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);
  // const [disableSaveButton, setDisableSaveButton] = useState(false);

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    editedCarList = [...carList];
  }, [carList]);

  if (error) {
    alert.error(`Error: ${error}`);
    return <div>Please, refresh the page</div>;
  }

  if (loading) {
    return <CircularProgress disableShrink />;
  }

  // TODO: shall we use react transitions for card appearing?
  return (
    <>
      <SchemaActions
        saveInProgress={saveInProgress}
        onCarListSave={handleCarListSave}
        onAddCarClick={handleAddCarClick}
        onRevertChanges={handleRevertChanges}
      />
      <Grid container spacing={2}>
        {carList.map((car, index) => {
          // TODO: clean up form id
          return (
            <Grid item key={index} xs={12} sm={6} md={6} lg={4} xl={3}>
              {/* TODO: shall we render Schema Form inside of CarCard component to reduce duplication and improve clarity/readability */}
              <CarCard
                car={car}
                carIndex={index}
                onRemoveCarClick={handleRemoveCarClick}
                isDisabled={saveInProgress}
              >
                <SchemaForm
                  schema={carsSchema}
                  updateCarList={handleCarListUpdate}
                  initialValues={{
                    carModel: car.carModel,
                    licensePlate: car.licensePlate,
                  }}
                  isDisabled={saveInProgress}
                  carIndex={index}
                  onCarFormsValidation={handleCarFormsValidation}
                />
              </CarCard>
            </Grid>
          );
        })}
        {renderAddCarButton()}
      </Grid>
    </>
  );

  function renderAddCarButton() {
    return (
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Fab size="small" color="primary" onClick={handleAddCarClick}>
          <AddIcon />
        </Fab>
      </Grid>
    );
  }

  function handleCarListUpdate(newCar: ICar, carIndex: number) {
    editedCarList[carIndex] = newCar;
  }

  function handleAddCarClick() {
    setCarList([
      ...editedCarList,
      {
        carModel: '',
        licensePlate: '',
      },
    ]);
  }

  function handleRemoveCarClick(carIndex: number) {
    return function (e: React.MouseEvent<HTMLButtonElement>) {
      editedCarList = [
        ...editedCarList.slice(0, carIndex),
        ...editedCarList.slice(carIndex + 1, editedCarList.length),
      ];
      setCarList(editedCarList);
      delete carFormsValidationObject[carIndex];
    };
  }

  function handleRevertChanges() {
    setCarList([...initialCarList]);
    carFormsValidationObject = {};
  }

  function handleCarListSave() {
    if (checkAllFormsValid(carFormsValidationObject)) {
      saveCarList(editedCarList);
    } else {
      // setCarList(editedCarList);
      alert.error('Please check if all inputs for listed cars are valid');
    }
  }

  function handleCarFormsValidation(carIndex: number, isValid: boolean) {
    carFormsValidationObject[carIndex] = isValid;
  }

  // TODO: refactor axios out to a separate HTTP module class
  async function loadPageData() {
    try {
      await loadCarsSchema();
      await loadCarList();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadCarsSchema(): Promise<any> {
    const response: AxiosResponse<Schema> = await axios.get(
      `${API_HOST_URL}/data/cars/schema`,
      authHeadersRequestConfig,
    );

    setCarsSchema(response.data);
  }

  async function loadCarList(): Promise<any> {
    const response: AxiosResponse<{
      data: ICar[];
      revision: number;
      schema: 'cars';
    }> = await axios.get(`${API_HOST_URL}/data/cars`, authHeadersRequestConfig);

    setCarList(response.data.data);
    initialCarList = response.data.data;
  }

  async function saveCarList(newCarList: ICar[]) {
    try {
      setSaveInProgress(true);
      const response = await axios.post(
        `${API_HOST_URL}/data/cars`,
        newCarList,
        authHeadersRequestConfig,
      );

      if (!response.data.error) {
        alert.success(`Car list was successfully updated`);
        setCarList(editedCarList);
        // reset initial values after updating list on the backend
        initialCarList = editedCarList;
      } else {
        alert.error(response.data.error);
      }
    } catch (e: any) {
      alert.error(e.message);
    } finally {
      setSaveInProgress(false);
    }
  }
}

function checkAllFormsValid(formsList: CarFormValidation): boolean {
  const formsCount = Object.keys(formsList).length;

  for (let i = 0; i < formsCount; i++) {
    if (!formsList[i]) return false;
  }

  return true;
}
