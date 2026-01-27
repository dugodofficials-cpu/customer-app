export const ROUTES = {
  HOME: '/',
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  ERROR: {
    RATE_LIMIT: '/rate-limit',
  },
  ALBUM: {
    DETAILS: '/music/:id',
    TRACK: '/music/:id/track/:trackId',
  },
  MUSIC: '/music',
  SHOP: {
    HOME: '/shop',
    DETAILS: '/shop/:id',
  },
  GAME: {
    HOME: '/game',
    RULES: '/game/rules',
    CLUES: '/game/clues',
    OPEN_BOX: '/game/open-box',
  },
  USER: {
    HOME: '/home',
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT_FAILED: '/checkout/payment-failed',
  LEGAL: {
    TERMS: '/terms',
    PRIVACY: '/privacy',
  },
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const generatePath = (path: string, params: Record<string, string> = {}) => {
  return path.replace(/:(\w+)/g, (_, key) => params[key] || '');
};

export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  return currentPath.startsWith(routePath);
};
