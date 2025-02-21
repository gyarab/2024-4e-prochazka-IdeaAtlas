import * as vNG from "v-network-graph";

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
      },
      edge: {
        selectable: true,
      },
    })
  );