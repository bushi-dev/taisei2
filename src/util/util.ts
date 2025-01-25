export const MAX_TREASURES = 100

export const getPath = (src: string) => {
  return '/taisei2' + src
}

export const saveTreasure = (treasureId: number) => {
  console.log('クリア処理')
  localStorage.setItem('lastTreasureNumber', treasureId.toString())
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
  { min: 1, max: 1, rarity: 6 },
  { min: 2, max: 10, rarity: 5 },
  { min: 11, max: 20, rarity: 2 },
  { min: 21, max: 30, rarity: 4 },
  { min: 31, max: 40, rarity: 1 },
  { min: 41, max: 50, rarity: 2 },
  { min: 51, max: 60, rarity: 3 },
  { min: 61, max: 70, rarity: 1 },
  { min: 71, max: 80, rarity: 2 },
  { min: 81, max: 90, rarity: 1 },
  { min: 91, max: 100, rarity: 3 },
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
