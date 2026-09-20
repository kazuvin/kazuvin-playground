import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

/* Kotoba にステータス色は無いので、info と error で面も文字色も変わらない。
   違うのは読み上げの強さ (type) と表示時間だけ。 */
export const Default: Story = {
  render: () => (
    <ToastProvider swipeDirection="right">
      <Toast open duration={Infinity} className="relative">
        <div className="min-w-0 flex-1">
          <ToastTitle>リンクをコピーしました</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <ToastProvider swipeDirection="right">
      <Toast open duration={Infinity} type="foreground" className="relative">
        <div className="min-w-0 flex-1">
          <ToastTitle>検索を読み込めませんでした</ToastTitle>
          <ToastDescription>通信を確かめて、開き直してください</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
}

export const Stacked: Story = {
  render: function Stacked() {
    const [count, setCount] = useState(2)

    return (
      <ToastProvider swipeDirection="right">
        <button
          type="button"
          onClick={() => {
            setCount((previous) => previous + 1)
          }}
          className="rounded-control border border-input px-inset-x py-inset-y text-sm"
        >
          積む
        </button>
        {Array.from({ length: count }, (_, index) => (
          <Toast key={index} open duration={Infinity}>
            <div className="min-w-0 flex-1">
              <ToastTitle>{index + 1} つ目の通知</ToastTitle>
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    )
  },
}
