import historySvg from '../../assets/images/history.png'
import cartSvg from '../../assets/images/cart.png'
import userSvg from '../../assets/images/user.png'
import logoutSvg from '../../assets/images/logout.png'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Menu() {
    const { logout } = useContext(AuthContext)
    return (
        <nav className={`flex fixed justify-center items-center bottom-0 w-full h-12 bg-orange-400`}>
            <ul className={`flex w-10/12 justify-between`}>
                <li className='w-10 h-10 rounded-full p-1 hover:p-2 cursor-pointer'>
                    <img className={`w-full`} src={historySvg} alt="Icone de uma lista" />
                </li>
                <li className={`w-10 h-10 rounded-full p-1 hover:p-2 cursor-pointer`}>
                    <img className={`w-full`} src={cartSvg} alt="Icone de um carrinho de compras" />
                </li>
                <li className={`w-10 h-10 rounded-full p-1 hover:p-2 cursor-pointer`}>
                    <img className={`w-full`} src={userSvg} alt="Icone de um Avatar" />
                </li>
                <li onClick={logout} className={`w-10 h-10 rounded-full p-1 hover:p-2 cursor-pointer`}>
                    <img className={`w-full`} src={logoutSvg} alt="Icone de um Avatar" />
                </li>
            </ul>
        </nav>
    )
}