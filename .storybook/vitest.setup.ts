import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/react-vite'
// setProjectAnnotations は preview の export をまとめた名前空間オブジェクトを受け取る
// API で、Storybook 側が形を固定している
// biome-ignore lint/style/noRestrictedImports: Storybook の API が名前空間オブジェクトを要求する
import * as projectAnnotations from './preview'

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])
