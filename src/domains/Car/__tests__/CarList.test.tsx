import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';

import http from '../../../services/Http';
import CarList from '../CarList';

jest.mock('react-alert');

const dataResponseMock = {
  data: [
    {
      carModel: 'Tesla Model S',
      licensePlate: 'XYZ-123',
    },
    {
      carModel: 'BMW X5',
      licensePlate: 'X-456',
    },
    {
      carModel: 'Jaguar New Model',
      licensePlate: 'JJ-890',
    },
    {
      carModel: 'My new super elegant car',
      licensePlate: 'TH-272',
    },
    {
      carModel: 'Mustang GT',
      licensePlate: 'GT-123',
    },
  ],
  revision: 76,
  schema: 'cars',
};

const dataCarsSchema = {
  fields: [
    {
      id: 'carModel',
      title: 'Car model',
      validationRegex: '^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s\\.-]{1,64}$',
    },
    {
      id: 'licensePlate',
      title: 'License plate',
      validationRegex: '^([A-Z]){1,3}-([0-9]){1,3}$',
    },
  ],
  id: 'cars',
  title: 'My car list',
};

test('<CarList> has a button to add new car', async () => {
  // @ts-ignore
  // http.get = jest.fn(() =>
  //   Promise.resolve({
  //     data: dataCarsSchema,
  //   }),
  // );

  const { getByText } = render(<CarList />);

  // await waitFor(() => {
  //   expect(getByText('Save Changes')).toBeInTheDocument();
  // });
});
