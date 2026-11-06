import postcssGlobalData from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';

/**
 * Breakpoints nomeados (@custom-media) disponíveis em todo CSS,
 * inclusive nos <style> dos componentes Astro.
 */
export default {
  plugins: [postcssGlobalData({ files: ['src/styles/media.css'] }), postcssCustomMedia()],
};
