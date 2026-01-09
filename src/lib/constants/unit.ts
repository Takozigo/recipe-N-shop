import { z } from 'zod'

export const UNITS = {
  // =========================
  // WEIGHT
  // =========================
  g: {
    key: 'g',
    type: 'weight',
    factor: 1,
    label: { fr: 'g', en: 'g' },
  },
  kg: {
    key: 'kg',
    type: 'weight',
    factor: 1000,
    label: { fr: 'kg', en: 'kg' },
  },

  // =========================
  // VOLUME
  // =========================
  ml: {
    key: 'ml',
    type: 'volume',
    factor: 1,
    label: { fr: 'ml', en: 'ml' },
  },
  cl: {
    key: 'cl',
    type: 'volume',
    factor: 10,
    label: { fr: 'cl', en: 'cl' },
  },
  dl: {
    key: 'dl',
    type: 'volume',
    factor: 100,
    label: { fr: 'dl', en: 'dl' },
  },
  l: {
    key: 'l',
    type: 'volume',
    factor: 1000,
    label: { fr: 'l', en: 'l' },
  },

  // =========================
  // SPOONS (very common)
  // =========================
  tsp: {
    key: 'tsp',
    type: 'volume',
    factor: 5,
    label: { fr: 'c. à café', en: 'tsp' },
  },
  tbsp: {
    key: 'tbsp',
    type: 'volume',
    factor: 15,
    label: { fr: 'c. à soupe', en: 'tbsp' },
  },

  // =========================
  // COUNT / PIECES
  // =========================
  pcs: {
    key: 'pcs',
    type: 'count',
    label: { fr: 'pièce', en: 'piece' },
  },
  slice: {
    key: 'slice',
    type: 'count',
    label: { fr: 'tranche', en: 'slice' },
  },
  clove: {
    key: 'clove',
    type: 'count',
    label: { fr: 'gousse', en: 'clove' },
  },
  pinch: {
    key: 'pinch',
    type: 'approx',
    label: { fr: 'pincée', en: 'pinch' },
  },
  dash: {
    key: 'dash',
    type: 'approx',
    label: { fr: 'trait', en: 'dash' },
  },
  toTaste: {
    key: 'toTaste',
    type: 'special',
    label: { fr: 'au goût', en: 'to taste' },
  },
} as const

export type UnitKey = keyof typeof UNITS
export type UnitType = (typeof UNITS)[UnitKey]['type']

export const unitSchema = z.enum(Object.keys(UNITS) as [UnitKey])

export const UNITS_BY_TYPE = {
  weight: ['g', 'kg'],
  volume: ['ml', 'cl', 'dl', 'l', 'tsp', 'tbsp'],
  count: ['pcs', 'slice', 'clove'],
  approx: ['pinch', 'dash'],
  special: ['toTaste'],
}
