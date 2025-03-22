// this file contains the configuration for keyboard shortcuts used in the application

export interface KeyboardShortcut {
    code: string;
    key: string;
    description: string;
    preventDefault?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    preventWithShift?: boolean;
    special?: string;
}

export interface KeyboardShortcutsConfig {
    addNode: KeyboardShortcut;
    deleteSelected: KeyboardShortcut;
    addEdgeOneSource: KeyboardShortcut;
    addEdges: KeyboardShortcut;
    editNode: KeyboardShortcut;
    deselect: KeyboardShortcut;
    deleteEdgesFromSelectedNodes: KeyboardShortcut;
    undo: KeyboardShortcut;
    redo: KeyboardShortcut;
    wave: KeyboardShortcut;
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
        preventDefault: true,
        ctrlKey: false,
        shiftKey: false,
        special: 'double left click'
    },
    deleteSelected: {
        code: 'Backspace',
        key: 'Backspace',
        description: 'Delete selected node(s) or edge(s)',
        preventDefault: true,
        ctrlKey: false,
        shiftKey: false
    },
    // This only activates with a ctrl key pressed as well
    deleteEdgesFromSelectedNodes: {
        code: 'Backspace',
        key: 'Backspace',
        description: 'Delete edge(s) selected from selected node(s)',
        preventDefault: true,
        ctrlKey: true,
        shiftKey: false
    },
    addEdgeOneSource: {
        code: 'Space',
        key: ' ',
        description: 'Adds edges from the selected node to other nodes',
        preventDefault: true,
        ctrlKey: false,
        shiftKey: false
    },
    // This only activates with a ctrl key pressed as well
    addEdges: {
        code: 'Space',
        key: ' ',
        description: 'Adds edges between all selected nodes',
        preventDefault: true,
        ctrlKey: true,
        shiftKey: false
    },
    // This only activates with a ctrl key pressed as well
    editNode: {
        code: 'Enter',
        key: 'Enter',
        description: 'Rename selected node(s)',
        preventDefault: true,
        ctrlKey: true,
        shiftKey: false,
        special: 'double left click'
    },
    deselect: {
        code: 'Escape',
        key: 'Esc',
        description: 'Deselect all selected nodes and edges',
        preventDefault: true,
        ctrlKey: false,
        shiftKey: false
    },
    // This only activates with a ctrl key pressed as well
    undo: {
        code: 'KeyZ',
        key: 'z',
        description: 'Undo the last action',
        preventDefault: true,
        ctrlKey: true,
        shiftKey: false,
        preventWithShift: true
    },
    // This only activates with a ctrl key and shift key pressed as well
    redo: {
        code: 'KeyZ',
        key: 'z',
        description: 'Redo the last undone action',
        preventDefault: true,
        ctrlKey: true,
        shiftKey: true,
    },
    // Add more shortcuts here as needed
    wave: {
        code: 'KeyW',
        key: 'w',
        description: 'Wave selecet nodes',
        preventDefault: true,
        shiftKey: false
    },
};
