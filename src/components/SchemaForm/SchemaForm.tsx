import React from 'react';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import type { TextFieldProps } from '@material-ui/core';

import { getValidationSchema } from '../../helpers/getValidationSchema';
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
    [p: string]: string;
  };
  // TODO: typescript
  updateItemList: any;
  itemIndex: number;
  isDisabled: boolean;
  onFormsValidation: (itemIndex: number, isValid: boolean, values: any) => void;
}

export default function SchemaForm({
  schema,
  initialValues,
  updateItemList,
  itemIndex,
  isDisabled,
  onFormsValidation,
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
        onFormsValidation(itemIndex, isValid, values);
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
            updateItemList(
              {
                ...values,
                [field]: e.target.value,
              },
              itemIndex,
            );
            handleBlur(e);
          };
        }
      }}
    </Formik>
  );
}
