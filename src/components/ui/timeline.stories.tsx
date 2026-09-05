import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from './timeline'

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Timeline>
      <TimelineItem>
        <TimelineHeader>
          <TimelineIndicator>
            <TimelineDot isCompleted />
          </TimelineIndicator>
          <TimelineTitle>8月</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineBody>
            <div className="space-y-2">
              <div className="rounded-md bg-muted p-3">
                <code className="text-xs">
                  git init && git commit -m &quot;Initial commit&quot;
                </code>
              </div>
              <p className="text-muted-foreground text-xs">Branch: main • Commit: a1b2c3d</p>
            </div>
          </TimelineBody>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeader>
          <TimelineIndicator>
            <TimelineDot isCompleted />
          </TimelineIndicator>
          <TimelineTitle>7月</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineBody>
            <div className="space-y-1 text-muted-foreground text-xs">
              <p>✓ React 18.2.0</p>
              <p>✓ TypeScript 5.0.0</p>
              <p>✓ Tailwind CSS 3.3.0</p>
            </div>
          </TimelineBody>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeader>
          <TimelineIndicator>
            <TimelineDot isCompleted />
          </TimelineIndicator>
          <TimelineTitle>6月</TimelineTitle>
        </TimelineHeader>
      </TimelineItem>
    </Timeline>
  ),
}
