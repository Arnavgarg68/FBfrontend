import Homepage from '../components/Homepage'
import Landing from '../components/Landing';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <Router>
      <Routes>
     
      <Route path='/home' element={  <Homepage /> }/>
      <Route path='/' element={  <Landing/> }/>
      </Routes>
    
    </Router>
  )
}

export default App
