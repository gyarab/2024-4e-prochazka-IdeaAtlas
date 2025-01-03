// this file contains the configuration for keyboard shortcuts used in the application

export interface KeyboardShortcut {
    code: string;
    key: string;
    description: string;
    preventDefault?: boolean;
}

export interface KeyboardShortcutsConfig {
    addNode: KeyboardShortcut;
    deleteSelected: KeyboardShortcut;
    addEdgeOneSource: KeyboardShortcut;
    addEdges: KeyboardShortcut;
    editNode: KeyboardShortcut;
    deselect: KeyboardShortcut;
    
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
    deleteSelected: {
        code: 'Backspace',
        key: 'Backspace',
        description: 'Delete selected node(s)',
        preventDefault: true
    },
    // This only activates with a ctrl key pressed as well
    addEdgeOneSource: {
        code: 'Space',
        key: ' ',
        description: 'Adds edges from the selected node to other nodes',
        preventDefault: true
    },
    addEdges: {
        code: 'Space',
        key: ' ',
        description: 'Adds edges between all selected nodes',
        preventDefault: true
    },
    // This only activates with a ctrl key pressed as well
    editNode: {
        code: 'Enter',
        key: 'Enter',
        description: 'Rename selected node(s)',
        preventDefault: true
    },
    deselect: {
        code: 'Escape',
        key: '',
        description: 'Deselect all selected nodes and edges',
        preventDefault: true
    },
    // Add more shortcuts here as needed
};
