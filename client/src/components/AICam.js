import React from 'react';
import '../styles/AICam.css'
import ImagePreview from './ImagePreview'
import * as tf from '@tensorflow/tfjs'
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


class AICam extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = { dataUri: null, image: null, mode: FACING_MODES.ENVIRONMENT };
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
    this.makeImage = this.makeImage.bind(this);
  }
 
  onTakePhotoAnimationDone (dataUri) {
    this.setState({ dataUri });
    console.log(this.makeImage())
  }
 
  componentDidMount() {
    console.log('model',this.props.model)
    console.log('tmp',this.props.tmp)
  }

  makeImage() {
    let outputSize = 500;
    let image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, outputSize, outputSize);

      let img =  context.getImageData(0, 0, outputSize, outputSize);
    };
    
    image.src = this.state.dataUri;

    this.predict(image);
  }
  

  predict = (img)=> tf.tidy(() => {
    const raw = tf.browser.fromPixels(this.state.image,1)
      .reshape([1, 28, 28, 1])
      .cast('float32')
      .div(255);
    
    let predictionResult =  this.props.model.predict(raw).dataSync();
    let recognizedClothing = predictionResult.indexOf(Math.max(...predictionResult));
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
            ? <ImagePreview dataUri={this.state.dataUri} />
            : <Camera onTakePhotoAnimationDone={this.onTakePhotoAnimationDone} />
        }
      </div>
    );
  }
};

export default AICam;