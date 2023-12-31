import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LobbyPage from './pages/LobbyPage';
import CodeBlockPage from './pages/components/CodeBlockPage';

function App() {
  return (
    <Router>

        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/code/:id" element={<CodeBlockPage />} />
        </Routes>
    </Router>
  );
}

export default App;
