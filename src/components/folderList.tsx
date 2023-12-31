import { styled } from "styled-components"
import Aside from "../components/aside"
import EmptyPage from "../components/empty"
import { Empty, FolderWrapper, Main, ReturnPage, Wrapper } from "../components/styling/styles"
import { Link } from "react-router-dom"
import Editor from "../components/editor"

const Title = styled.h2`
  font-weight: 600;
  font-size: 22px;
  line-height: 28px;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
  text-transform: capitalize;
`
const Content = styled.div`
  flex: 1;
  position: relative;
`

const Card = styled.li`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
  padding: 1.25rem;

  && p{
    display: flex;
    gap: 10px;
  }

  && span{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  && h4{
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    color: #FFFFFF;
  }

  && h4.loader{
    height: 18px;
    margin: 5px 0;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
  }
  && .loader span{
    display: block;
    background-color: rgba(255, 255, 255, 0.6);
    height: 1rem;
    margin: 0.25rem 0;
    width: 100%;
    border-radius: 5px;
  }
`
const CardWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
` 

const TitleLoading = styled.p` 
  height: 1.75rem;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.6);
  width: 100px;
`

const NewFolderWrapper = styled(FolderWrapper)< {$slug?: any}>`
  display: ${props => props.$slug ? "none" : "flex"};

  @media (min-width: 756px) {
    display: flex;
  }
`

function FolderList({
        isFolderLoading,
        folder,
        notes,
        isLoading,
        slug,
        id,
    }: {
        isFolderLoading: boolean;
        folder: string;
        notes: any[] | null | undefined;
        isLoading: boolean;
        slug: string | undefined;
        id: string | undefined ;
    }) {
      
    return (
      <Main>
      <Wrapper>
        <Aside />
      </Wrapper>
      <NewFolderWrapper $slug={slug}>
      <ReturnPage>
        <Link to='/'>Go Bank</Link>
      </ReturnPage>
        <Title>{isFolderLoading ? <TitleLoading className="loader"></TitleLoading> : folder}</Title>
        <Content>
          {notes?.length && !isLoading && !isFolderLoading ? (
            <CardWrapper>
              {notes?.map(item => {
                return <Card key={item.note_id}
                  style={{backgroundColor: slug === item.slug ? 'rgba(255, 255, 255, 0.1)' : ""}}
                >
                  <Link to={`/${id}/${item.slug}`}>
                    <h4>{item.title}</h4>
                    <p>
                      {new Date(item.created_at).toLocaleDateString()}
                      <span>{item.notes.replace(/<[^>]+>/g, '')}</span>
                    </p>
                  </Link>
                </Card>
              }) }
            </CardWrapper>
          ):(isLoading || isFolderLoading ? <CardWrapper>
            {[1,2,3,4,5].map((_, index) => {
              return <Card key={index}>
                <h4 className="loader"></h4>
                <p className="loader">
                  <span></span>
                  <span></span>
                </p>
              </Card>
            })}
          </CardWrapper>:<Empty>This Folder is Empty</Empty>
          )}
        </Content>
      </NewFolderWrapper>
      {slug ? <Editor slug={slug} id={id} /> : <EmptyPage />}
  </Main>
    )
}


export default FolderList