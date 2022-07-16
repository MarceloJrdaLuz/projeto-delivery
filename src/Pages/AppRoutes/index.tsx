import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import TelaCadastro from "../Cadastro";
import EsqueciSenha from "../EsqueciSenha";
import Dashboard from "../Home";
import Login from "../Login";
import NovaSenha from "../NovaSenha";

export default function AppRoutes() {
    const { authenticated, loading } = useContext(AuthContext)

    function PrivateRoute({ children }: { children: JSX.Element }) {
        if (loading) {
            return <div>Carregando...</div>
        }

        if (!authenticated) {
            return <Navigate to={'/'} />
        }
        return children
    }

    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<TelaCadastro />} />
                <Route path='/dashboard'
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                <Route path='/nova-senha/:token/:email' element={<NovaSenha />} />
                <Route path='/esqueci-minha-senha' element={<EsqueciSenha />} />
            </Routes>

        </div>
    );
}