import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Input from "../../components/Input";
import { AuthContext } from "../../context/AuthContext";
import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Botao from "../Botao/Botao";
import InputError from "../InputError";
import FormStyle from "../FormStyle";

export default function FormNovaSenha() {
    const { setBtnDisabled, btnDisabled } = useContext(AuthContext)

    useEffect(() => {

    }, [btnDisabled])

    type NovaSenhaValues = {
        senha: string
        repetirSenha: string
    }

    type ParamsType = {
        email: string | undefined
        token: string | undefined
    }

    const { resetPassword } = useContext(AuthContext)

    const esquemaValidacao = yup.object({
        senha: yup.string().required(),
        repetirSenha: yup.string().oneOf([yup.ref('senha')], 'Senhas não conferem').required(),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            senha: '',
            repetirSenha: ''
        }, resolver: yupResolver(esquemaValidacao)
    })

    const { email, token } = useParams<ParamsType>()
    let senha: string

    function onSubmit(data: NovaSenhaValues) {
        setBtnDisabled(true)
        senha = data.senha
        reset()
    }

    function reset() {
        resetPassword(email, token, senha)
    }

    function onError() {
        toast.error('Houve algum erro! Confira todos os campos.')
    }

    return (
        <>
            <FormStyle onSubmit={handleSubmit(onSubmit, onError)}>
                <div className={`w-full h-fit flex-col justify-center items-center`}>
                    <p>Digite sua senha nova.</p>
                    <Input tipo="password" placeholder="Nova Senha" registro={{
                        ...register('senha',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.senha?.message ? 'invalido' : ''} />
                    {errors?.senha?.type && <InputError type={errors.senha.type} field='senha' />}
                    <Input tipo="password" placeholder="Repetir Nova Senha" registro={{
                        ...register('repetirSenha',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.repetirSenha?.message ? 'invalido' : ''} />
                    {errors?.repetirSenha?.type && <InputError type={errors.repetirSenha.type} field='repetirSenha' />}
                    <Botao title='Registrar nova senha' type='submit' disabled={btnDisabled} onClick={()=>setBtnDisabled(true)}/>
                </div>
            </FormStyle>
        </>
    )
}