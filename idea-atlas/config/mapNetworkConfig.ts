import * as vNG from "v-network-graph";
import {
  ForceLayout,
  type ForceNodeDatum,
  type ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import {
  FORCE_LINK_DISTANCE,
  FORCE_LINK_STRENGTH,
  FORCE_CHARGE_STRENGTH,
  FORCE_CENTER_STRENGTH,
  FORCE_ALPHA_MIN
} from "./constants";

// Helper function to convert color to rgba with opacity
const convertToRGBA = (color: string, opacity: number = 0.5): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// Helper function to calculate font size with minimum of 12px
const calculateFontSize = (nodeSize: number): number => {
  const calculatedSize = nodeSize * 0.75;
  return Math.max(12, calculatedSize);
};

export const ForceConfig = new ForceLayout({
  positionFixedByDrag: false,        // Nodes continue simulation after being dragged
  positionFixedByClickWithAltKey: true,  // Alt+Click fixes node position
  createSimulation: (d3, nodes, edges) => {
    // Create links between nodes with specified parameters
    const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges)
      .id((d: { id: any; }) => d.id)  // Use node's id property to establish connections
    
    return d3
      .forceSimulation(nodes)
      // Edge force: maintains distance between connected nodes
      .force("edge", forceLink.distance(FORCE_LINK_DISTANCE).strength(FORCE_LINK_STRENGTH))
      // Charge force: makes nodes repel each other
      .force("charge", d3.forceManyBody().strength(FORCE_CHARGE_STRENGTH))
      // Center force: pulls nodes toward canvas center
      .force("center", d3.forceCenter().strength(FORCE_CENTER_STRENGTH))
      .alphaMin(FORCE_ALPHA_MIN)  // Minimum energy level before simulation stops
  }
});


export const GridConfig = new vNG.GridLayout({ grid: 10 });
export const mainConfig = reactive(
  vNG.defineConfigs({
    view: {
      boxSelectionEnabled: true,
      selection: {
        box: {
          color: "#0000ff20",
          strokeWidth: 1,
          strokeColor: "#aaaaff",
          strokeDasharray: "0",
        },
      },
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "#e0e0e0",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "#cccccc",
          width: 1,
          dasharray: 0,
        },
      },
      layoutHandler: new vNG.GridLayout({ grid: 10 }),
      scalingObjects: true,
      minZoomLevel: 0.1,
      maxZoomLevel: 16,
      doubleClickZoomEnabled: false,
    },
    node: {
      normal: {
        type: "circle",
        radius: node => node.size, // Use the value of each node object
        color: node => node.color,
      },
      hover: {
        radius: node => node.size + 4,
        color: node => node.color,
      },
      selectable: true,
      label: {
        visible: true,
        fontFamily: undefined,
        fontSize: node => calculateFontSize(node.size),
        lineHeight: 1.1,
        color: "#000000",
        margin: 4,
        direction: "south",
        directionAutoAdjustment: true,
        background: {
          visible: false,
          color: "#ffffff",
          padding: {
            vertical: 1,
            horizontal: 4,
          },
          borderRadius: 2,
        },
      },
    },
    edge: {
      selectable: true,
      normal: {
        width: edge => edge.width, // Use the value of each edge object
        color: edge => convertToRGBA(edge.color),
      },
      hover: {
        width: edge => edge.width,
        color: edge => edge.color, // Use original color without transparency
      },
      selected: {
        width: edge => edge.width * 1.5, // Increase width by 50% when selected
        color: edge => edge.color,
        dasharray: "6",  // Fixed dash pattern for selected edges
        animate: true,   // Always animate selected edges
      },
    },
  })
);