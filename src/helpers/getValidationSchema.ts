import type { SchemaField } from '../global/types';
// TODO: shall we optimize yup imports?
import * as yup from 'yup';

export function getValidationSchema(fields: SchemaField[]) {
  const fieldsValidation = fields.reduce((accumulator, field) => {
    // TODO: refactor this out to props or normalize schema on frontend
    const validationMessages: any = {
      carModel: {
        required: 'Car model is required',
        validPattern: 'Car model is invalid',
      },
      licensePlate: {
        required: 'License plate number is required',
        validPattern:
          'License plate is invalid. It should match the vehicle registration plates standards of Finland',
      },
      uuidv4: {
        required: 'Uuid is required',
        validPattern: 'Uuid is invalid',
      },
    };

    return {
      ...accumulator,
      [field.id]: yup
        .string()
        .required(validationMessages[field.id].required)
        .matches(RegExp(field.validationRegex), {
          message: validationMessages[field.id].validPattern,
        }),
    };
  }, {});

  return yup.object().shape(fieldsValidation);
}
