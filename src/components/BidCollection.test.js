import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BidCollection from './BidCollection';
import { GameContext } from '../contexts/GameContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockGameState = {
  players: [
    { id: '1', name: 'Player 1' },
    { id: '2', name: 'Player 2' }
  ]
};

const mockSubmitBids = jest.fn();

const renderWithContext = (gameState = mockGameState) => {
  return render(
    <BrowserRouter>
      <GameContext.Provider value={{ 
        gameState, 
        submitBids: mockSubmitBids 
      }}>
        <BidCollection />
      </GameContext.Provider>
    </BrowserRouter>
  );
};

describe('BidCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validates all bids are entered before submission', async () => {
    renderWithContext();
    
    const submitButton = screen.getByText('Submit Bids');
    expect(submitButton).toBeDisabled();
    
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/please enter bids for all players/i)).toBeInTheDocument();
    expect(mockSubmitBids).not.toHaveBeenCalled();
  });

  test('calls submitBids with correct data structure', async () => {
    mockSubmitBids.mockResolvedValue();
    renderWithContext();
    
    const bidInput1 = screen.getByLabelText(/bid for player 1/i);
    const bidInput2 = screen.getByLabelText(/bid for player 2/i);
    
    fireEvent.change(bidInput1, { target: { value: '10' } });
    fireEvent.change(bidInput2, { target: { value: '20' } });
    
    const submitButton = screen.getByText('Submit Bids');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmitBids).toHaveBeenCalledWith({
        '1': '10',
        '2': '20'
      });
    });
  });

  test('navigates to next phase after successful submission', async () => {
    mockSubmitBids.mockResolvedValue();
    renderWithContext();
    
    const bidInput1 = screen.getByLabelText(/bid for player 1/i);
    const bidInput2 = screen.getByLabelText(/bid for player 2/i);
    
    fireEvent.change(bidInput1, { target: { value: '10' } });
    fireEvent.change(bidInput2, { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Submit Bids'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/game/results');
    });
  });

  test('displays loading state and error handling', async () => {
    const errorMessage = 'Submission failed';
    mockSubmitBids.mockRejectedValue(new Error(errorMessage));
    renderWithContext();
    
    const bidInput1 = screen.getByLabelText(/bid for player 1/i);
    const bidInput2 = screen.getByLabelText(/bid for player 2/i);
    
    fireEvent.change(bidInput1, { target: { value: '10' } });
    fireEvent.change(bidInput2, { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Submit Bids'));
    
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});