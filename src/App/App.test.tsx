import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import http from '../services/Http';

jest.mock('react-alert', () => ({
  useAlert: () => ({
    error: () => {},
    success: () => {},
  }),
}));

// TODO: can we do jest.mock('axios') ?
beforeEach(() => {
  // @ts-ignore
  http.get = jest.fn(() =>
    Promise.resolve({
      data: {
        result: 'ok',
      },
    }),
  );
});

test('renders cluby coding assignment title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  const linkElement = screen.getByText(/cluby coding assignment/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders schema select after successful API key check', async () => {
  const { getByText } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  const checkApiButton = getByText(/check api key/i);
  checkApiButton.click();

  expect(checkApiButton.textContent).toMatch(/validating api key/i);

  await waitFor(() => {
    expect(getByText('Current schema')).toBeInTheDocument();
  });
});

test('renders button with initial state if API key check is unsuccessful', async () => {
  // @ts-ignore
  http.get = jest.fn(() =>
    Promise.resolve({
      data: {
        error: 'Access denied',
      },
    }),
  );

  const { getByText } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  const checkApiButton = getByText(/check api key/i);
  checkApiButton.click();

  await waitFor(() => {
    expect(getByText(/check api key/i)).toBeInTheDocument();
  });
});
