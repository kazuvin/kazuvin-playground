import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    size: {
      control: "select",
      options: ["default", "large"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Show meaning",
    variant: "primary",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Skip for now",
    variant: "secondary",
  },
};

export const Large: Story = {
  args: {
    children: "Got it",
    variant: "primary",
    size: "large",
  },
};

export const Selected: Story = {
  args: {
    children: "Formal register",
    variant: "secondary",
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Show meaning",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Show meaning",
    size: "large",
    fullWidth: true,
  },
  parameters: { layout: "padded" },
};

/** One primary per screen; everything else is secondary. There is no third
 *  variant — anything quieter than secondary is body text with a link. */
export const AllVariants: Story = {
  args: { children: "Show meaning" },
  render: () => (
    <div className="gap-gap flex">
      <Button variant="primary">Show meaning</Button>
      <Button variant="secondary">Skip for now</Button>
      <Button variant="secondary" selected>
        Formal register
      </Button>
      <Button disabled>Show meaning</Button>
    </div>
  ),
};

/** The box is 40 or 52. The 40 box pads its touchable out to the 44pt
 *  minimum, so both sizes clear the tap target with the same label size. */
export const AllSizes: Story = {
  args: { children: "Show meaning" },
  render: () => (
    <div className="gap-gap flex items-center">
      <Button size="default">Default 40</Button>
      <Button size="large">Large 52</Button>
    </div>
  ),
};

/** The action group: full-width, stacked, primary always above secondary. */
export const ActionGroup: Story = {
  args: { children: "Got it" },
  parameters: { layout: "padded" },
  render: () => (
    <div className="gap-gap flex w-[342px] flex-col">
      <Button variant="primary" size="large" fullWidth>
        Got it
      </Button>
      <Button variant="secondary" size="large" fullWidth>
        Practice again
      </Button>
    </div>
  ),
};
