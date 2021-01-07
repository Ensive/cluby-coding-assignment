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

let updateItemListMock: () => void;
let onFormsValidationMock: () => void;
let schemaFormPropsMock: any;
let initialValues: any;

beforeEach(() => {
  updateItemListMock = jest.fn();
  onFormsValidationMock = jest.fn();
  initialValues = {
    carModel: 'BMW M5',
    licensePlate: 'XX-555',
  };

  schemaFormPropsMock = {
    schema: carSchemaMock,
    updateItemList: updateItemListMock,
    initialValues,
    onFormsValidation: onFormsValidationMock,
    isDisabled: false,
    itemIndex: 1,
  };
});

afterAll(() => {
  jest.clearAllMocks();
});

test('calls onFormsValidation() on render with relevant props', () => {
  render(<SchemaForm {...schemaFormPropsMock} />);

  expect(onFormsValidationMock).toBeCalledWith(1, true, initialValues);
});

test('renders values in the forms based on props', () => {
  render(<SchemaForm {...schemaFormPropsMock} />);
  expect(screen.getByLabelText(/car model/i)).toHaveValue('BMW M5');
  expect(screen.getByLabelText(/license plate/i)).toHaveValue('XX-555');
});
