// this file contains the configuration for keyboard shortcuts used in the application

export interface KeyboardShortcut {
    code: string;
    key: string;
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
// What is code ?
// The code presents the physical key on the keyboard
// While the key presents actual character that is produced with pressing the physical key
// For example: code: 'Space', key: ' '
export const keyboardShortcuts: KeyboardShortcutsConfig = {
    addNode: {
        code: 'Enter',
        key: 'Enter',
        description: 'Add a new node at cursor position',
        preventDefault: true
    },
    deleteNode: {
        code: 'Backspace',
        key: 'Backspace',
        description: 'Delete selected node(s)',
        preventDefault: true
    },
    addEdge: {
        code: 'Space',
        key: ' ',
        description: 'Add a new edge',
        preventDefault: true
    },
    // This only activates with a ctrl key pressed as well
    editNode: {
        code: 'Enter',
        key: 'Enter',
        description: 'Rename selected node(s)',
        preventDefault: true
    },
    // Add more shortcuts here as needed
};
