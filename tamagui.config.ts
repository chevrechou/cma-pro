import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      primary: '#1B4F72',
      accent: '#2E86C1',
      gold: '#D4AC0D',
      surface: '#F4F6F8',
      muted: '#7F8C8D',
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
