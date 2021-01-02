import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useAlert } from 'react-alert';
import { v4 as uuidv4 } from 'uuid';
import type { FormikValues } from 'formik';

// material
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

// source
import { API_HOST_URL, authHeadersRequestConfig } from '../../global/constants';
import SchemaForm from '../../components/SchemaForm';
import CarCard from './CarCard';
import type { Schema } from '../../global/types';
import type { ICar } from './types';

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

  useEffect(() => {
    loadPageData();
  }, []);

  // TODO: shall we get rid of error state entirely?
  if (error) {
    alert.error(`Error: ${error}`);
    return <div>Please, refresh the page</div>;
  }

  if (loading) {
    // TODO: replace with loading skeleton ?
    return <CircularProgress disableShrink />;
  }

  // TODO: shall we use react transitions for card appearing?
  return (
    <>
      <Grid container spacing={2}>
        {carList.map((car, index) => {
          // TODO: clean up form id
          const formId = uuidv4();
          return (
            <Grid item key={uuidv4()} xs={12} sm={6} md={6} lg={4} xl={3}>
              <CarCard
                car={car}
                index={index + 1}
                onRemoveCarClick={handleRemoveCarClick}
                formId={formId}
              >
                <SchemaForm
                  formId={formId}
                  schema={carsSchema}
                  onSubmit={handleCarListUpdate}
                  initialValues={{
                    carModel: car.carModel,
                    licensePlate: car.licensePlate,
                  }}
                />
              </CarCard>
            </Grid>
          );
        })}
        {renderNewCarCard()}
      </Grid>
    </>
  );

  function renderNewCarCard() {
    const formId = uuidv4();
    return (
      <Grid item key={uuidv4()} xs={12} sm={6} md={6} lg={4} xl={3}>
        <CarCard
          car={{
            carModel: 'New Car',
            licensePlate: '',
          }}
          index={carList.length + 1}
          onRemoveCarClick={handleRemoveCarClick}
          formId={formId}
        >
          <SchemaForm
            formId={formId}
            schema={carsSchema}
            onSubmit={handleNewCarSubmit}
          />
        </CarCard>
      </Grid>
    );
  }

  function handleCarListUpdate(values: FormikValues) {
    debugger;
  }

  function handleNewCarSubmit(values: FormikValues) {
    console.log('values : >>', values);
    const { carModel, licensePlate } = values;
    saveNewCar({
      carModel,
      licensePlate,
    });
  }

  function handleRemoveCarClick(car: ICar) {
    return function (e: React.MouseEvent<HTMLButtonElement>) {
      console.log(e);
    };
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
  }

  async function saveNewCar(newCar: ICar) {
    try {
      const response = await axios.post(
        `${API_HOST_URL}/data/cars`,
        [...carList, newCar],
        authHeadersRequestConfig,
      );

      console.log('response : >>', response);

      if (!response.data.error) {
        // TODO: custom message ?
        alert.success(`New car "${newCar.carModel}" was added`);
      } else {
        alert.error(response.data.error);
      }
    } catch (e) {
      alert.error(e);
    }
  }
}
