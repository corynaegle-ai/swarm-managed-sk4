import React from 'react';
import styles from './ScoreDisplay.module.css';

const ScoreDisplay = ({ 
  players = [], 
  rounds = [], 
  currentRound = 0,
  scores = {} 
}) => {
  // Calculate total scores and sort players by total score (highest first)
  const playersWithTotals = players.map(player => {
    const playerScores = scores[player.id] || {};
    const totalScore = rounds.reduce((sum, round, index) => {
      return sum + (playerScores[index] || 0);
    }, 0);
    
    return {
      ...player,
      totalScore,
      roundScores: rounds.map((_, index) => playerScores[index] || 0)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  if (players.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No players added yet</p>
      </div>
    );
  }

  return (
    <div className={styles.scoreDisplay}>
      <div className={styles.tableContainer}>
        <table className={styles.scoreTable}>
          <thead>
            <tr>
              <th className={styles.playerHeader}>Player</th>
              <th className={styles.totalHeader}>Total</th>
              {rounds.map((round, index) => (
                <th 
                  key={index} 
                  className={`${styles.roundHeader} ${
                    index === currentRound ? styles.currentRound : ''
                  }`}
                >
                  Round {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playersWithTotals.map((player, playerIndex) => (
              <tr key={player.id} className={styles.playerRow}>
                <td className={styles.playerName}>
                  <div className={styles.playerInfo}>
                    <span className={styles.rank}>#{playerIndex + 1}</span>
                    <span className={styles.name}>{player.name}</span>
                  </div>
                </td>
                <td className={styles.totalScore}>
                  {player.totalScore}
                </td>
                {player.roundScores.map((score, roundIndex) => (
                  <td 
                    key={roundIndex} 
                    className={`${styles.roundScore} ${
                      roundIndex === currentRound ? styles.currentRound : ''
                    }`}
                  >
                    {score}
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