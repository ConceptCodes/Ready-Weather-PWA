import React from 'react';
import '../styles/AICam.css'
import ImagePreview from './ImagePreview'
import * as tf from '@tensorflow/tfjs'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class AICam extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = { dataUri: null, image: null };
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
  }
 
  onTakePhotoAnimationDone (dataUri) {
    console.log('takePhoto');
    this.setState({ dataUri });
    this.makeImage()
  }
 
  componentDidMount() {
    console.log('model',this.props.model)
    console.log('tmp',this.props.tmp)
  }

  makeImage() {
    return ImageData({width: 500, height: 500, array: this.convertDataURIToBinary(this.state.dataUri)})
  }
  
  convertDataURIToBinary(dataURI) {
    let BASE64_MARKER = ';base64,';
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = dataURI.substring(base64Index);
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(let i = 0; i < rawLength; i++) 
      array[i] = raw.charCodeAt(i);

    return array;
  }

  predict = ()=> tf.tidy(() => {
    let img = new Image(500, 500).src = this.webcam.getScreenshot();
    // tf.fromPixels() returns a Tensor from an image element.
    const raw = tf.browser.fromPixels(img).toFloat();
    const cropped = this.cropImage(raw); 
    const resized = tf.image.resizeBilinear(cropped, [28, 28])
  
    // Normalize the image from [0, 255] to [-1, 1].
    const offset = tf.scalar(127);
    const normalized = resized.sub(offset).div(offset);
  
    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.expandDims(0);
  
    // Make a prediction through mobilenet.
    console.log(this.props.model.predict(batched).dataSync());
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