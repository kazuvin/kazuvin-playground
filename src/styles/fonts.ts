import localFont from 'next/font/local'

/* 欧文だけをここから出す。和文との配信経路の違いと latin サブセットに絞る理由は
   docs/kotoba-design-system.md。 */
export const notoSansMono = localFont({
  src: '../../node_modules/@fontsource-variable/noto-sans-mono/files/noto-sans-mono-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  /* next/font のオプションはビルド時に静的に読まれるので、定数に切り出せない */
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    },
  ],
  /* Arial 由来の代替を挟ませない。1ch が変わると app-sidebar の下限幅がずれる */
  adjustFontFallback: false,
  /* Fontsource の可変フォントは "… Variable" という別名で登録される (静的版とは別名) */
  fallback: ['Noto Sans JP Variable', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  /* globals.css の --font-sans / --font-mono がこの名前を参照する */
  variable: '--font-noto-sans-mono',
})
