import {styled} from 'styled-components'

export const Background = styled.div`
    background-color: 
`
export const Empty = styled.div`
    font-style: italic;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

export const Section = styled.section`
    flex: 1 1 0%;
    position: relative;
    height: 100vh;
    padding: 50px;
`

export const Main = styled.main`
    display: flex;
`
export const FolderWrapper = styled.section`
    height: 100vh;
    width: 350px;
    position: relative;
    background-color: rgba(28, 28, 28, 1);
    display: flex;
    flex-direction: column;
    padding: 30px 1.25rem;
`