/* app-header は .astro のため barrel には載せない (型が解決できないため)。
   利用側は @/components/shared/app-header/app-header.astro を直接 import する。 */
export * from "./page-header";
