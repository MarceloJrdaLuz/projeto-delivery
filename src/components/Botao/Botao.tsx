import { ButtonHTMLAttributes } from "react"

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {

}

export default function Botao(props: BotaoProps){
    return(
        <button className={`w-fit py-[5%] px-[15%] sm:px-9 rounded-lg bg-button-hover hover:bg-button-default hover:text-white ${props.disabled && 'bg-button-disabled hover:bg-button-disabled cursor-not-allowed'}`} disabled={props.disabled}>{props.title}</button>
    )
}