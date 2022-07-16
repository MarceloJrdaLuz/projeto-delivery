import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Botao from '../Botao/Botao'
import Input from '../Input'
import * as yup from 'yup'
// import { validacaoSenha } from '../../utils/validate'
import { yupResolver } from '@hookform/resolvers/yup'
import InputError from '../InputError'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormStyle from '../FormStyle'
import { FormValues } from './types'



export default function FormLogin() {
    
    const { login, setErroCadastro, setBtnDisabled, btnDisabled } = useContext(AuthContext)
    
    useEffect(() => {
        setErroCadastro(false)
        setBtnDisabled(false)
    },)

    useEffect(()=>{
        
    },[btnDisabled])

    const esquemaValidacao = yup.object({
        email: yup.string().email().required(),
        senha: yup.string().required()//.matches(validacaoSenha)
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            senha: ''
        }, resolver: yupResolver(esquemaValidacao)
    })

    function onSubmit(data: FormValues) {
        setBtnDisabled(true)
        toast.promise(login(data.email, data.senha),{
            pending: 'Autenticando...',
        })    
    }

    function onError(error: any) {
        toast.error('Aconteceu algum erro! Confira todos os campos.')
     }

    return (
        <>
            <FormStyle onSubmit={handleSubmit(onSubmit, onError)}>
                <div className={`w-full h-fit flex-col justify-center items-center`}>
                    <div className={`my-6 m-auto w-11/12 font-semibold text-2xl sm:text-3xl`}>Login</div>
                    <Input tipo="text" placeholder="Email" registro={{
                        ...register('email',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.email?.message ? 'invalido' : ''} />
                    {errors?.email?.type && <InputError type={errors.email.type} field='email' />}
                    <Input tipo="password" placeholder="Senha" registro={{ ...register('senha', { required: "Campo obrigatório" }) }} invalido={errors?.senha?.message ? 'invalido' : ''} />
                    {errors?.senha?.type && <InputError type={errors.senha.type} field='senha' />}
                    <div>
                        <div>
                            <Link className='text-blue-600 hover:underline text-center text-sm sm:text-lg' to='/esqueci-minha-senha'>
                                Esqueci minha senha
                            </Link>
                        </div>
                        <div>
                            <Link className='text-blue-600 hover:underline text-center text-sm sm:text-lg' to='/cadastro'>
                                Criar nova conta
                            </Link>
                        </div>
                    </div>
                    <div className={`flex justify-center items-center m-auto w-11/12 h-12 my-[5%]`}>
                        {/* <div className={`flex justify-center items-center`}>
                        <input className='mr-1' type='checkbox' title='Mantenha-me conectado'></input>
                        <span className={`ml-2 text-sm sm:text-lg sm:ml-0`}>Mantenha-me conectado</span>
                    </div> */}
                        <Botao title='Entrar' type='submit' disabled={btnDisabled} onClick={()=>{setBtnDisabled(true)}}/>
                    </div>
                </div>
            </FormStyle>
        </>
    )
}