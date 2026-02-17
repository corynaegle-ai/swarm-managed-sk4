import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidCollection from './BidCollection';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

describe('BidCollection', () => {
  test('renders with disabled submit button initially', () => {
    render(<BidCollection players={mockPlayers} />);
    
    const submitButton = screen.getByRole('button', { name: /submit bids/i });
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when all bids are valid', () => {
    render(<BidCollection players={mockPlayers} />);
    
    const input1 = screen.getByLabelText(/player 1/i);
    const input2 = screen.getByLabelText(/player 2/i);
    const submitButton = screen.getByRole('button', { name: /submit bids/i });
    
    fireEvent.change(input1, { target: { value: '10.50' } });
    fireEvent.change(input2, { target: { value: '15.25' } });
    
    expect(submitButton).not.toBeDisabled();
  });

  test('calls onSubmit with correct bid values when submitted', () => {
    const mockOnSubmit = jest.fn();
    render(<BidCollection players={mockPlayers} onSubmit={mockOnSubmit} />);
    
    const input1 = screen.getByLabelText(/player 1/i);
    const input2 = screen.getByLabelText(/player 2/i);
    const submitButton = screen.getByRole('button', { name: /submit bids/i });
    
    fireEvent.change(input1, { target: { value: '10.50' } });
    fireEvent.change(input2, { target: { value: '15.25' } });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      '1': 10.5,
      '2': 15.25
    });
  });

  test('remains disabled with invalid bids', () => {
    render(<BidCollection players={mockPlayers} />);
    
    const input1 = screen.getByLabelText(/player 1/i);
    const submitButton = screen.getByRole('button', { name: /submit bids/i });
    
    fireEvent.change(input1, { target: { value: '0' } });
    
    expect(submitButton).toBeDisabled();
  });
});