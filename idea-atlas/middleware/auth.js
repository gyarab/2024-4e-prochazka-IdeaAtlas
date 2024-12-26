export default defineNuxtRouteMiddleware((ctx) => {
    const user = useSupabaseUser();
    if (!user) {
        return redirect('/login');
    }
});