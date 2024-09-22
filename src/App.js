import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Verification from './component/verification';
import Home from './component/Home';

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route element={<Verification />} path={"/"} />
          <Route element={<Home />} path={"/welcome"} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
