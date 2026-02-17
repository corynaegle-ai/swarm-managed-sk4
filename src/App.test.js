import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock the components
jest.mock('./components/MainMenu', () => {
  return function MainMenu() {
    return <div data-testid="main-menu">Main Menu</div>;
  };
});

jest.mock('./components/PlayerSetup', () => {
  return function PlayerSetup({ onPlayersSetup, onBackToMenu, initialPlayers }) {
    return (
      <div data-testid="player-setup">
        Player Setup
        <button onClick={() => onPlayersSetup([{ name: 'Test Player' }])}>
          Set Players
        </button>
        <button onClick={onBackToMenu}>Back to Menu</button>
      </div>
    );
  };
});

jest.mock('./components/Game', () => {
  return function Game({ players, onBackToSetup, onBackToMenu }) {
    return (
      <div data-testid="game">
        Game - Players: {players.length}
        <button onClick={onBackToSetup}>Back to Setup</button>
        <button onClick={onBackToMenu}>Back to Menu</button>
      </div>
    );
  };
});

describe('App Routing', () => {
  test('renders main menu on root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
  });

  test('renders player setup on /setup path', () => {
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('player-setup')).toBeInTheDocument();
  });

  test('redirects to setup when accessing game without players', () => {
    render(
      <MemoryRouter initialEntries={['/game']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('player-setup')).toBeInTheDocument();
  });

  test('redirects unknown routes to main menu', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
  });
});