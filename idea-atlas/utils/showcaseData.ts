import type { Nodes, Edges, Layouts } from "v-network-graph"

const nodes: Nodes = {
  node1: { name: "rocket", color: "#2ecc71", size: 20 },
  node2: { name: "fuel",color: "#2ecc71", size: 20  },
  node3: { name: "space", color: "#2ecc71", size: 20  },
  node4: { name: "stars", color: "#2ecc71", size: 20  },
  node5: { name: "planets", color: "#2ecc71", size: 20  },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2", color: "#2ecc71", with: 2 },
  edge2: { source: "node2", target: "node3", color: "#2ecc71", with: 2 },
  edge3: { source: "node3", target: "node4", color: "#2ecc71", with: 2 },
  edge4: { source: "node4", target: "node5", color: "#2ecc71", width: 2 },
}

const layouts: Layouts = {
  nodes: {
    node1: { x: 0, y: 0 },
    node2: { x: 80, y: 80 },
    node3: { x: 160, y: 0 },
    node4: { x: 240, y: 80 },
    node5: { x: 320, y: 0 },
  },
}

export default {
  nodes,
  edges,
  layouts,
}