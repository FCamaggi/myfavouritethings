import { PlayedCard } from '../../../shared/types';

export const determineTrickWinner = (
  playedCards: PlayedCard[],
): { winnerId: string; reason: string } => {
  // Sort by play order to handle ties correctly (earliest player wins ties)
  const sortedByOrder = [...playedCards].sort((a, b) => a.order - b.order);

  const hasRank1 = playedCards.some((pc) => pc.card.rank === 1);
  const hasBrokenHeart = playedCards.some((pc) => pc.card.isBrokenHeart);

  // Special Rule: If 1 and Broken Heart are both played, Broken Heart wins.
  if (hasRank1 && hasBrokenHeart) {
    const winner = sortedByOrder.find((pc) => pc.card.isBrokenHeart);
    return {
      winnerId: winner!.playerId,
      reason: '¡El Corazón Roto 💔 derrota al Favorito #1!',
    };
  }

  // Normal Rule: Lowest rank wins.
  // We treat Broken Heart as Rank 100 (effectively highest number) for standard comparison
  let bestCard = sortedByOrder[0];
  let minRank = bestCard.card.rank;

  for (let i = 1; i < sortedByOrder.length; i++) {
    const current = sortedByOrder[i];
    const currentRank = current.card.rank;

    if (currentRank < minRank) {
      minRank = currentRank;
      bestCard = current;
    }
    // If equal, bestCard remains the earliest one (already sorted by order)
  }

  return {
    winnerId: bestCard.playerId,
    reason: bestCard.card.isBrokenHeart
      ? 'Gana el Corazón Roto (nadie jugó #1)'
      : `¡El ranking #${bestCard.card.rank} es el más bajo y gana!`,
  };
};
