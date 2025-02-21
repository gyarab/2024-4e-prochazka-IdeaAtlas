// Fetches all the metadata for all the graphs in the database
async function fetchGraphMDataBasedOnUsr(supabase) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
            .from('graphs')
            .select('id, name, created_at, updated_at, bookmarked, description')
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching graph metadata:', error);
        return [];
    }
}
// Inserts a new graph into the database
async function insertNewGraph(supabase, metadata) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('graphs')
            .insert([{
                name: metadata.name,
                description: metadata.description,
                user_id: user.id,
                bookmarked: false
            }])
            .select('*')  // Select all fields of the newly created graph
            .single();    // Get single result

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error inserting new graph:', error);
        return null;
    }
}
// Updates the bookmarked status of a graph in the database
async function updateBookMarked(supabase, graph) {
    const { error } = await supabase
        .from('graphs')
        .update({ bookmarked: graph.bookmarked })
        .eq('id', graph.id);

    if (error) {
        console.error('Error updating bookmarked:', error);
    }
}

// Deletes a graph from the database
async function deleteGraph(supabase, graphId) {
    try {
        const { error } = await supabase
            .from('graphs')
            .delete()
            .eq('id', graphId);

        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error deleting graph:', error);
        return false;
    }
}
// Updates description and the name of a graph in the database
async function updateGraphMetadata(supabase, graphData) {
    try {
        const { error } = await supabase
            .from('graphs')
            .update({
                name: graphData.name,
                description: graphData.description,
                // Hope it is the correct date format
                updated_at: new Date().toISOString()
            })
            .eq('id', graphData.id);

        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error updating graph metadata:', error);
        return false;
    }
}

export { fetchGraphMDataBasedOnUsr, insertNewGraph, updateBookMarked, deleteGraph, updateGraphMetadata };