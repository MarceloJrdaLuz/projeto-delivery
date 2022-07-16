import SocratesLogo from '../../assets/images/socrates.png'


export default function Logo() {
    return (
        <header className='flex w-full  h-36 justify-start items-start'>
            <div className='w-full h-full'>
                <img className='w-full h-full object-cover' src={SocratesLogo} alt="Logo do Socrates" />
            </div>
        </header>
    )
}