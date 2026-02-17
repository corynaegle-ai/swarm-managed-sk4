import React from 'react';
import styles from './ScoreDisplay.module.css';

const ScoreDisplay = ({ gameData, currentRound = 1 }) => {
  // Handle empty or invalid data
  if (!gameData || !gameData.players || gameData.players.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>No game data available</p>
      </div>
    );
  }

  // Calculate total scores and sort players by total score descending
  const playersWithTotals = gameData.players
    .map(player => ({
      ...player,
      totalScore: player.rounds ? player.rounds.reduce((sum, score) => sum + (score || 0), 0) : 0
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  // Get maximum number of rounds to determine columns
  const maxRounds = Math.max(
    ...playersWithTotals.map(player => (player.rounds ? player.rounds.length : 0)),
    currentRound
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Score Board</h2>
      
      <div className={styles.tableWrapper}>
        <table className={styles.scoreTable}>
          <thead>
            <tr>
              <th className={styles.playerHeader}>Player</th>
              <th className={styles.totalHeader}>Total</th>
              {Array.from({ length: maxRounds }, (_, index) => (
                <th 
                  key={index} 
                  className={`${styles.roundHeader} ${index + 1 === currentRound ? styles.currentRound : ''}`}
                >
                  Round {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playersWithTotals.map((player, playerIndex) => (
              <tr key={player.id || playerIndex} className={styles.playerRow}>
                <td className={styles.playerName}>
                  {player.name || `Player ${playerIndex + 1}`}
                </td>
                <td className={styles.totalScore}>
                  {player.totalScore}
                </td>
                {Array.from({ length: maxRounds }, (_, roundIndex) => (
                  <td 
                    key={roundIndex} 
                    className={`${styles.roundScore} ${roundIndex + 1 === currentRound ? styles.currentRoundCell : ''}`}
                  >
                    {player.rounds && player.rounds[roundIndex] !== undefined 
                      ? player.rounds[roundIndex] 
                      : '-'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreDisplay;