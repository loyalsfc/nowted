import { useLoaderData, useParams } from "react-router-dom"
import { supabase } from "../../config"
import { useQuery } from "react-query"
import FolderList from "../components/folderList"
import { useCallback} from "react";

function Folders() {
  const userId = useLoaderData();
  const {id, slug} = useParams();
  const {data: notes, isLoading, refetch} = useQuery(['notes', id, slug], fetchFiles)
  const {data: folder, isLoading: isFolderLoading} = useQuery(['folder', id], fetchFolder)
  
  async function fetchFiles(){
    if(id == "favorites"){
      return queryDB("is_favorite", true)
    } else if(id === "archived"){
      const {data} = await supabase.from('notes')
        .select()
        .eq('user_id', userId)
        .eq('is_archived', true)
        .neq('is_trashed', true)
      return data
    } else if(id === "trash"){
      const {data} = await supabase.from('notes')
        .select()
        .eq('user_id', userId)
        .eq('is_trashed', true)
      return data
    } else{
      return queryDB('folder', id)
    }
  }
  
  async function fetchFolder(){
    if(id === "archived" || id === "trash" || id === "favorites"){
      return id;
    }
    const {data} = await supabase.from('folders').select().eq('id', id);
    return data![0]?.folder ?? null;
  }

  async function queryDB(filterKey: string, filterValue: string | undefined | boolean){
    const {data} = await supabase.from('notes')
      .select()
      .eq('user_id', userId)
      .eq(filterKey, filterValue)
      .neq('is_trashed', true)
      .neq('is_archived', true);
    return data;
  }

   useCallback(()=>{refetch()},[slug, id])

  return (
    <FolderList
      isFolderLoading={isFolderLoading}
      folder={folder}
      notes={notes}
      isLoading={isLoading}
      slug={slug}
      id={id}
    />
  )
}

export default Folders