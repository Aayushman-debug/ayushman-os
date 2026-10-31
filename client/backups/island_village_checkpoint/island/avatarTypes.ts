/**
 * avatarTypes.ts — Roblox-Inspired Avatar Customization Types & Presets
 */

export type SkinTone =
  | '#fcd34d' // Classic Roblox Yellow
  | '#fed7aa' // Warm Fair
  | '#d97706' // Golden Bronze
  | '#78350f' // Deep Amber
  | '#6ee7b7' // Minty Neon
  | '#e0e7ff'; // Cloud Lilac

export type Hairstyle = 'parted' | 'spiky' | 'beanie' | 'cap' | 'clean';

export type HairColor =
  | '#3e2723' // Cocoa Brown
  | '#0f172a' // Midnight Black
  | '#fef08a' // Golden Blonde
  | '#dc2626' // Crimson Red
  | '#06b6d4' // Ocean Cyan
  | '#e2e8f0'; // Platinum Silver

export type FaceExpression = 'smile' | 'shades' | 'wink' | 'smirk' | 'chill';

export type TopOutfit = 'hoodie' | 'polo' | 'varsity' | 'tee' | 'suit';

export type BottomOutfit = 'navy' | 'jeans' | 'cargo' | 'shorts' | 'trackpants';

export type Accessory = 'none' | 'headphones' | 'backpack' | 'sword';

export interface AvatarConfig {
  skinTone: SkinTone;
  hairstyle: Hairstyle;
  hairColor: HairColor;
  face: FaceExpression;
  top: TopOutfit;
  topColor: string;
  bottom: BottomOutfit;
  bottomColor: string;
  accessory: Accessory;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#fcd34d',
  hairstyle: 'parted',
  hairColor: '#3e2723',
  face: 'smile',
  top: 'hoodie',
  topColor: '#0284c7', // Ocean Blue
  bottom: 'navy',
  bottomColor: '#1e3a8a', // Navy
  accessory: 'headphones',
};

export interface AvatarPreset {
  id: string;
  name: string;
  emoji: string;
  config: AvatarConfig;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'ayushman_classic',
    name: 'AYushMan Dev',
    emoji: '💻',
    config: {
      skinTone: '#fcd34d',
      hairstyle: 'parted',
      hairColor: '#3e2723',
      face: 'smile',
      top: 'hoodie',
      topColor: '#0284c7',
      bottom: 'navy',
      bottomColor: '#1e3a8a',
      accessory: 'headphones',
    },
  },
  {
    id: 'island_explorer',
    name: 'Island Explorer',
    emoji: '🌴',
    config: {
      skinTone: '#fed7aa',
      hairstyle: 'cap',
      hairColor: '#0f172a',
      face: 'shades',
      top: 'polo',
      topColor: '#f59e0b',
      bottom: 'shorts',
      bottomColor: '#78350f',
      accessory: 'backpack',
    },
  },
  {
    id: 'cool_gamer',
    name: 'Arcade Champion',
    emoji: '🎧',
    config: {
      skinTone: '#fcd34d',
      hairstyle: 'spiky',
      hairColor: '#06b6d4',
      face: 'wink',
      top: 'varsity',
      topColor: '#dc2626',
      bottom: 'jeans',
      bottomColor: '#1e40af',
      accessory: 'headphones',
    },
  },
  {
    id: 'island_ronin',
    name: 'Island Ronin',
    emoji: '⚔️',
    config: {
      skinTone: '#fed7aa',
      hairstyle: 'clean',
      hairColor: '#0f172a',
      face: 'smirk',
      top: 'tee',
      topColor: '#0f172a',
      bottom: 'cargo',
      bottomColor: '#334155',
      accessory: 'sword',
    },
  },
  {
    id: 'cozy_beanie',
    name: 'Chill Musician',
    emoji: '🎵',
    config: {
      skinTone: '#fcd34d',
      hairstyle: 'beanie',
      hairColor: '#dc2626',
      face: 'chill',
      top: 'hoodie',
      topColor: '#7c3aed',
      bottom: 'trackpants',
      bottomColor: '#f8fafc',
      accessory: 'headphones',
    },
  },
];
