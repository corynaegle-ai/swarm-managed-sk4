import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BidCollection from './BidCollection';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

describe('BidCollection', () => {
  it('renders bid inputs for all players', () => {
    render(<BidCollection players={mockPlayers} handCount={5} />);
    
    expect(screen.getByLabelText('Player 1:')).toBeInTheDocument();
    expect(screen.getByLabelText('Player 2:')).toBeInTheDocument();
  });

  it('validates bids are between 0 and handCount', () => {
    render(<BidCollection players={mockPlayers} handCount={3} />);
    
    const input = screen.getByLabelText('Player 1:');
    fireEvent.change(input, { target: { value: '5' } });
    
    expect(screen.getByText('Bid must be between 0 and 3')).toBeInTheDocument();
    expect(input).toHaveClass('error');
  });

  it('shows error for negative bids', () => {
    render(<BidCollection players={mockPlayers} handCount={3} />);
    
    const input = screen.getByLabelText('Player 1:');
    fireEvent.change(input, { target: { value: '-1' } });
    
    expect(screen.getByText('Bid must be between 0 and 3')).toBeInTheDocument();
  });

  it('clears errors when valid bid is entered', () => {
    render(<BidCollection players={mockPlayers} handCount={3} />);
    
    const input = screen.getByLabelText('Player 1:');
    fireEvent.change(input, { target: { value: '5' } });
    expect(screen.getByText('Bid must be between 0 and 3')).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: '2' } });
    expect(screen.queryByText('Bid must be between 0 and 3')).not.toBeInTheDocument();
  });
});