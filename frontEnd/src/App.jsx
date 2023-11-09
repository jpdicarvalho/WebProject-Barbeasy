
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import SignIn from './SignIn/SignIn'
import SignUp from './SignUp/SignUp'
import BarbeariaDetails from '../src/BarbeariaDetails/BarbeariaDetails'
import Checkout from './Checkout'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/SignIn' element={<SignIn />}></Route>
        <Route path='/SignUp' element={<SignUp />}></Route>
        <Route path="/BarbeariaDetails" element={<BarbeariaDetails />} />
        <Route path="/Checkout" element={<Checkout />} />
      </Routes>
     </BrowserRouter>
  )
}

export default App
