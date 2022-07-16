interface LabelProps {
    texto: string
    readonly?: boolean
    invalido?: boolean
}

export default function Label(props: LabelProps) {
    return (
        <label className={`rounded-lg text-xl font-semibold absolute top-0 p-[5%] sm:p-4 sm:text-lg ${props.invalido ? 'text-red-700 ': 'text-slate-700'} -z-50  duration-300 origin-0 ${props.readonly ? 'bg-white' : 'bg-white'}`}>{props.texto}</label>)
}