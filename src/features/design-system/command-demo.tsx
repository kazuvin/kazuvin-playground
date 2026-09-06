import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

/*
 * Command も compound で、絞り込みの state を cmdk の Root が持つ。Dialog と同じ理由で
 * ひとまとまりの島にしてある。実際の使いどころは左レールのコマンドパレット。
 */
function CommandDemo() {
  return (
    <Command className="h-64">
      <CommandInput placeholder="絞り込む…" />
      <CommandList>
        <CommandEmpty>見つかりませんでした</CommandEmpty>
        <CommandGroup heading="Notes">
          <CommandItem>
            はじめてのノート
            <CommandShortcut>⏎</CommandShortcut>
          </CommandItem>
          <CommandItem>2 つ目のノート</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Playgrounds">
          <CommandItem>デザインシステム</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export { CommandDemo }
