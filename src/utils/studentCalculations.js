export function calculateAverage(scores) {
  if (!scores?.length) return 0

  const total = scores.reduce((sum, score) => sum + score, 0)
  return total / scores.length
}

export function hasPassed(scores) {
  return calculateAverage(scores) >= 75
}
