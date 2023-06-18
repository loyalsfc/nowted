import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import {supabase} from '../../config'
import { styled } from 'styled-components'

const Wrapper = styled.div`
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 100vh;
    && .wrapper{
        width: 100%;
    }
`

const Login = () => {
    return (
        <Wrapper className='cointainer mx-auto'>
            <div className='wrapper'>
                <Auth
                    supabaseClient={supabase} 
                    appearance={{ theme: ThemeSupa }}
                    providers={['google', 'facebook', 'github']}
                    theme='dark'
                />
            </div>
        </Wrapper>
    )
}

export default Login