import React from 'react';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
// TODO: shall we optimize yup imports?
import * as yup from 'yup';

import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import type { TextFieldProps } from '@material-ui/core';

import type { Schema, SchemaField } from '../../global/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginBottom: theme.spacing(2),
    },
  }),
);

interface SchemaFormProps {
  schema: Schema;
  initialValues: {
    carModel: string;
    licensePlate: string;
  };
  // TODO: typescript
  updateCarList: any;
  carIndex: number;
  isDisabled: boolean;
  onCarFormsValidation: (carIndex: number, isValid: boolean) => void;
}

export default function SchemaForm({
  schema,
  initialValues,
  updateCarList,
  carIndex,
  isDisabled,
  onCarFormsValidation,
}: SchemaFormProps) {
  const classes = useStyles();
  const validationSchema = getValidationSchema(schema.fields);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      // no op
      onSubmit={() => {
        // TODO: delete
        // console.log('values : >>', values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid,
      }: FormikProps<FormikValues>) => {
        onCarFormsValidation(
          carIndex,
          Boolean(isValid && values.carModel && values.licensePlate),
        );
        const textFieldProps: TextFieldProps = {
          className: classes.textField,
          variant: 'filled',
          disabled: isDisabled,
          fullWidth: true,
        };

        return (
          <Form>
            {schema.fields.map((field) => {
              return (
                <TextField
                  key={field.id}
                  label={field.title}
                  error={!!(errors[field.id] && touched[field.id])}
                  helperText={
                    errors[field.id] && touched[field.id]
                      ? errors[field.id]
                      : null
                  }
                  value={values[field.id]}
                  name={field.id}
                  id={field.id}
                  {...textFieldProps}
                  onChange={handleChange}
                  onBlur={handleFieldBlur(field.id)}
                />
              );
            })}
          </Form>
        );

        function handleFieldBlur(field: string) {
          return function (e: any) {
            updateCarList(
              {
                ...values,
                [field]: e.target.value,
              },
              carIndex,
            );
            handleBlur(e);
          };
        }
      }}
    </Formik>
  );
}

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
