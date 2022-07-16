import { InputHTMLAttributes } from "react";
import Label from "./Label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    tipo?: string
    placeholder: string
    name?: string
    readonly?: boolean
    required?: boolean
    invalido?: string
    focus?: any
    registro?: any
}

export default function Input(props: InputProps) {
    
    return (
        <div className={`${props.readonly ? 'focus-within:border-black' : 'outline' } relative rounded-lg border-[1px] ${props.invalido === 'invalido' ? 'border-red-700 mb-1': 'border-slate-500'} focus-within:border-blue-400 outline-none my-6 w-full h-fit m-auto`}>
            <input
                type={props.tipo}
                name={props.name}
                placeholder={props.placeholder} 
                className={`block p-[5%] sm:p-4 w-full  text-2xl
                text-black appearance-none placeholder-transparent focus:outline-none bg-transparent read-only:bg-gray-300 read-only:rounded-lg`}
                readOnly={props.readonly}
                autoComplete="off"
                required = {props.required}
                ref={props.registro}
                {...props.registro}
            />
            <Label invalido={props.invalido === 'invalido' ? true : false} texto={props.placeholder} readonly={props.readonly} />
        </div>
    )
}   