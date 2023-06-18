import { useState, useEffect, useRef } from 'react'
import { Section } from './styling/styles'
import { styled } from 'styled-components'
import { Archived, Calender, Ellipsis, Favorites, FavoritesFilled, Folder, RedTrash, Trash } from './styling/icons'
import ReactQuill from 'react-quill'
import {useQuery} from 'react-query'
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../config'
import { createSlug } from '../utils/utils'
import { useNavigate } from 'react-router-dom'
import EmptyPage from './empty'


const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
`
const TitleBox = styled.input`
    background-color: transparent;
    border: none;
    flex: 1;
    font-weight: 600;
    font-size: 1.50rem;
    line-height: 2rem;
    color: #FFFFFF;
`
const Options = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    opacity: 0.4;
    border: 1px solid #FFFFFF;
    border-radius: 50%;
    background-color: transparent;
`
const EditorHeading = styled.div`
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 1.25rem;

    && p{
        width: 15%;
    }
`
const Whitetext = styled.span`
    color: #FFF;
    text-decoration: underline;
`

const Modal = styled.div`
    position: absolute;
    right: 0;
    background: #333333;
    border-radius: 6px;
    width: 202px;
    padding: 15px;
    top: 120%;

    && li{
        margin-bottom: 1.25rem;
        display: flex;
        align-items: center;
        gap: 15px;
        cursor: pointer;
    }
    li:last-child{
        margin-bottom: 0;
        padding-top: 1.25rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
`

const ConfirmModal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 90%;
    max-width: 400px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background-color: rgba(24, 24, 24, 1);
    z-index:10;
    color: #FFF;
    text-align: center;
    padding: 1.5rem;

    && h5{
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
    }

    && div{
        display: flex;
        justify-content: center;
        gap: 0.75rem;
    }

    && button {
        color: #FFF;
        padding: 0.5rem 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    && button:first-child {
        background-color: rgba(255, 255, 255, 0.3)
    }
`

const  modules  = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        [{ script:  "sub" }, { script:  "super" }],
        [{ list:  "ordered" }, { list:  "bullet" }],
        [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
        ["link", "image"],
        ['table']
    ],
};

function Editor({slug}: {slug:string;}) {
    const {data: note, isLoading, refetch} = useQuery(['notes', slug], fetchNotes);
    
    const [value, setValue] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const modalRef = useRef(null);
    const buttonRef = useRef(null)
    const navigate = useNavigate()
    
    useEffect(()=>{
        setValue(note?.notes);
        setTitle(note?.title);
    },[note])

    useEffect(()=>{
        const handleOutsideClick = (event: MouseEvent) => {
            if(modalRef.current && !modalRef.current.contains(event.target) && !buttonRef.current.contains(event.target)){
                setShowModal(false)
            }
        }

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        }
    },[])
    
    async function fetchNotes() {
        const {data} = await supabase.from('notes').select(`*, folders(folder)`).eq('slug', slug);
        return data![0] ?? null
    }
    
    if(isLoading){
        return <EmptyPage />
    }

    const {created_at, folder, folders, is_archived, is_trashed, is_favorite, note_id} = note
    console.log(note)
    const updateNote = async(updateItem: {}) => {
        const {data, error} = await supabase.from('notes').update(updateItem).eq('slug', slug);
        refetch();
        console.log(data, error)
    }

    const updateTitle = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        if(newTitle === title) return;
        const newSlug = createSlug(newTitle)
        const {data, error} = await supabase.from('notes')
            .update({title: newTitle, slug: newSlug})
            .eq('slug', slug);
        console.log(data, error)
        navigate(`/${folder}/${newSlug}`);
    }

    const trashItem = async(): Promise<void> =>{
        updateNote({is_trashed: true})
        navigate(`/${folder}`);
    }

    const restoreTrash = () => {
        updateNote({is_trashed: false})
        setShowModal(false);
        navigate(`/${folder}/${slug}`);
    }

    const deleteNote = async() => {
        await supabase.from('notes').delete().eq('note_id', note_id);
        navigate(`/trash`);
    }

    const archived = () => {
        if(is_archived){
            updateNote({is_archived: false});
            navigate(`/${folder}/${slug}`);
            return;
        }
        updateNote({is_archived: true});
        navigate(`/${folder}`);
        return;
    }

    return (
    <>
       {showDeleteModal && <ConfirmModal>
            <h5>Delete Permanently?</h5>
            <div>
                <button onClick={deleteNote}>Yes</button>
                <button onClick={()=>setShowDeleteModal(false)}>No</button>
            </div>
        </ConfirmModal>}
        <Section>
            <Header>
                <TitleBox disabled={is_trashed ? true : false} defaultValue={title} onBlur={updateTitle}/>
                <Options ref={buttonRef} onClick={()=>setShowModal(!showModal)}>
                    <Ellipsis />
                </Options>
                {showModal && <Modal ref={modalRef}>
                    {is_trashed ? (
                        <ul>
                            <li onClick={restoreTrash}>
                                <Trash /> Restore
                            </li>
                            <li style={{color: 'rgb(293, 68, 68)'}} onClick={()=>setShowDeleteModal(true)}>
                                <RedTrash /> Delete Parmanently
                            </li>
                        </ul>
                    ):(<ul>
                        {!is_archived && <li onClick={()=>updateNote({is_favorite: !is_favorite})}>
                            {is_favorite ? <FavoritesFilled /> : <Favorites/>} {is_favorite ? 'Remove' : 'Add to'} favorites
                        </li>}
                        <li onClick={archived}>
                            <Archived/> {is_archived ? 'Remove' : ''} Archived
                             
                        </li>
                        <li onClick={trashItem}>
                            <Trash /> Delete
                        </li>
                    </ul>)}
                </Modal>}
            </Header>
            <div>
                <EditorHeading>
                    <Calender />
                    <p>Date</p>
                    <Whitetext>{new Date(created_at).toLocaleDateString()}</Whitetext>
                </EditorHeading>
                <EditorHeading>
                    <Folder />
                    <p>Folder</p>
                    <Whitetext>{folders.folder}</Whitetext>
                </EditorHeading>    
                <ReactQuill 
                    placeholder="Enter your text here" 
                    modules={modules} 
                    theme='snow' 
                    value={value} 
                    style={{color: "#FFF"}} 
                    onChange={setValue}
                    onBlur={()=>updateNote({notes: value})}
                    readOnly={is_trashed ? true : false}
                />
            </div>
        </Section>
    </>
    )
}

export default Editor