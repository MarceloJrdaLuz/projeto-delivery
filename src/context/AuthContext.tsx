import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

type AuthContextTypes = {
    authenticated: boolean
    user: UserType | undefined
    login: (email: string, senha: string) => Promise<any>
    logout: () => void
    cadastro: (nome: string, email: string, senha: string)=> Promise<any>
    resetPassword: (email: string | undefined, token: string | undefined, newPassword: string) => Promise<any>
    esqueciMinhaSenha: (email: string) => Promise<any>
    loading: boolean
    erroCadastro: boolean
    setErroCadastro: Dispatch<SetStateAction<boolean>>
    btnDisabled: boolean
    setBtnDisabled: Dispatch<SetStateAction<boolean>>
}

type AuthContextProviderProps = {
    children: ReactNode
}

type UserType = {
    id: string
    email: string
    password?: string
    newPassword?: string
    token: string
}

export const AuthContext = createContext({} as AuthContextTypes)

export function AuthProvider(props: AuthContextProviderProps) {

    const navigate = useNavigate()
    const [user, setUser] = useState<UserType | undefined>()
    const [loading, setLoading] = useState(true)
    const [erroCadastro, setErroCadastro] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

    useEffect(() => {
        const usuarioRecuperado = localStorage.getItem('user')
        if (usuarioRecuperado) {
            setUser(JSON.parse(usuarioRecuperado))
        }
        setLoading(false)
    }, [])

    async function login(email: string, senha: string) {
        await api.post("/authenticated", {
            email: email,
            password: senha
        }).then(res => {
            const usuarioLogado = {
                id: res.data.user._id,
                email: res.data.user.email,
                token: res.data.token
            }
            if(usuarioLogado.token){
                setUser(usuarioLogado)
                localStorage.setItem('user', JSON.stringify(usuarioLogado))
                toast.success('Usuário Autenticado!')
                navigate('/dashboard')    
            }
        }).catch(res => {
            const {response:{data:{error}}} = res
            if(error === 'Invalid password'){
                toast.error('Senha não confere!')
            }
            if(error === 'User not found'){
                toast.error('Usuário inválido!')
            }
            setBtnDisabled(false)
        })
    }

    function logout() {
        setUser(undefined)
        localStorage.removeItem('user')
        navigate('/')
    }

    async function cadastro(nome: string, email: string, senha: string){
        await api.post('auth/register', {
            name: nome,
            email,
            password: senha
        }).then(res => {
            const usuarioLogado = {
                id: res.data.user._id,
                email: res.data.user.email,
                token: res.data.token
            }
            if(usuarioLogado.token){
                toast.success('Cadastro efetuado com sucesso!')
                setUser(usuarioLogado)
                localStorage.setItem('user', JSON.stringify(usuarioLogado))
                navigate('/dashboard')
                setBtnDisabled(false)    
            }
        }).catch(res => {
            if(res.response.data.error === 'User already exists'){
                toast.error('Usuário já existe!')
                setErroCadastro(true)
            }
        })
    }

    async function resetPassword(email: string | undefined, token: string | undefined, password: string){
        api.post('/reset_password', {
            email, 
            token,
            password
        })
        .then(res => {
            setBtnDisabled(false)
            toast.success('Senha atualizada com sucesso!')
            navigate('/')   
        })
        .catch(res => {
            setBtnDisabled(false)
            toast.error('Houve algum erro ao atualizar a senha! Tente novamente.')
            navigate('/esqueci-minha-senha')
        })
    }

    async function esqueciMinhaSenha (email: string){
        api.post('/forgot_password', {
            email
        })
        .then(res => {
            setBtnDisabled(false)
            toast.success('E-mail enviado com sucesso!')
            navigate('/')
        }).catch(res => {
            setBtnDisabled(false)
            toast.error('Usuário ainda não cadastrado! Se desejar faça seu cadastro.')
            navigate('/cadastro')
        })
    }

    return (
        <AuthContext.Provider value={{
            authenticated: !!user, user, loading, login, logout, cadastro, erroCadastro, setErroCadastro, resetPassword, esqueciMinhaSenha, btnDisabled, setBtnDisabled
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}