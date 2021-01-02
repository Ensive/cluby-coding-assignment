import React from 'react';
import { Form, Formik, FormikProps, FormikValues, FormikHelpers } from 'formik';
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
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => void | Promise<any>;
  initialValues?: any;
  // TODO: delete formId usage
  formId: string;
}

export default function SchemaForm(props: SchemaFormProps) {
  const classes = useStyles();
  // TODO: avoid using variables
  const validationSchema = getValidationSchema(props.schema.fields);
  const initialValues =
    props.initialValues || getInitialValues(props.schema.fields);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      // TODO: delete?
      onSubmit={props.onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        isSubmitting,
      }: FormikProps<FormikValues>) => {
        const textFieldProps: TextFieldProps = {
          className: classes.textField,
          variant: 'filled',
          disabled: isSubmitting,
          fullWidth: true,
          onChange: handleChange,
        };

        // TODO: renderFunction for field ???
        return (
          <Form id={props.formId}>
            {props.schema.fields.map((field) => {
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
                  id={field.id}
                  {...textFieldProps}
                />
              );
            })}
          </Form>
        );
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

function getInitialValues(fields: SchemaField[]) {
  return fields.reduce((accumulator, field: SchemaField) => {
    return {
      ...accumulator,
      [field.id]: '',
    };
  }, {});
}
