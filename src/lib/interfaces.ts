export interface INotes {
    id: number;
    title: string; 
    notes: string; 
    folder: Number;
    slug: string;
    is_favorite: boolean;
    is_trashed: boolean;
    is_archived: boolean;
    user_id: string | unknown
}

export interface INotesDisplay {
    id: number;
    created_at: string;
    title: string; 
    notes: string; 
    folder: Number;
    slug: string;
    note_id: number;
    is_favorite: boolean;
    is_trashed: boolean;
    is_archived: boolean;
}
