export interface KeyboardShortcut {
    key: string;
    description: string;
    preventDefault?: boolean;
}

export interface KeyboardShortcutsConfig {
    addNode: KeyboardShortcut;
    deleteNode: KeyboardShortcut;
    // Add more shortcut configurations here as needed
}

export const keyboardShortcuts: KeyboardShortcutsConfig = {
    addNode: {
        key: 'Space',
        description: 'Add a new node at cursor position',
        preventDefault: true
    },
    deleteNode: {
        key: 'Backspace',
        description: 'Delete selected node(s)',
        preventDefault: true
    },
    // Add more shortcuts here as needed
};
