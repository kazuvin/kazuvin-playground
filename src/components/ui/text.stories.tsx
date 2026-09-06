import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './text'

const meta = {
  title: 'UI/Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['title', 'heading', 'subheading', 'body', 'lead', 'caption', 'label', 'overline'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Body: Story = {
  args: {
    role: 'body',
    children:
      '基準は 0.875rem (14px)。スケールの上限でもあるので、これより大きい文字はシステムの中に無い。',
  },
}

export const Title: Story = {
  args: { role: 'title', children: 'Typography' },
}

export const Heading: Story = {
  args: { role: 'heading', children: 'スケールと role' },
}

export const Lead: Story = {
  args: {
    role: 'lead',
    children: '本文と同じ大きさのまま、色だけを 1 段落として主題ではないことを示す。',
  },
}

export const Caption: Story = {
  args: { role: 'caption', children: '2026-09-06 · 更新から 3 日' },
}

export const Overline: Story = {
  args: { role: 'overline', children: 'Design system' },
}

/** 見出し 3 段と本文 2 段は**すべて同じ 0.875rem**。段を作っているのは
 *  太さと色だけで、サイズは一度も動かない。サイズが落ちるのは、本文ではない
 *  メタデータ (caption / label / overline) に入ってからだけ。 */
export const Hierarchy: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex max-w-[420px] flex-col gap-block">
      <div className="flex flex-col gap-gap">
        <Text role="overline">14px で並ぶ 5 つ</Text>
        <Text role="title">title — 700</Text>
        <Text role="heading">heading — 600</Text>
        <Text role="subheading">subheading — 600 + 弱い色</Text>
        <Text role="body">body — 400。基準であり上限。</Text>
        <Text role="lead">lead — 400 + 弱い色</Text>
      </div>
      <div className="flex flex-col gap-gap">
        <Text role="overline">ここから下がメタデータ</Text>
        <Text role="caption">caption — 13px / 400</Text>
        <Text role="label">label — 12px / 500</Text>
        <Text role="overline">overline — 11px / 600</Text>
      </div>
    </div>
  ),
}

/** スケールそのものの見本。4 段しかなく、上に伸びる段は持たない。
 *  text-mark (32px) は文字組みの外側で、絵文字や数字を絵として置くとき専用。 */
export const Scale: Story = {
  args: { children: '' },
  render: () => (
    <table className="w-full max-w-[520px] border-collapse text-left">
      <thead>
        <tr className="border-border-hairline border-b">
          {['key', 'rem', 'px', 'sample'].map((head) => (
            <th key={head} className="py-gap pr-block">
              <Text role="overline" as="span">
                {head}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { key: 'text-2xs', rem: '0.6875rem', px: '11', cls: 'text-2xs' },
          { key: 'text-xs', rem: '0.75rem', px: '12', cls: 'text-xs' },
          { key: 'text-sm', rem: '0.8125rem', px: '13', cls: 'text-sm' },
          { key: 'text-base', rem: '0.875rem', px: '14', cls: 'text-base' },
          { key: 'text-mark', rem: '2rem', px: '32', cls: 'text-mark' },
        ].map((step) => (
          <tr key={step.key} className="border-border-hairline border-b">
            <td className="py-gap pr-block">
              <Text role="label" as="span">
                {step.key}
              </Text>
            </td>
            <td className="py-gap pr-block">
              <Text role="caption" as="span">
                {step.rem}
              </Text>
            </td>
            <td className="py-gap pr-block">
              <Text role="caption" as="span">
                {step.px}
              </Text>
            </td>
            <td className={`py-gap ${step.cls}`}>Ag 和字</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
