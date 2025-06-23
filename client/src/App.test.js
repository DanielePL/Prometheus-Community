import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Prometheus login page', () => {
  render(<App />);
  const loginElement = screen.getByText(/PROMETHEUS/i);
  expect(loginElement).toBeInTheDocument();
});
