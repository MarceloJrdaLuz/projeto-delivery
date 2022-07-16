import Input from "../Input";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputError from "../InputError";
import { useForm } from "react-hook-form";
import { useContext, useEffect} from "react";
import { AuthContext } from "../../context/AuthContext";
import Botao from "../Botao/Botao";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormStyle from "../FormStyle";
import { CadastroValues } from "./types";



export default function FormCadastro() {

    const { cadastro, erroCadastro, setBtnDisabled, btnDisabled } = useContext(AuthContext)

    useEffect(()=>{
        
    },[btnDisabled])
   
    const esquemaValidacao = yup.object({
        nome: yup.string().required(),
        email: yup.string().email().required(),
        senha: yup.string().required(),//.matches(validacaoSenha)
        repetirSenha: yup.string().oneOf([yup.ref('senha')], 'Senhas não conferem').required(),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nome: '',
            email: '',
            repetirSenha: '',
            senha: '',
        }, resolver: yupResolver(esquemaValidacao)
    })

    function onSubmit(data: CadastroValues) {
        cadastro(data.nome, data.email, data.senha)
    }

    function onError(error: any) {
        toast.error('Algo está errado! Confira todos os campos.', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    return (

        <FormStyle onSubmit={handleSubmit(onSubmit, onError)}>
            <div className={`w-full h-fit flex-col justify-center items-center`}>
                {erroCadastro ? (
                    <>
                        <div className="flex-wrap">
                            {/* <span className="flex w-full py-5 text-red-500 text-xl">Usuário já cadastrado!</span> */}
                            <Link to={'/'}>
                                <span className="flex w-full text-xl">Para ir para a página de login  <span className="pl-2 text-blue-600 hover:underline"> Clique aqui!</span></span>
                            </Link>
                        </div>
                    </>
                ) : (
                    <h1>Cadastre-se</h1>
                )}
                <div className="w-full h-full overflow-auto">
                    <Input tipo="text" placeholder="Nome Completo" registro={{
                        ...register('nome',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.nome?.message ? 'invalido' : ''} />
                    {errors?.nome?.type && <InputError type={errors.nome.type} field='nome' />}
                    <Input tipo="text" placeholder="Email" registro={{
                        ...register('email',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.email?.message ? 'invalido' : ''} />
                    {errors?.email?.type && <InputError type={errors.email.type} field='email' />}
                    <Input tipo="password" placeholder="Senha" registro={{
                        ...register('senha',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.senha?.message ? 'invalido' : ''} />
                    {errors?.senha?.type && <InputError type={errors.senha.type} field='senha' />}
                    <Input tipo="password" placeholder="Repetir Senha" registro={{
                        ...register('repetirSenha',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.repetirSenha?.message ? 'invalido' : ''} />
                    {errors?.repetirSenha?.type && <InputError type={errors.repetirSenha.type}
                        field='repetirSenha' />}
                </div>
                <Botao title="Cadastrar conta" type="submit" disabled={btnDisabled} onClick={()=>setBtnDisabled(true)}/>
            </div>
        </FormStyle>
    )
}