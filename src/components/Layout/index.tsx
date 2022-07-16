import Header from "../Header";
import Menu from "../Menu";

export default function Layout() {
    return (
        <main className={`flex w-screen h-auto`}>
            <Header/>
            <Menu/>
        </main>
    )
}