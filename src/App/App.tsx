import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import axios from 'axios';

// material
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// source
import { API_HOST_URL, authHeadersRequestConfig } from '../global/constants';
import CarList from '../domains/Car/CarList';
import Button from '../components/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authenticateButton: {},
    container: {
      margin: `${theme.spacing(2)}px 0 0`,
      padding: '0 20px',
    },
    schemaFormControl: {
      minWidth: 200,
      marginBottom: theme.spacing(4),
    },
    schemaSelect: {
    },
  }),
);

// TODO: update auth names to "api key validation" names
export default function App(): JSX.Element {
  // TODO: move state along with components into independent components (local state)
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [schema, setSchema] = useState<string>('none');

  const alert = useAlert();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    // TODO: delete,
    // setLogin(true);
    // setSchema('cars');

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
        {loading ? 'Validating API key...' : 'Check API key'}
      </Button>
    );
  }

  function renderSchema() {
    return (
      <>
        {renderSchemaSelect()}
        <Switch>
          <Route exact path="/cars">
            <CarList />
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
        <FormControl className={classes.schemaFormControl} focused size="small">
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
        authHeadersRequestConfig,
      );

      if (response.data.result.toLowerCase() === 'ok') {
        alert.success('API key is valid');
        setLogin(true);
      } else if (response.data.error) {
        alert.error(`Error: ${response.data.error}`);
        // TODO: ask your server administrator to provide valid API key (message)
      }
    } catch (e) {
      alert.error('Something went wrong. Try again, please');
    } finally {
      setLoading(false);
    }
  }
}
