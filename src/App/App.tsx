import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// source
import { API_CLUBY_KEY, API_HOST_URL } from '../global/constants';
import CarList from '../domains/Car/CarList';
import Button from '../components/Button';

// TODO: move out to a separate file (config/auth)
const requestConfig = {
  headers: {
    ClubyApiKey: API_CLUBY_KEY,
  },
};

interface Schema {
  id: string;
  title: string;
  fields: Array<{
    id: string;
    title: string;
    validationRegex: RegExp;
  }>;
}

// interface UuidSchema {}
// interface QuestionnaireSchema {}
// interface CarsSchema {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginButton: {},
    container: {
      margin: `${theme.spacing(2)}px 0 0`,
      padding: '0 20px',
    },
    alert: {
      margin: `0 0 ${theme.spacing(2)}px`,
      maxWidth: 600,
    },
  }),
);

export default function App(): JSX.Element {
  // TODO: move state along with components into independent components (local state)
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // todo: move
  const [alert, setAlert] = useState<boolean>(false);
  const [schema, setSchema] = useState<Schema>({
    id: '',
    title: '',
    fields: [],
  });

  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Cluby Coding Assignment</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        {login && (
          <Alert className={classes.alert} severity="success">
            Authentication successful...
          </Alert>
        )}

        {error && (
          <Alert className={classes.alert} severity="error">
            {error}
          </Alert>
        )}

        {login ? (
          // TODO: nested routing schema/cars schema/uuid schema/questionnaire
          'Schema goes here...'
        ) : (
          <Button
            disabled={loading}
            onClick={handleAuthenticateClick}
            className={classes.loginButton}
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </Button>
        )}
      </div>
    </>
  );

  function handleAuthenticateClick() {
    loginUser();
  }

  async function loginUser() {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_HOST_URL}/authentication/test`,
        requestConfig,
      );

      if (response.data.result.toLowerCase() === 'ok') {
        setLogin(true);
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (e) {
      setError('Something went wrong. Access denied');
    } finally {
      setLoading(false);
    }
  }
}
