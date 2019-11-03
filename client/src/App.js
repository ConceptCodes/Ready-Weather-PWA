import React from 'react';
import './styles/App.css';
import AICam from './components/AICam'
import Navbar from 'react-bootstrap/Navbar'

function App() {
  return (
    <div className="App">
        <Navbar bg="primary" variant="dark">
            <h1 className="title">Ready Weather</h1>
        </Navbar>
        <AICam></AICam>
    </div>
  );
}

export default App;
