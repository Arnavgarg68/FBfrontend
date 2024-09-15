import Homepage from '../components/Homepage'
import Landing from '../components/Landing';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
// handle all the routes and render of pages/components
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/landing' element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
