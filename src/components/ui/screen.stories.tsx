import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Screen } from './screen'
import { Text } from './text'

const meta = {
  title: 'UI/Screen',
  component: Screen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Screen>

export default meta
type Story = StoryObj<typeof meta>

/** Screen owns tier-1 edge spacing (24 / 32 / 24). Children space themselves
 *  with tier 2 between blocks and tier 3 inside a block, and the action group
 *  is pushed to the thumb by a flexible spacer with a 48px minimum. */
export const PhraseStudy: Story = {
  args: {},
  render: () => (
    <Screen
      className="min-h-[720px] border border-border-hairline"
      style={{ justifyContent: 'flex-start' }}
    >
      <div className="flex items-baseline justify-between">
        <Text role="overline">Unit 4 · Requests</Text>
        <Text role="support">1 / 2</Text>
      </div>

      <div className="h-block" />

      <Text role="expression" lang="ja">
        お願いできますか
      </Text>

      <div className="h-gap" />
      <Text role="support">onegai dekimasu ka</Text>

      <div className="h-block-tight" />
      <Text role="gloss">Could I ask you a favour?</Text>

      <div className="h-block-tight" />
      <Text role="body">
        Softer than 〜してください. Safe with people you have just met, and the usual opening in a
        work email.
      </Text>

      <div className="min-h-block-loose flex-1" />

      <div className="flex flex-col gap-gap">
        <Button variant="primary" size="large" fullWidth>
          Got it
        </Button>
        <Button variant="secondary" size="large" fullWidth>
          Practice again
        </Button>
      </div>
    </Screen>
  ),
}
