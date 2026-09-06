import type { Preview } from '@storybook/react-vite'

/* Storybook はアプリのレイアウトを描画しないので、フォントはここで読み込む。
   src/styles/fonts.ts と src/app/layout.tsx が読むのと同じ @fontsource-variable/* を使う。 */
import '@fontsource-variable/noto-sans-mono'
import '@fontsource-variable/noto-sans-jp'
import './fonts.css'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
