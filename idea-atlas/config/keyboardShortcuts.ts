// this file contains the configuration for keyboard shortcuts used in the application

export interface KeyboardShortcut {
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

export const keyboardShortcuts: KeyboardShortcutsConfig = {
    addNode: {
        key: 'Enter',
        description: 'Add a new node at cursor position',
        preventDefault: true
    },
    deleteNode: {
        key: 'Backspace',
        description: 'Delete selected node(s)',
        preventDefault: false
    },
    addEdge: {
        key: 'Space',
        description: 'Add a new edge',
        preventDefault: true
    },
    editNode: {
        key: '',
        description: 'Rename selected node(s)',
        preventDefault: true
    },
    // Add more shortcuts here as needed
};
