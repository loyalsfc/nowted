import {styled} from 'styled-components'
import { Empty, Section } from './styling/styles'

const EmptyNotification = styled.article`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    line-height: 26px;
    font-style: normal;

    && h4{
        font-weight: 600;
        font-size: 28px;
        line-height: 35px;
        color: #FFFFFF;
    }
` 

function EmptyPage() {
    return (
        <Section>
            <Empty>
                <EmptyNotification>
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M48.3334 6.66666H20C18.2319 6.66666 16.5362 7.36904 15.286 8.61929C14.0358 9.86953 13.3334 11.5652 13.3334 13.3333V66.6667C13.3334 68.4348 14.0358 70.1305 15.286 71.3807C16.5362 72.6309 18.2319 73.3333 20 73.3333H60C61.7681 73.3333 63.4638 72.6309 64.7141 71.3807C65.9643 70.1305 66.6667 68.4348 66.6667 66.6667V25L48.3334 6.66666Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M46.6666 6.66666V26.6667H66.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M53.3333 43.3333H26.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M53.3333 56.6667H26.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M33.3333 30H26.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h4>Select a note to view</h4>
                    <p>Choose a note from the list on the left to view its contents, or create a new note to add to your collection.</p>
                </EmptyNotification>
            </Empty>
        </Section>
    )
}

export default EmptyPage