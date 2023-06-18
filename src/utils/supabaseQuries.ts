import { supabase } from "../../config"

export async function fetchNotes(slug: string) {
    const {data} = await supabase.from('notes').select().eq('slug', slug)
    return data![0] ?? null
}