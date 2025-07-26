import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';

const themeComponents = getThemeComponents();

export const useMDXComponents = (components?: Record<string, unknown>) => ({
  ...themeComponents,
  ...components,
});
