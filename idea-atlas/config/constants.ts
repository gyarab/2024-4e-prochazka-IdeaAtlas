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

// auto-layout constants
// Refined constants for more stable FORCE simulation
export const BASE_REPULSION = 50;     // Reduced base repulsion
export const BASE_MIN_DISTANCE = 300; // Increased minimum distance
export const ATTRACTION = 0.05;       // Reduced attraction
export const DAMPING = 0.7;          // Increased damping
export const MAX_FORCE = 10;         // Maximum force cap
export const MIN_FORCE = 0.01;       // Minimum force threshold