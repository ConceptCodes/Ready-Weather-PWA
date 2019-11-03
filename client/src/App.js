import React from 'react';
import './styles/App.css';
import AICam from './components/AICam'
import Navbar from 'react-bootstrap/Navbar'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

class App extends React.Component {
  constructor() {
    super();
    this.state = {city : ''}
  }
  updateCity = (e) =>{ 
    this.setState({city: e.target.value});
  }
  render() {
    return (
      <div className="App">
          <Navbar bg="primary" variant="dark">
              <h1 className="title">Ready Weather</h1>
          </Navbar>
          <InputGroup className="mb-3">
            <FormControl
              as="input"
              placeholder="Enter your City"
              aria-label="Enter your City"
              aria-describedby="basic-addon2"
              value={this.state.city} 
              onChange={this.updateCity}
            />
            <InputGroup.Append>
              <Button variant="success">Button</Button>
            </InputGroup.Append>
          </InputGroup>
          <AICam></AICam>
      </div>
    );
  }
}

export default App;
