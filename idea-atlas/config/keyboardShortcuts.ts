// this file contains the configuration for keyboard shortcuts used in the application

export interface KeyboardShortcut {
    code: string;
    description: string;
    preventDefault?: boolean;
}

export interface KeyboardShortcutsConfig {
    addNode: KeyboardShortcut;
    deleteNode: KeyboardShortcut;
    addEdge: KeyboardShortcut;
    editNode: KeyboardShortcut;
    // Add more shortcut configurations here as needed
}
// Why is here code instead of key?
// The code presents the physical key on the keyboard
// While the key presents actual character that is producet with pressing the physical key
// For example: code: 'Space', key: ' '
export const keyboardShortcuts: KeyboardShortcutsConfig = {
    addNode: {
        code: 'Enter',
        description: 'Add a new node at cursor position',
        preventDefault: true
    },
    deleteNode: {
        code: 'Backspace',
        description: 'Delete selected node(s)',
        preventDefault: true
    },
    addEdge: {
        code: 'Space',
        description: 'Add a new edge',
        preventDefault: true
    },
    editNode: {
        code: 'f2',
        description: 'Rename selected node(s)',
        preventDefault: true
    },
    // Add more shortcuts here as needed
};
