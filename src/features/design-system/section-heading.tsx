import { Text } from '@/components/ui/text'
import { findCatalogSection } from './catalog'

/*
 * 文言と段は catalog.ts が持ち、ページは id しか書かない (無い id はビルドが落ちる)。
 * scroll-mt は .note-content の見出しと同じ値。lg 未満は左ナビが横バーとして上に被る。
 */
interface SectionHeadingProps {
  id: string
}

export function SectionHeading({ id }: SectionHeadingProps) {
  const section = findCatalogSection(id)
  const isSection = section.depth === 2

  return (
    <Text
      role={isSection ? 'heading' : 'subheading'}
      as={isSection ? 'h2' : 'h3'}
      id={section.id}
      className="scroll-mt-24 lg:scroll-mt-8"
    >
      {section.title}
    </Text>
  )
}
