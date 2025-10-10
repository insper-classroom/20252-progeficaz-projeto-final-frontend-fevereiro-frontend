import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThreadList from './components/ThreadList';
import ThreadDetail from './components/ThreadDetail';
import CreateThread from './components/CreateThread';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ThreadList />} />
            <Route path="/thread/:id" element={<ThreadDetail />} />
            <Route path="/create" element={<CreateThread />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
