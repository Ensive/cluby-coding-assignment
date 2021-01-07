import React from 'react';
import { render, screen } from '@testing-library/react';
import SchemaForm from './SchemaForm';

const carSchemaMock = {
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

let updateCarListMock: () => void;
let onCarFormsValidationMock: () => void;
let schemaFormPropsMock: any;

beforeEach(() => {
  updateCarListMock = jest.fn();
  onCarFormsValidationMock = jest.fn();
  const initialValues = {
    carModel: 'BMW M5',
    licensePlate: 'XX-555',
  };

  schemaFormPropsMock = {
    schema: carSchemaMock,
    updateCarList: updateCarListMock,
    initialValues,
    onCarFormsValidation: onCarFormsValidationMock,
    isDisabled: false,
    carIndex: 1,
  };
});

afterAll(() => {
  jest.clearAllMocks();
});

test('calls onCarFormsValidation() on render with relevant props', () => {
  render(<SchemaForm {...schemaFormPropsMock} />);

  expect(onCarFormsValidationMock).toBeCalledWith(1, true);
});

test('renders values in the forms based on props', () => {
  render(<SchemaForm {...schemaFormPropsMock} />);
  expect(screen.getByLabelText(/car model/i)).toHaveValue('BMW M5');
  expect(screen.getByLabelText(/license plate/i)).toHaveValue('XX-555');
});
