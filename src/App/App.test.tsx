import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cluby coding assignment title', () => {
  render(<App />);
  const linkElement = screen.getByText(/cluby coding assignment/i);
  expect(linkElement).toBeInTheDocument();
});
