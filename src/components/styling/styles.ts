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
    padding: 1rem;
    padding-top: 1.5rem;

    @media (min-width: 756px){
        padding: 50px;
        
    }
`

export const Main = styled.main`
    display: flex;
`
export const FolderWrapper = styled.section`
    height: 100vh;
    width: 100%;
    position: relative;
    background-color: rgba(28, 28, 28, 1);
    display: flex;
    flex-direction: column;
    padding: 30px 1.25rem;

    @media (min-width: 756px){
        display: flex;
        width: 350px;
    }
`
export const Wrapper = styled.div`
    display: none;
    width: fit-content;
    
    @media (min-width: 756px){
        display: block;
    }
`

export const ReturnPage = styled.p`
    margin-bottom: 0.25rem;

    @media (min-width: 756px){
        display: none;
    }
`