import type { Nodes, Edges, Layouts } from "v-network-graph"

const nodes: Nodes = {
  node1: { name: "Idea-Atlas", color: "#2c3e50", size: 100 },
  node2: { name: "Nuxt",color: "#2ecc71", size: 50  },
  node3: { name: "Vue", color: "#2ecc71", size: 30  },
  node4: { name: "Java Script", color: "#f1c40f", size: 30  },
  node5: { name: "Type Script", color: "#3498db", size: 30  },
  node6: { name: "Supabase", color: "#2ecc71", size: 50  },
  node7: { name: "Brainstorming", color: "#1abc9c", size: 75  },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2", color: "#2c3e50", width: 8 },
  edge2: { source: "node2", target: "node3", color: "#2ecc71", width: 4 },
  edge3: { source: "node4", target: "node2", color: "#2ecc71", width: 4 },
  edge4: { source: "node5", target: "node2", color: "#2ecc71", width: 4 },
  edge6: { source: "node1", target: "node6", color: "#2c3e50", width: 8 },
  edge7: { source: "node7", target: "node1", color: "#2c3e50", width: 8 },
}

const layouts: Layouts = {
  nodes: {
    node1: { x: 200, y: 40 },
    node2: { x: -110, y: 80 },
    node3: { x: -410, y: 160 },
    node4: { x: -310, y: -160 },
    node5: { x: -400, y: 0 },
    node6: { x: 400, y: -150},
    node7: { x: 600, y: 120 },
  },
}

export default {
  nodes,
  edges,
  layouts,
}