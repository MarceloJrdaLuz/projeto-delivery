import { useState } from "react";
import Categorias from "../Categorias";

export default function Cardapio(){
    const [categoriaAtiva, setCategoriaAtiva] = useState('Lanches')
    return(
        <section className={`overflow-auto`}>
            <nav className={`flex mt-16`}>
                <Categorias onClick={()=> setCategoriaAtiva('Lanches')} categoria="Lanches" categoriaAtiva={categoriaAtiva === 'Lanches' ? true : false}/>
                <Categorias onClick={()=> setCategoriaAtiva('Pizzas')} categoria="Pizzas" categoriaAtiva={categoriaAtiva === 'Pizzas' ? true : false}/>
                <Categorias onClick={()=> setCategoriaAtiva('Bebidas')} categoria="Bebidas" categoriaAtiva={categoriaAtiva === 'Bebidas' ? true : false}/>
                <Categorias onClick={()=> setCategoriaAtiva('Saladas')} categoria="Saladas" categoriaAtiva={categoriaAtiva === 'Saladas' ? true : false}/>
            </nav>
            <section className={`flex justify-between items-center`}>
                
            </section>
        </section>
    )
}