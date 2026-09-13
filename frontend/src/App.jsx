import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Placeholder Dashboard Route */}
        <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold text-green-600">You made it to the Dashboard!</div>} />
      </Routes>
    </Router>
  );
}

export default App;