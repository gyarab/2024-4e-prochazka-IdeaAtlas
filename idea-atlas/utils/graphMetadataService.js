
// Fetches all the metadata for all the graphs in the database
async function fetchGraphMDataBasedOnUsr(supabase) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
            .from('graphs')
            .select('id, name, created_at')
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

export { fetchGraphMDataBasedOnUsr };