import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreDisplay from './ScoreDisplay';

describe('ScoreDisplay', () => {
  const mockGameData = {
    players: [
      {
        id: 1,
        name: 'Alice',
        rounds: [10, 15, 20]
      },
      {
        id: 2,
        name: 'Bob',
        rounds: [25, 10, 15]
      },
      {
        id: 3,
        name: 'Charlie',
        rounds: [5, 20, 25]
      }
    ]
  };

  test('renders score table with player names and scores', () => {
    render(<ScoreDisplay gameData={mockGameData} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('calculates and displays total scores correctly', () => {
    render(<ScoreDisplay gameData={mockGameData} />);
    
    // Alice: 10+15+20 = 45
    // Bob: 25+10+15 = 50  
    // Charlie: 5+20+25 = 50
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getAllByText('50')).toHaveLength(2);
  });

  test('sorts players by total score descending', () => {
    render(<ScoreDisplay gameData={mockGameData} />);
    
    const playerRows = screen.getAllByTestId('player-row');
    // Bob and Charlie should be first (tied at 50), Alice last (45)
    expect(playerRows[0]).toHaveTextContent('Bob');
    expect(playerRows[2]).toHaveTextContent('Alice');
  });

  test('displays individual round scores', () => {
    render(<ScoreDisplay gameData={mockGameData} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test('highlights current round column', () => {
    render(<ScoreDisplay gameData={mockGameData} currentRound={2} />);
    
    const round2Header = screen.getByText('Round 2');
    expect(round2Header).toHaveClass('currentRound');
  });

  test('handles empty game data gracefully', () => {
    render(<ScoreDisplay gameData={{}} />);
    
    expect(screen.getByText('No game data available')).toBeInTheDocument();
  });

  test('handles missing rounds data', () => {
    const incompleteData = {
      players: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob', rounds: [10, 20] }
      ]
    };
    
    render(<ScoreDisplay gameData={incompleteData} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument(); // Bob's total
    expect(screen.getByText('0')).toBeInTheDocument(); // Alice's total
  });
});