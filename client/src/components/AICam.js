import React from 'react';
import Webcam from "react-webcam";
import '../styles/AICam.css'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import * as tf from '@tensorflow/tfjs'

let model;

class AICam extends React.Component {
  setRef = webcam => {
    this.webcam = webcam;
  }

  Location =()=> {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(this.toCity);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  cropImage = (img) => {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }

  GetWeather =()=> {
    //console.log(Location())
    axios.post(`http://localhost:8081/weather/${Location()}`).then( (res) => {
      let { data } = res;
      console.log(data)
    }).catch((err) => console.error(err));
  }
  
  toCity =(loc)=> {
    return `${loc.coords.latitude}+${loc.coords.longitude}`; 
  }

  predict = ()=> tf.tidy(() => {
    var myImage = new Image();
    myImage.src = this.webcam.getScreenshot();
    console.log(this.webcam.getScreenshot());
    // tf.fromPixels() returns a Tensor from an image element.
    const raw = tf.browser.fromPixels(myImage).toFloat();
    const cropped = this.cropImage(raw); 
    const resized = tf.image.resizeBilinear(cropped, [28, 28])
  
    // Normalize the image from [0, 255] to [-1, 1].
    const offset = tf.scalar(127);
    const normalized = resized.sub(offset).div(offset);
  
    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.expandDims(0);
  
    // Make a prediction through mobilenet.
    console.log(model.predict(batched).dataSync());
  })

  Magic(weather,clothes) {
    // what you shouldnt wear in the heat
    let hClothes = ['pullover','shirt','coat'];
    let cClothes = ['t-shirt','sandal'];

    //if too hot make sure your not wearing hot clothes
    if(Math.float(weather) > 70) {
      return hClothes.includes(clothes)
    } else {
      return cClothes.includes(clothes)
    }

  }
  
  async componentDidMount() {
    model =  await tf.loadGraphModel('../model.json');
    console.log('Model is Loaded')
  }

  render() {
    const videoConstraints = {
      facingMode: "environment"
    };
    
    return (
      <div>
        <Webcam
          audio={false}
          className="video"
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <Button className="trigger" size="lg" block onClick={this.predict} variant="dark">Click Me!!</Button>
      </div>
    );
  }
};

export default AICam;