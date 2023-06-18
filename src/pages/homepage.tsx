// import {useContext} from 'react'
// import { supabase } from '../../config'
import Aside from '../components/aside'
import EmptyPage from '../components/empty'
// import { useLoaderData } from 'react-router-dom'
import { Empty, FolderWrapper, Main } from '../components/styling/styles'
const Homepage = () => {
    // const user = useLoaderData()

    return (
        <Main>
            <Aside />
            <FolderWrapper>
                <Empty>No folder selected</Empty>
            </FolderWrapper>
            <EmptyPage />
        </Main>
    )
}

export default Homepage