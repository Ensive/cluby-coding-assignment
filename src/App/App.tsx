import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { API_CLUBY_KEY, API_HOST_URL } from '../global/constants';
import CarList from '../components/Car/CarList';

function App() {
  const [login, setLogin] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loginUser();
  }, []);

  return (
    <div>
      <header>
        <h1>Cluby Coding Assignment</h1>
      </header>

      <div>{login ? <CarList /> : 'Authenticating...'}</div>
    </div>
  );

  async function loginUser() {
    const response = await axios.get(`${API_HOST_URL}/authentication/test`, {
      headers: {
        ClubyApiKey: API_CLUBY_KEY,
      },
    });

    if (response.data.result.toLowerCase() === 'ok') {
      setLogin(true);
    } else {
      setError(true);
    }
  }
}

export default App;
