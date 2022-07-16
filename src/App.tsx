import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./Pages/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>

  )
}
export default App;
