import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../command";

const meta = {
  title: "UI/Command",
  component: Command,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <span>Profile</span>
            <CommandShortcut>P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Billing</span>
            <CommandShortcut>B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Settings</span>
            <CommandShortcut>S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithSearch: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const items = [
      { id: "calendar", label: "Calendar", keywords: ["schedule", "events"] },
      { id: "emoji", label: "Search Emoji", keywords: ["smile", "face"] },
      { id: "calculator", label: "Calculator", keywords: ["math", "numbers"] },
      { id: "profile", label: "Profile", keywords: ["user", "account"] },
      { id: "billing", label: "Billing", keywords: ["payment", "invoice"] },
      {
        id: "settings",
        label: "Settings",
        keywords: ["config", "preferences"],
      },
    ];

    const filteredItems = items.filter((item) => {
      const searchTerm = value.toLowerCase();
      return (
        item.label.toLowerCase().includes(searchTerm) ||
        item.keywords.some((keyword) => keyword.includes(searchTerm))
      );
    });

    return (
      <Command className="w-[450px] rounded-lg border shadow-md">
        <CommandInput
          placeholder="Type a command or search..."
          value={value}
          onValueChange={setValue}
        />
        <CommandList>
          {filteredItems.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {filteredItems.length > 0 && (
            <CommandGroup heading="Results">
              {filteredItems.map((item) => (
                <CommandItem key={item.id} value={item.id}>
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    );
  },
};

export const WithKeyboardShortcuts: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <span>New File</span>
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>New Window</span>
            <CommandShortcut>?N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Open File</span>
            <CommandShortcut>O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save</span>
            <CommandShortcut>S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const MultipleGroups: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Files">
          <CommandItem>
            <span>New File</span>
          </CommandItem>
          <CommandItem>
            <span>Open File</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>
            <span>Copy</span>
          </CommandItem>
          <CommandItem>
            <span>Paste</span>
          </CommandItem>
          <CommandItem>
            <span>Cut</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="View">
          <CommandItem>
            <span>Zoom In</span>
          </CommandItem>
          <CommandItem>
            <span>Zoom Out</span>
          </CommandItem>
          <CommandItem>
            <span>Reset Zoom</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Empty: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search for something that doesn't exist..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  ),
};
