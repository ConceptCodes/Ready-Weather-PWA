import React from 'react';
import '../styles/AICam.css'
import ImagePreview from './ImagePreview'
import * as tf from '@tensorflow/tfjs'
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import jpeg from 'jpeg-js'
import 'react-html5-camera-photo/build/css/index.css';


class AICam extends React.Component {
  constructor (props) {
    super(props);
    this.state = { dataUri: null, image: null, mode: FACING_MODES.ENVIRONMENT };
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
    this.makeImage = this.makeImage.bind(this)
  }
 
  onTakePhotoAnimationDone (dataUri) {
    this.setState({ dataUri })
    this.makeImage()
  }

  makeImage() {
    let img = jpeg.encode(new Blob([this.state.dataUri],{type: 'image/jpeg'}))
    img.width = 500;
    img.height = 500;
    this.setState({image: img})
  }
  

  predict = ()=> tf.tidy(() => {
    const raw = tf.browser.fromPixels(this.state.image,1)
      .reshape([1, 28, 28, 1])
      .cast('float32')
      .div(tf.scalar(255));
    
    let predictionResult =  this.props.model.predict(raw).dataSync();
    console.log(predictionResult);
    let recognizedClothing = predictionResult.indexOf(Math.max(...predictionResult));
    console.log(recognizedClothing);
    let labelNames = ["top", "trouser", "pullover", "dress", "coat", "sandal", "shirt", "sneaker", "bag", "ankle boot"];
    return labelNames[Math.floor(recognizedClothing)];
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

  render() {
    return (
      <div>
        <br></br>
       {
          (this.state.dataUri)
            ? <ImagePreview city={this.props.city} pred={this.predict} dataUri={this.state.dataUri} />
            : <Camera onTakePhotoAnimationDone={this.onTakePhotoAnimationDone} />
        }
      </div>
    );
  }
};

export default AICam;