import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BidCollection from './BidCollection';

describe('BidCollection', () => {
  const mockPlayers = ['Alice', 'Bob', 'Charlie'];

  test('renders input field for each player with their name as label', () => {
    render(<BidCollection players={mockPlayers} />);
    
    mockPlayers.forEach(player => {
      expect(screen.getByLabelText(player)).toBeInTheDocument();
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
  });

  test('input fields use controlled state management', () => {
    render(<BidCollection players={mockPlayers} />);
    
    const aliceInput = screen.getByLabelText('Alice');
    fireEvent.change(aliceInput, { target: { value: '100' } });
    
    expect(aliceInput.value).toBe('100');
  });

  test('bid values are stored in component state object', () => {
    render(<BidCollection players={mockPlayers} />);
    
    const aliceInput = screen.getByLabelText('Alice');
    const bobInput = screen.getByLabelText('Bob');
    
    fireEvent.change(aliceInput, { target: { value: '100' } });
    fireEvent.change(bobInput, { target: { value: '200' } });
    
    expect(aliceInput.value).toBe('100');
    expect(bobInput.value).toBe('200');
  });

  test('input fields have correct attributes', () => {
    render(<BidCollection players={mockPlayers} />);
    
    mockPlayers.forEach(player => {
      const input = screen.getByLabelText(player);
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '0');
    });
  });
});