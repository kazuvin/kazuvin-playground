declare module "*.mdx" {
  import { NoteMetadata } from "@/lib/notes";

  const MDXComponent: React.ComponentType;
  export const metadata: NoteMetadata;
  export default MDXComponent;
}
