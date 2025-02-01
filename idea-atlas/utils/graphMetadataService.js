
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
                user_id: user.id
            }])
            .select();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error inserting new graph:', error);
        return null;
    }
}
// Upserts the bookmarked status of a graph
async function upsertBookMarked(supabase, graph_id, bookmarked) {
    try {
        const { data, error } = await supabase
            .from('graphs')
            .upsert(bookmarked)
            .eq('id', graph_id)
            .select();

        if (error) { 
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error updating bookmarked:', error);
        return null;
    }
}
export { fetchGraphMDataBasedOnUsr, insertNewGraph, upsertBookMarked };