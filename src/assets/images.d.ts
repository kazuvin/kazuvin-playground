/* 画像の静的 import に型を与える。同じ宣言は next-env.d.ts にも入るが、
   あれは .gitignore 済みでビルドしないと生えないので、CI の typecheck には届かない。 */
/// <reference types="next/image-types/global" />
