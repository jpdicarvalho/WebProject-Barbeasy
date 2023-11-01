
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import SingIn from './SingIn'
import SingUp from './SingUp'
import BarbeariaDetails from './BarbeariaDetails'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/SingIn' element={<SingIn />}></Route>
        <Route path='/SingUp' element={<SingUp />}></Route>
        <Route path="/BarbeariaDetails" element={<BarbeariaDetails />} />
      </Routes>
     </BrowserRouter>
  )
}

export default App
