// Constants used in the application.


// Constants for creating a new map
export const MAP_NAME_MAX_LENGTH = 50;
export const MAP_NAME_MIN_LENGTH = 3;
export const MAP_DESCRIPTION_MAX_LENGTH = 200;


// Nodes constants
export const NODE_DEFAULT_SIZE = 20;
export const NODE_MIN_SIZE = 10;
export const NODE_MAX_SIZE = 100;


// Edges constants
export const EDGE_DEFAULT_WIDTH = 2;
export const EDGE_NOTE_RATIO = 25;

// Wave constants
export const INITIAL_WAVE_SELECTION_DELAY = 600 // delay in ms before the first wave starts
export const NETXT_WAVE_MODIFIER = 0.75 // how much the delay is reduced for each wave
export const MIN_WAVE_DELAY = 100 // minimal delay of the wave in ms

export const AUTO_SAVE_DELAY = 2000 // delay in ms before the map is saved automatically

// Force layout constants
export const FORCE_LINK_DISTANCE = 250       // Target distance between linked nodes in pixels
export const FORCE_LINK_STRENGTH = 0.2       // How strongly linked nodes are pulled together (0-1)
export const FORCE_CHARGE_STRENGTH = -1000  // Repulsion force between nodes (negative = repel, positive = attract)
export const FORCE_CENTER_STRENGTH = 0.001   // How strongly nodes are pulled toward the center of the viewport
export const FORCE_ALPHA_MIN = 0.01         // Minimum energy threshold - simulation stops when reached

//Input and edit dialog dimensions (approximate)
export const DIALOG_HEIGHT = 300; // height of the dialog
export const DIALOG_WIDTH = 300;  // width of the dialog
export const PADDING = 100;       // minimum padding from screen edges