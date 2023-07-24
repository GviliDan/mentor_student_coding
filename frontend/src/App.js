import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LobbyPage from './pages/LobbyPage';
import CodeBlockPage from './pages/CodeBlockPage';

function App() {
  return (
    <Router>

        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/code/:title" element={<CodeBlockPage />} />
          <Route path="*" element={<LobbyPage />} /> {/* Default route */}
        </Routes>
    </Router>
  );
}

export default App;
