import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import Compare from './pages/Compare.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/report/:username" element={<Report />} />
          <Route path="/compare"          element={<Compare />} />
          <Route path="*"                 element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        Developer Portfolio Evaluator — built with the GitHub API
      </footer>
    </BrowserRouter>
  );
}

export default App;
