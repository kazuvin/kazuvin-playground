import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="border-border bg-background col-span-3 rounded-md border px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="username"
              className="text-right text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="border-border bg-background col-span-3 rounded-md border px-3 py-2"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
          >
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
          Open Controlled Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogDescription>
              This dialog is controlled by React state.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Click the close button or outside the dialog to close it.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="border-border hover:bg-accent rounded-md border px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const CustomWidth: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
        Open Wide Dialog
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Wide Dialog</DialogTitle>
          <DialogDescription>
            This dialog has a custom max-width applied.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            You can customize the dialog width by passing className to
            DialogContent.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
        Open Scrollable Dialog
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </div>
        <DialogFooter>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
            Accept
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
        Create Account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>
            Enter your information to create a new account.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="••••••••"
              className="border-border bg-background w-full rounded-md border px-3 py-2"
            />
          </div>
        </form>
        <DialogFooter>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
          >
            Create Account
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlertDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 transition-colors">
        Delete Account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button className="border-border hover:bg-accent rounded-md border px-4 py-2 transition-colors">
            Cancel
          </button>
          <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 transition-colors">
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
