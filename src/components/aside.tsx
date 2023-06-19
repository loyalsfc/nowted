import logo from '../assets/logo.png'
import { styled } from 'styled-components'
import { AddFolder, AddIcon, Archived, Document, Favorites, Folder, OpenedFolder, Search, Trash } from './styling/icons'
import { supabase } from '../../config'
import {useState, useEffect, useRef} from 'react'
import {NavLink, useLoaderData, useNavigate, useParams} from 'react-router-dom'
import { INotes } from '../lib/interfaces'
import { createSlug } from '../utils/utils'
import { useQuery } from 'react-query'

const SideBar = styled.aside`
    width: 300px;
    height: 100vh;
    overflow: scroll;
`
const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
`
const NewNote = styled.div`
    padding: 0 1.25rem;
    && button, div {
        display: block;
        width: 100%;
        max-width: 100%;
        padding: 10px;
        text-align: center;
        font-weight: 600;
        color: #FFF;
        display: flex;
        justify-content: center;
        gap: 0.25rem;
        align-items: center;
        line-height: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        border: none;
    }
    div{
        gap: 0.5rem;
        opacity: 0.6;
    }
`
const ListWrapper = styled.div`
    padding: .725rem 0;
    && .title{
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.25rem;
    }
    && ul{
        max-height: 300px;
        overflow: scroll;

    }
    && .empty{
        text-align: center;
        font-style: italic;
        padding: 0.5rem 1.25rem;
        font-weight: 500;
    }
    && li, .nameEdit, a{
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px 1.25rem;
    }
    && a{
        width: 100%;
    }
    && .nav{
        padding: 0 !important;
    }
    && button{
        margin-left: auto;
        display: none;
    }
    && .nav:hover button{
        display: block;
    }
`

const NotificationWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    padding: 0.25rem;
    pointer-events: none;

    && div{
        color: #FFF;
        background-color: rgb(34 197 94);
        width: fit-content;
        padding: 0.5rem 2rem;
        margin: 0 auto;
    }
`

