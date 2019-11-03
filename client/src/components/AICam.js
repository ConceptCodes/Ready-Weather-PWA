import React from 'react';
import Webcam from "react-webcam";
import '../styles/AICam.css'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

function Location() {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(toCity);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function toCity(loc) {
  return loc; 
}

const AICam = () => {
  const videoConstraints = {
    facingMode: "environment"
  };

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => { const imageSrc = webcamRef.current.getScreenshot() }, [webcamRef] );
  
  function Magic() {
    console.log(Location())
    axios.post(`http://localhost:8081/weather/${Location()}`).then( (res) => {
      let { data } = res;
      console.log(data)
    }).catch((err) => console.error(err));
  }

  return (
    <div>
      <Webcam
        audio={false}
        className="video"
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <Button className="trigger" size="lg" block onClick={Magic} variant="dark">Click Me!!</Button>
    </div>
  );
};

export default AICam;