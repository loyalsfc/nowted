export function createSlug(title: string):string{
    return title.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}