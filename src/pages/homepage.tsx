import Aside from '../components/aside'
import EmptyPage from '../components/empty'
import { Empty, FolderWrapper, Main, Wrapper } from '../components/styling/styles'

const Homepage = () => {
    // const user = useLoaderData()
    
    return (
        <Main>
            <Aside />
            <Wrapper>
                <FolderWrapper className=''>
                    <Empty>No folder selected</Empty>
                </FolderWrapper>
            </Wrapper>
            <EmptyPage />
        </Main>
    )
}

export default Homepage