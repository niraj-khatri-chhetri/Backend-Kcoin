export const getDifficulty = (blockIndex) => {
  const BASE_DIFFICULTY = 2;

  const ADJUSTMENT_INTERVAL = 1;

  return BASE_DIFFICULTY + Math.floor(blockIndex / ADJUSTMENT_INTERVAL);
};
