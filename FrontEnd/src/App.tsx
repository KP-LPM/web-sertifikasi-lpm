import { Login } from './pages/Auth/Login'
import { AppProvider } from './context'

function App() {
  return (
    <AppProvider>
      <Login />
    </AppProvider>
  )
}

export default App