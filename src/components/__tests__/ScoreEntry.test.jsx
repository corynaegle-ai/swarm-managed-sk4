import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScoreEntry from '../ScoreEntry';

const mockPlayers = [
  { id: 1, name: 'Alice', bid: 3 },
  { id: 2, name: 'Bob', bid: 2 }
];

describe('ScoreEntry Component', () => {
  test('displays player names and bids', () => {
    render(<ScoreEntry players={mockPlayers} handCount={5} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Bid: 3')).toBeInTheDocument();
    expect(screen.getByText('Bid: 2')).toBeInTheDocument();
  });

  test('validates tricks taken input range', () => {
    render(<ScoreEntry players={mockPlayers} handCount={5} />);
    
    const tricksInput = screen.getAllByLabelText(/Tricks Taken:/)[0];
    
    // Valid input
    fireEvent.change(tricksInput, { target: { value: '3' } });
    expect(tricksInput.value).toBe('3');
    
    // Invalid input (above handCount) should not change
    fireEvent.change(tricksInput, { target: { value: '6' } });
    expect(tricksInput.value).toBe('3'); // Should remain previous valid value
    
    // Valid boundary
    fireEvent.change(tricksInput, { target: { value: '5' } });
    expect(tricksInput.value).toBe('5');
  });

  test('bonus points defaults to 0', () => {
    render(<ScoreEntry players={mockPlayers} handCount={5} />);
    
    const bonusInputs = screen.getAllByLabelText(/Bonus Points:/);
    bonusInputs.forEach(input => {
      expect(input.value).toBe('0');
    });
  });

  test('calculates scores in real-time', () => {
    render(<ScoreEntry players={mockPlayers} handCount={5} />);
    
    const tricksInput = screen.getAllByLabelText(/Tricks Taken:/)[0];
    const bonusInput = screen.getAllByLabelText(/Bonus Points:/)[0];
    
    // Player bid is 3, if they take 3 tricks: 10 + 3 = 13
    fireEvent.change(tricksInput, { target: { value: '3' } });
    expect(screen.getByText('Round Score: 13')).toBeInTheDocument();
    
    // Add bonus points: 13 + 2 = 15
    fireEvent.change(bonusInput, { target: { value: '2' } });
    expect(screen.getByText('Round Score: 15')).toBeInTheDocument();
  });

  test('prevents invalid values', () => {
    render(<ScoreEntry players={mockPlayers} handCount={5} />);
    
    const tricksInput = screen.getAllByLabelText(/Tricks Taken:/)[0];
    
    // Try negative value
    fireEvent.change(tricksInput, { target: { value: '-1' } });
    expect(tricksInput.value).toBe(''); // Should not accept negative
    
    // Try value above handCount
    fireEvent.change(tricksInput, { target: { value: '10' } });
    expect(tricksInput.value).toBe(''); // Should not accept above handCount
  });
});