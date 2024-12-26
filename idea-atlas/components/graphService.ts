import type { Nodes, Edges, Layouts } from "v-network-graph"

interface GraphData {
    nodes: { [key: string]: { name: string } }
    edges: { [key: string]: { source: string; target: string } }
    layouts: { nodes: { [key: string]: { x: number; y: number } } }
  }

export const saveGraph = async (graphName: string, graphData: GraphData) => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
  
    if (!user.value) {
      throw new Error('User is not authenticated')
    }
  
    try {
      // Step 1: Insert graph
      const { data: graph, error: graphError } = await supabase
        .from('graphs')
        .insert({
          user_id: user.value.id,
          name: graphName,
          created_at: new Date(),
        })
        .select('id')
        .single()
  
      if (graphError) throw graphError
  
      const graphId = graph.id
  
      // Step 2: Insert nodes
      const { error: nodesError } = await supabase
        .from('nodes')
        .insert(
          Object.keys(graphData.nodes).map((key) => ({
            id: key,
            graph_id: graphId,
            name: graphData.nodes[key].name,
          }))
        )
      if (nodesError) throw nodesError
  
      // Step 3: Insert edges
      const { error: edgesError } = await supabase
        .from('edges')
        .insert(
          Object.keys(graphData.edges).map((key) => ({
            id: key,
            graph_id: graphId,
            source: graphData.edges[key].source,
            target: graphData.edges[key].target,
          }))
        )
      if (edgesError) throw edgesError
  
      // Step 4: Insert layouts
      const { error: layoutsError } = await supabase
        .from('layouts')
        .insert(
          Object.keys(graphData.layouts.nodes).map((key) => ({
            id: key,
            graph_id: graphId,
            node_id: key,
            x: graphData.layouts.nodes[key].x,
            y: graphData.layouts.nodes[key].y,
          }))
        )
      if (layoutsError) throw layoutsError
  
      return { success: true, graphId }
    } catch (error) {
      console.error('Error saving graph:', error)
      throw error
    }
  }
  
  export const fetchGraphs = async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
  
    if (!user.value) {
      throw new Error('User is not authenticated')
    }
  
    try {
      const { data, error } = await supabase
        .from('graphs')
        .select('*')
        .eq('user_id', user.value.id)
  
      if (error) throw error
  
      return data
    } catch (error) {
      console.error('Error fetching graphs:', error)
      throw error
    }
  }