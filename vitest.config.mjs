import { defineConfig } from 'vitest/config';

// Unit tests cover the pure JS layers (utils, services). They run in Node, so
// nothing here pulls in React Native. Metro-style image requires
// (`require('./logo.png')`) are stubbed out, since Node can't load them.
const stubImageRequires = {
  name: 'stub-image-requires',
  transform(code, id) {
    if (id.includes('node_modules') || !/\.[jt]sx?$/.test(id)) return null;
    const out = code.replace(/require\(\s*['"][^'"]+\.(png|jpe?g|gif|webp)['"]\s*\)/g, 'null');
    return out === code ? null : { code: out, map: null };
  },
};

export default defineConfig({
  plugins: [stubImageRequires],
  test: {
    include: ['__tests__/**/*.test.js'],
    environment: 'node',
  },
});
