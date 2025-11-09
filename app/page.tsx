import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineIndicator,
  TimelineHeader,
  TimelineTitle,
  TimelineContent,
  TimelineSeparator,
  TimelineBody,
} from "@/app/components/ui";

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-1 leading-7">
        <p className="animate-fade-slide-up animation-forwards opacity-0">
          Hello, my name is Kazuvin.
        </p>
        <p className="animate-fade-slide-up animation-delay-200 animation-forwards opacity-0">
          This is my playground for experimenting with new web technologies
        </p>
        <p className="animate-fade-slide-up animation-delay-400 animation-forwards opacity-0">
          Please take a look around and enjoy your stay!
        </p>
      </div>

      <section className="animate-fade-slide-up animation-delay-600 animation-forwards opacity-0">
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
                  <div className="bg-muted rounded-md p-3">
                    <code className="text-xs">
                      git init && git commit -m &quot;Initial commit&quot;
                    </code>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Branch: main • Commit: a1b2c3d
                  </p>
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
                <div className="text-muted-foreground space-y-1 text-xs">
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
            <TimelineContent>
              <TimelineSeparator>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineBody>
                <div className="text-muted-foreground space-y-1 text-xs">
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
              <TimelineTitle>5月</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineSeparator>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineBody>
                <div className="text-muted-foreground space-y-1 text-xs">
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
              <TimelineTitle>4月</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineSeparator>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineBody>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>✓ React 18.2.0</p>
                  <p>✓ TypeScript 5.0.0</p>
                  <p>✓ Tailwind CSS 3.3.0</p>
                </div>
              </TimelineBody>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>
    </div>
  );
}
