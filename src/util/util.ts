export const MAX_TREASURES = 6

export const getPath = (src: string) => {
  return '/taisei2' + src
}

export const saveTreasure = (treasureId: number) => {
  const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
  if (!savedTreasures.includes(treasureId)) {
    savedTreasures.push(treasureId)
    localStorage.setItem('treasures', JSON.stringify(savedTreasures))
  }
}

export const getSavedTreasures = () => {
  return JSON.parse(localStorage.getItem('treasures') || '[]')
}

const DEFAULT_RARITY_RANGES = [
  { min: 1, max: 20, rarity: 1 },
  { min: 21, max: 40, rarity: 2 },
  { min: 41, max: 60, rarity: 3 },
  { min: 61, max: 80, rarity: 4 },
  { min: 81, max: 95, rarity: 5 },
  { min: 96, max: 100, rarity: 6 },
]

export const getTreasureRarity = (treasureNumber: number): number => {
  if (treasureNumber < 1 || treasureNumber > 100) {
    throw new Error('Treasure number must be between 1 and 100')
  }

  const range = DEFAULT_RARITY_RANGES.find(
    (r) => treasureNumber >= r.min && treasureNumber <= r.max
  )

  return range ? range.rarity : 1
}

export const getTreasureLevel = (treasureNumber: number): number => {
  if (treasureNumber < 1 || treasureNumber > 6) {
    throw new Error('Treasure number must be between 1 and 6')
  }

  if (treasureNumber <= 2) return 1
  if (treasureNumber <= 4) return 2
  return 3
}
