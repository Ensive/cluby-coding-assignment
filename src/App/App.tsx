import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

// material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
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
    authenticateButton: {},
    container: {
      margin: `${theme.spacing(2)}px 0 0`,
      padding: '0 20px',
    },
    alert: {
      margin: `0 0 ${theme.spacing(2)}px`,
      maxWidth: 600,
    },
    schemaFormControl: {
      minWidth: 200,
      marginBottom: theme.spacing(2),
    },
    schemaSelect: {
      // fontSize: 20,
      // height: 46,
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
  const [schema, setSchema] = useState<string>('none');

  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (schema === 'none') {
      history.push('/');
    }
  }, [schema]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Cluby Coding Assignment</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        {login && renderAuthSuccess()}
        {error && renderError()}
        {login ? renderSchema() : renderAuthenticateButton()}
      </div>
    </>
  );

  function renderAuthenticateButton() {
    return (
      <Button
        disabled={loading}
        onClick={handleAuthenticateClick}
        className={classes.authenticateButton}
      >
        {loading ? 'Authenticating...' : 'Authenticate'}
      </Button>
    );
  }

  function renderAuthSuccess() {
    return (
      <Alert className={classes.alert} severity="success">
        Authentication successful
      </Alert>
    );
  }

  function renderError() {
    return (
      <Alert className={classes.alert} severity="error">
        {error}
      </Alert>
    );
  }

  function renderSchema() {
    return (
      <>
        {renderSchemaSelect()}
        <Switch>
          <Route exact path="/cars">
            Car Schema
          </Route>
          <Route exact path="/uuid">
            Uuid Schema
          </Route>
          <Route exact path="/questionnaire">
            Questionnaire Schema
          </Route>
        </Switch>
      </>
    );
  }

  function renderSchemaSelect() {
    return (
      <div>
        <FormControl variant="filled" className={classes.schemaFormControl}>
          <InputLabel id="schema-select-label">Current schema</InputLabel>
          <Select
            className={classes.schemaSelect}
            labelId="schema-select-label"
            id="schema-select"
            value={schema}
            onChange={handleSchemaChange}
          >
            <MenuItem value="none">
              <em>Select Schema...</em>
            </MenuItem>
            <MenuItem value="cars">cars</MenuItem>
            <MenuItem value="uuid">uuid</MenuItem>
            <MenuItem value="questionnaire">questionnaire</MenuItem>
          </Select>
        </FormControl>
      </div>
    );

    function handleSchemaChange(event: React.ChangeEvent<{ value: unknown }>) {
      setSchema(event.target.value as string);
      history.push(event.target.value as string);
    }
  }

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
