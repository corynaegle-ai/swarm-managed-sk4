import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerSetup from '../PlayerSetup';

describe('PlayerSetup Component', () => {
  test('renders player setup component', () => {
    render(<PlayerSetup />);
    expect(screen.getByText('Player Setup')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter player name')).toBeInTheDocument();
  });

  test('displays player count indicator', () => {
    render(<PlayerSetup />);
    expect(screen.getByText('0/8 players')).toBeInTheDocument();
  });

  test('shows empty state when no players exist', () => {
    render(<PlayerSetup />);
    expect(screen.getByText('No players added yet. Add your first player above!')).toBeInTheDocument();
  });

  test('adds player to list when valid name entered', () => {
    render(<PlayerSetup />);
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.click(addButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1/8 players')).toBeInTheDocument();
  });

  test('displays delete button for each player', () => {
    render(<PlayerSetup />);
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.click(addButton);

    expect(screen.getByRole('button', { name: 'Remove John Doe' })).toBeInTheDocument();
  });

  test('removes player when delete button clicked', () => {
    render(<PlayerSetup />);
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Add a player
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.click(addButton);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1/8 players')).toBeInTheDocument();

    // Delete the player
    const deleteButton = screen.getByRole('button', { name: 'Remove John Doe' });
    fireEvent.click(deleteButton);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('0/8 players')).toBeInTheDocument();
    expect(screen.getByText('No players added yet. Add your first player above!')).toBeInTheDocument();
  });

  test('updates player count immediately after deletion', () => {
    render(<PlayerSetup />);
    const input = screen.getByPlaceholderText('Enter player name');
    const addButton = screen.getByText('Add Player');

    // Add two players
    fireEvent.change(input, { target: { value: 'Player 1' } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: 'Player 2' } });
    fireEvent.click(addButton);

    expect(screen.getByText('2/8 players')).toBeInTheDocument();

    // Delete one player
    const deleteButton = screen.getByRole('button', { name: 'Remove Player 1' });
    fireEvent.click(deleteButton);

    expect(screen.getByText('1/8 players')).toBeInTheDocument();
  });
});