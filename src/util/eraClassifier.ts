/**
 * 時代判定ユーティリティ
 * 生年〜没年の期間から該当する時代を判定する
 */

// 時代定義（開始年と終了年）
export const ERA_DEFINITIONS = {
  kamakura: { name: "鎌倉時代", start: 1185, end: 1333 },
  kenmuRestoration: { name: "建武の新政", start: 1333, end: 1336 },
  muromachi: { name: "室町時代", start: 1336, end: 1573 },
  nanbokucho: { name: "南北朝時代", start: 1337, end: 1392 },
  sengoku: { name: "戦国時代", start: 1467, end: 1573 },
  azuchiMomoyama: { name: "安土桃山時代", start: 1573, end: 1603 },
  odaRegime: { name: "織田政権", start: 1573, end: 1585 },
  toyotomiRegime: { name: "豊臣政権", start: 1585, end: 1603 },
  edo: { name: "江戸時代", start: 1603, end: 1868 },
  sakoku: { name: "鎖国", start: 1639, end: 1854 },
  bakumatsu: { name: "幕末", start: 1853, end: 1868 },
  meiji: { name: "明治時代", start: 1868, end: 1912 },
  taisho: { name: "大正時代", start: 1912, end: 1926 },
  showa: { name: "昭和時代", start: 1926, end: 1989 },
  showaSenzen: { name: "戦前", start: 1926, end: 1945 },
  showaSengo: { name: "戦後", start: 1945, end: 1989 },
  heisei: { name: "平成時代", start: 1989, end: 2019 },
  reiwa: { name: "令和時代", start: 2019, end: 9999 },
} as const;

export type EraKey = keyof typeof ERA_DEFINITIONS;

export interface Era {
  key: EraKey;
  name: string;
  start: number;
  end: number;
}

export interface EraClassificationResult {
  eras: Era[];
  mainEras: Era[]; // 主要な時代（サブ時代を除く）
  subEras: Era[]; // サブ時代（政権や鎖国など）
}

// 主要な時代のキー（サブ時代を除く）
const MAIN_ERA_KEYS: EraKey[] = [
  "kamakura",
  "kenmuRestoration",
  "muromachi",
  "azuchiMomoyama",
  "edo",
  "meiji",
  "taisho",
  "showa",
  "heisei",
  "reiwa",
];

// サブ時代のキー（特定の期間や政権）
const SUB_ERA_KEYS: EraKey[] = [
  "nanbokucho",
  "sengoku",
  "odaRegime",
  "toyotomiRegime",
  "sakoku",
  "bakumatsu",
  "showaSenzen",
  "showaSengo",
];

/**
 * 指定された年の範囲が時代と重複しているかを判定
 */
function isOverlapping(
  birthYear: number,
  deathYear: number,
  eraStart: number,
  eraEnd: number
): boolean {
  return birthYear <= eraEnd && deathYear >= eraStart;
}

/**
 * 生年と没年から該当する時代を判定する
 * @param birthYears 生年の配列（複数人の場合は複数）
 * @param deathYears 没年の配列（複数人の場合は複数）
 * @returns 該当する時代の配列
 */
export function classifyEras(
  birthYears: number[],
  deathYears: number[]
): EraClassificationResult {
  // 最も早い生年と最も遅い没年を使用
  const earliestBirth = Math.min(...birthYears);
  const latestDeath = Math.max(...deathYears);

  const matchingEras: Era[] = [];

  for (const [key, era] of Object.entries(ERA_DEFINITIONS)) {
    if (isOverlapping(earliestBirth, latestDeath, era.start, era.end)) {
      matchingEras.push({
        key: key as EraKey,
        name: era.name,
        start: era.start,
        end: era.end,
      });
    }
  }

  // 主要な時代とサブ時代に分類
  const mainEras = matchingEras.filter((era) =>
    MAIN_ERA_KEYS.includes(era.key)
  );
  const subEras = matchingEras.filter((era) => SUB_ERA_KEYS.includes(era.key));

  return {
    eras: matchingEras,
    mainEras,
    subEras,
  };
}

/**
 * 時代名の配列を取得する
 */
export function getEraNames(result: EraClassificationResult): string[] {
  return result.eras.map((era) => era.name);
}

/**
 * 主要な時代名の配列を取得する
 */
export function getMainEraNames(result: EraClassificationResult): string[] {
  return result.mainEras.map((era) => era.name);
}

/**
 * 特定の時代に該当するかを判定する
 */
export function isInEra(
  birthYears: number[],
  deathYears: number[],
  eraKey: EraKey
): boolean {
  const era = ERA_DEFINITIONS[eraKey];
  const earliestBirth = Math.min(...birthYears);
  const latestDeath = Math.max(...deathYears);

  return isOverlapping(earliestBirth, latestDeath, era.start, era.end);
}

/**
 * 時代キーから時代情報を取得する
 */
export function getEraByKey(eraKey: EraKey): Era {
  const era = ERA_DEFINITIONS[eraKey];
  return {
    key: eraKey,
    name: era.name,
    start: era.start,
    end: era.end,
  };
}

/**
 * すべての時代を取得する
 */
export function getAllEras(): Era[] {
  return Object.entries(ERA_DEFINITIONS).map(([key, era]) => ({
    key: key as EraKey,
    name: era.name,
    start: era.start,
    end: era.end,
  }));
}

/**
 * 主要な時代のみを取得する
 */
export function getMainEras(): Era[] {
  return MAIN_ERA_KEYS.map((key) => getEraByKey(key));
}

/**
 * サブ時代のみを取得する
 */
export function getSubEras(): Era[] {
  return SUB_ERA_KEYS.map((key) => getEraByKey(key));
}

