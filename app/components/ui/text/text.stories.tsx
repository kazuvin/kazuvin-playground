import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "./text";

const meta = {
  title: "UI/Text",
  component: Text,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    role: {
      control: "select",
      options: [
        "expression",
        "reading",
        "gloss",
        "body",
        "label",
        "support",
        "overline",
      ],
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {
  args: {
    role: "body",
    children:
      "Softer than 〜してください. Safe with people you have just met, and the usual opening in a work email.",
  },
};

/** The star of the screen. Never traded away for density — take the space
 *  out of the chrome instead. */
export const Expression: Story = {
  args: {
    role: "expression",
    lang: "ja",
    children: "お願いできますか",
  },
};

export const Reading: Story = {
  args: { role: "reading", children: "onegai dekimasu ka" },
};

export const Gloss: Story = {
  args: { role: "gloss", children: "Could I ask you a favour?" },
};

export const Support: Story = {
  args: { role: "support", children: "Tap the phrase to hear it again" },
};

export const Overline: Story = {
  args: { role: "overline", children: "Unit 4 · Requests" },
};

/** Content roles hold a 15px floor and are never shrunk to fit a layout;
 *  chrome roles are small on purpose. The gap between the two groups is the
 *  hierarchy. */
export const ContentVersusChrome: Story = {
  args: { children: "" },
  render: () => (
    <div className="gap-block flex max-w-[342px] flex-col">
      <div className="gap-gap flex flex-col">
        <Text role="overline">Content — 15px floor</Text>
        <Text role="expression" lang="ja">
          お願いできますか
        </Text>
        <Text role="reading">onegai dekimasu ka</Text>
        <Text role="gloss">Could I ask you a favour?</Text>
        <Text role="body">
          Softer than 〜してください. Safe with people you have just met.
        </Text>
      </div>
      <div className="gap-gap flex flex-col">
        <Text role="overline">Chrome — small on purpose</Text>
        <Text role="label">Show meaning</Text>
        <Text role="support">Tap the phrase to hear it again</Text>
      </div>
    </div>
  ),
};
