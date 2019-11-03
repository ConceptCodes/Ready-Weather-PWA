import React from 'react';
import './styles/App.css';
import AICam from './components/AICam'
import Navbar from 'react-bootstrap/Navbar'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import * as tf from '@tensorflow/tfjs'


class App extends React.Component {
  constructor() {
    super();
    this.state = {city : '', model: null, variant: '', msg: '', show: false, tmp: null}
    this.updateCity = this.updateCity.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

    async componentDidMount() {
       const model = await tf.loadLayersModel('https://ready-weather.herokuapp.com/model.json');
       console.log(model)
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
          <InputGroup size="lg" className="mb-3">
            <FormControl
              placeholder="Enter your City"
              aria-label="Enter your City"
              aria-describedby="basic-addon2"
              value={this.state.city} 
              onChange={this.updateCity}
            />
          </InputGroup>
          
          <AICam city={this.state.city} tmp={this.state.tmp} model={this.state.model}></AICam>
      </div>
    );
  }
}

export default App;
