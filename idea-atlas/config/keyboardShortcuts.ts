export interface KeyboardShortcut {
    key: string;
    description: string;
    preventDefault?: boolean;
}

export interface KeyboardShortcutsConfig {
    addNode: KeyboardShortcut;
    // Add more shortcut configurations here as needed
}

export const keyboardShortcuts: KeyboardShortcutsConfig = {
    addNode: {
        key: 'Space',
        description: 'Add a new node at cursor position',
        preventDefault: true
    },
    // Add more shortcuts here as needed
};
