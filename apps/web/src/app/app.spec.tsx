import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';

import App from './app';

function renderApp(route = '/') {
  return render(
    <MockedProvider mocks={[]}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </MockedProvider>,
  );
}

describe('App', () => {
  it('renders successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });

  it('shows the navbar with the logo and main links', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'Trip Desk' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Destinations' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Itineraries' })).toBeTruthy();
  });

  it('renders a main landmark', () => {
    renderApp();
    expect(screen.getByRole('main')).toBeTruthy();
  });
});
