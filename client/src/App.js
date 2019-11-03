import React from 'react';
import './styles/App.css';
import AICam from './components/AICam'
import Navbar from 'react-bootstrap/Navbar'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import Alert from 'react-bootstrap/Alert'

class App extends React.Component {
  constructor() {
    super();
    this.state = {city : '', model: null, variant: '', msg: '', show: false, tmp: null}
    this.toggleAlert = this.toggleAlert.bind(this)
    this.updateCity = this.updateCity.bind(this)
    this.presentAlert = this.presentAlert.bind(this)
    this.GetWeather = this.GetWeather.bind(this)
  }
  async componentDidMount() {
    const model =  await tf.loadGraphModel('../model.json');
    this.setState({model})
  }
  updateCity = (e) =>{ 
    this.setState({city: e.target.value});
  }
  GetWeather =()=> {
    if(this.state.city.length > 0) {
      axios.post(`/forecast/${this.state.city}`).then( (res) => {
        let { success, data, err } = res.data;
        console.log(res.data)
       if (success) {
          let { RealFeel, Temperature, Summary } = data;
          this.presentAlert('info',`It is ${Temperature} degs and ${Summary} in ${this.state.city}. But it feels more like ${RealFeel} degs!`)
          this.setState({tmp: data});
        } else {
          this.presentAlert('danger', err);
        } 
      }).catch((err) => console.error(err));
    } else {
      this.presentAlert('danger','Please Actually Write Something');
    }
  }
  toggleAlert() {
    let rev = this.state.show;
    this.setState({show: !rev})
  }
  presentAlert(variant, msg) {
    this.toggleAlert();
    this.setState({ variant, msg})
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
            <InputGroup.Append>
              <Button onClick={this.GetWeather} variant="success">Forecast</Button>
            </InputGroup.Append>
          </InputGroup>
            {
              this.state.show ? (
                <Alert variant={this.state.variant} onClose={this.toggleAlert} dismissible>
                  <strong>{this.state.msg}</strong>
              </Alert>
              ): <></>
          }
          <AICam tmp={this.state.tmp} model={this.state.model}></AICam>
      </div>
    );
  }
}

export default App;
