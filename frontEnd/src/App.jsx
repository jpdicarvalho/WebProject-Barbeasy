
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SingIn from './SingIn'
import SingUp from './SingUp'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path='/SingIn' element={<SingIn />}></Route>
        <Route path='/SingUp' element={<SingUp />}></Route>
      </Routes>
     </BrowserRouter>
  )
}

export default App