function Aside() {
    const [folders, setFolders] =  useState<any[] | null >([])
    const id = useLoaderData();
    const params = useParams()
    const newWrapper = useRef<HTMLInputElement | null>(null)
    const newFolderEdit = useRef<HTMLInputElement | null>(null)
    const {data: recents} = useQuery(['recents'], fetchRecents)
    const navigation = useNavigate()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showCreate, setShowCreate] = useState<boolean>(true)
    const search = useRef<HTMLInputElement | null>(null)
    
    useEffect(()=>{
        fetchFolders()
    },[])
    
    async function fetchFolders(){
        const {data} = await supabase.from('folders')
            .select()
            .order('id', {ascending: false})
            .eq('user_id', id)
        setFolders(data)
    }
    
    async function fetchRecents(){
        const {data} = await supabase.from('notes')
            .select()
            .order('created_at', { ascending: false })
            .eq('user_id', id)
            .neq('is_archived', true)
            .neq('is_trashed', true)
        return data;
    }

    const initiateNewFolder =() =>{
        newWrapper.current?.classList.add('nameEdit');
        newFolderEdit.current!.value = 'My New folder';
        newFolderEdit.current?.focus();
    }

    const handleBlur = async(e: React.FocusEvent<HTMLInputElement, Element>) => {
        await createFolder(e.target.value)
        newWrapper.current?.classList.remove('nameEdit');
    }

    async function createFolder(title: string){
        const {data} = await supabase.from('folders').insert({
                id: new Date().getTime(),
                folder: title,
                user_id: id,
            })
            .select();
        setFolders([...(folders || []), data![0]]);
    }
    
    const createNote = async() => {
        if(!params.id){
            alert('Please select a folder first');
            return;
        }
        const title = `Untitled Notes`
        const {data, error} = await supabase.from('notes').insert<INotes>({
                id: new Date().getDate(),
                title,
                notes: '',
                folder: parseInt(params.id), 
                slug: createSlug(title),
                is_favorite: false,
                is_trashed: false,
                is_archived: false,
                user_id: id
            })
            .select()
        if(error) return;
        navigation(`/${data[0].folder}/${data[0].slug}`)
    }

    const filterItem = (item: {title: string}) => {
        return item.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
    }

    const filterFolder = (item: {folder: string}) => {
        return item.folder.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
    }

    useEffect(()=>{
        if(!showCreate){
            search.current && search.current.focus()
        }
    },[showCreate])

    const closeSearch = () => {
        setSearchInput('');
        setShowCreate(true)
    }

    return (
        <SideBar>
            <NotificationWrapper>
                {/* <div>Note Moved To Trash</div> */}
            </NotificationWrapper>
            <Header>
                <img src={logo} alt="" height={38} />
                <button onClick={()=>setShowCreate(false)}>
                    <Search/>
                </button>
            </Header>
            <NewNote>
                {showCreate ? <button onClick={createNote}>
                    <AddIcon />
                    New Note
                </button> :
                <div>
                    <label htmlFor="search">
                        <Search />
                    </label>
                    <input 
                        type="text" 
                        id='search'
                        ref={search}
                        value={searchInput}
                        onChange={(e)=>setSearchInput(e.target.value)}
                        onBlur={closeSearch}
                    />
                </div>}
            </NewNote>
            <ListWrapper>
                <h4 className='title'>Recents</h4>
                {recents?.length ? <ul>
                    {recents.filter(filterItem).length ?
                    recents.filter(filterItem)
                        .map((item, index) => {
                        if(index < 3){
                            return <li style={{}} className='nav' key={item.note_id}>
                                <NavLink
                                    to={`/${item.folder}/${item.slug}`}
                                    style={({ isActive }) => {
                                        return {
                                            backgroundColor: isActive ? "rgba(49, 46, 181, 1)" : "",
                                            color: isActive ? "#FFF" : "",
                                        };
                                    }}
                                    >
                                    <Document />
                                    {item.title}
                                </NavLink>
                            </li>
                        }
                    }):<p className='empty'>No Item Match</p>

                    }
                </ul>:
                <p className="empty">No Recent Files</p>}
            </ListWrapper>
            <ListWrapper>
                <h4 className='title'>
                    Folders
                    <button onClick={initiateNewFolder}>
                        <AddFolder />
                    </button>
                </h4>
                <div className='hidden' ref={newWrapper}>
                    <OpenedFolder />
                    <input 
                        type="text" 
                        onBlur={(e)=>handleBlur(e)} 
                        ref={newFolderEdit}
                    />
                </div>
                {folders?.length ? (<ul>
                    {folders.filter(filterFolder).length ? 
                    folders.filter(filterFolder).map((item) => {
                        return <li className='nav' key={item.id}>
                            <NavLink
                                to={`/${item.id}`}
                                style={({ isActive }) => {
                                    return {
                                        backgroundColor: isActive ? "rgba(255, 255, 255, 0.03)" : "",
                                    };
                                }}
                            >
                                <Folder />
                                {item.folder}
                            </NavLink>
                        </li>
                    }): <p className="empty">No Item Match</p>
                    }
                </ul>) : <p className="empty">No Folder Created</p>

                }
            </ListWrapper>
            <ListWrapper>
                <h4 className="title">More</h4>
                <ul>
                    <ItemsWithIcon to='favorites' title="Favorites" Icon={Favorites} />
                    <ItemsWithIcon to='trash' title="Trash" Icon={Trash} />
                    <ItemsWithIcon to='archived' title="Archived Notes" Icon={Archived} />
                </ul>
            </ListWrapper>
        </SideBar>
    )
}

function ItemsWithIcon({Icon, title, to}: {Icon: any; title: string, to: string}){
    return(
    <li className='nav'>
        <NavLink
            to={"/" + to}
            style={({ isActive }) => {
                return {
                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.03)" : "",
                };
            }}
        >
            <Icon />
            <span>{title}</span>
        </NavLink>
    </li>
    )
}

export default Aside