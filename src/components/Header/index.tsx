import LogoHeader from "../LogoHeader";
import banner from '../../assets/images/lanche.jpg'

export default function Header(){
    return(
        <header className={`flex relative justify-center items-end w-full h-52 bg-slate-400`}>
            <img src={banner} alt="Lanche" />
            <LogoHeader/>
        </header>
    )
}