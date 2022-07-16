import Botao from "../Botao/Botao";
import Input from "../Input";
import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useContext, useEffect} from "react";
import { AuthContext } from "../../context/AuthContext";
import FormStyle from "../FormStyle";

export default function FormEsqueciSenha() {
    const { setBtnDisabled, btnDisabled } = useContext(AuthContext)

    useEffect(()=>{
      
    },[btnDisabled])

    type EsqueciSenhaValues = {
        email: string
    }

    const { esqueciMinhaSenha } = useContext(AuthContext)

    const esquemaValidacao = yup.object({
        email: yup.string().email().required(),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            senha: ''
        }, resolver: yupResolver(esquemaValidacao)
    })


    function onSubmit(data: EsqueciSenhaValues) {
        setBtnDisabled(true)
        esqueciMinhaSenha(data.email)
    }

    function onError() {
        toast.error('Confira se o email é válido!')
    }

    return (
        <>
            <FormStyle onSubmit={handleSubmit(onSubmit, onError)} >
                <div className={`w-full h-fit flex-col justify-center items-center`}>
                    <div className={`my-6 m-auto w-full font-semibold text-2xl sm:text-3xl`}>Digite o seu e-mail</div>
                    <p>Insira o e-mail que você deseja resetar a senha!</p>
                    <Input tipo="text" placeholder="Email" registro={{
                        ...register('email',
                            { required: "Campo obrigatório" })
                    }}
                        invalido={errors?.email?.message ? 'invalido' : ''} />
                    <Botao title='Entrar' type='submit' disabled={btnDisabled} onClick={()=>setBtnDisabled(true)}/>
                </div>
            </FormStyle>
        </>
    )
}