import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock BidCollection component
jest.mock('./components/BidCollection', () => {
  return function MockBidCollection() {
    return <div data-testid="bid-collection">BidCollection Component</div>;
  };
});

// Mock GameContext
jest.mock('./contexts/GameContext', () => ({
  GameProvider: ({ children }) => children
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
  });

  test('navigates to bid-collection route and renders BidCollection component', () => {
    render(
      <MemoryRouter initialEntries={['/bid-collection']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('bid-collection')).toBeInTheDocument();
  });

  test('redirects root path to bid-collection', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('bid-collection')).toBeInTheDocument();
  });
});