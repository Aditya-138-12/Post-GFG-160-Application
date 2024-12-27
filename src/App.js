import logo from './logo.svg';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Particles from './components/particlesJS/particles';
import LoginGFG from './components/landingPage/login';
import Upload from './components/Upload/upload';
import TwitterConnectionButton from './components/twitterAccountConnect/twitterConnect';


function App() {
  return (
    <Routes>
      <Route path='/' element={<TwitterConnectionButton />} />
      <Route path='/login' element={<LoginGFG />} />
      <Route path='/upload' element={<Upload />} />
      <Route path='*' element={<Particles />} />
    </Routes>
  );
}

export default App;
