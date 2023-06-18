import { useParams } from "react-router-dom"
import { supabase } from "../../config"
import { useQuery } from "react-query"
import FolderList from "../components/folderList"

function Folders() {
  const {id, slug} = useParams();
  const {data: notes, isLoading} = useQuery(['notes', id, slug], fetchFiles)
  const {data: folder, isLoading: isFolderLoading} = useQuery(['folder', id], fetchFolder)

  async function fetchFiles(){
    const {data} = await supabase.from('notes')
      .select()
      .eq('folder', id)
      .neq('is_trashed', true);
    return data;
  }

  async function fetchFolder(){
    const {data} = await supabase.from('folders').select().eq('id', id);
    return data![0]?.folder ?? null;
  }

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