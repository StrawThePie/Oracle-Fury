import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { App } from '../App';

function renderApp() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  );
}

it('renders and allows resolving an action', () => {
  renderApp();
  const input = screen.getByLabelText('Action or dialogue');
  fireEvent.change(input, { target: { value: 'Test action' } });
  fireEvent.click(screen.getByRole('button', { name: 'Resolve' }));
  expect(screen.getByText(/Success:|Complication:/)).toBeInTheDocument();
});