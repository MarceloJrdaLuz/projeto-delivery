import { Dispatch } from "react"

interface CategoriasProps {
    categoria: string
    categoriaAtiva?: boolean
    onClick: () => void
}

export default function Categorias(props: CategoriasProps) {
    return (
        <div onClick={props.onClick} className={`flex cursor-pointer justify-center items-center min-w-[100px] p-2 ${props.categoriaAtiva && 'bg-orange-400 text-white'} text-center rounded-2xl m-1`}>
            {props.categoria}
        </div>
    )
}