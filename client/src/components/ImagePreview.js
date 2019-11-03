import React from 'react'
import '../styles/ImagePreview.css'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'

class ImagePreview extends React.Component {
    constructor(props){
        super(props);
        this.state = {variant: '', msg: '', show: false}
        this.toggleAlert = this.toggleAlert.bind(this)
        this.presentAlert = this.presentAlert.bind(this)
    }

    componentDidMount() {
        this.GetWeather()
    }

    toggleAlert() {
        let rev = this.state.show;
        this.setState({show: (!rev) })
      }
      presentAlert(variant, msg) {
        this.setState({show: true, variant, msg})
      }

      GetWeather =()=> {
        if(this.props.city.length > 0) {
          axios.post(`/forecast/${this.props.city}`).then( (res) => {
            let { success, data, err } = res.data;
           if (success) {
              let { RealFeel, Temperature, Summary } = data;
              this.presentAlert('info',`It is ${Temperature} degs and ${Summary} in ${this.props.city}. But it feels more like ${RealFeel} degs!`)
            } else {
              this.presentAlert('danger', err);
            } 
          }).catch((err) => console.error(err));
        } else {
          this.presentAlert('danger','At Least try to Write Something');
        }
      }

    render() {
        return (
            <div>
                  {
                    this.state.show ? (
                        <Alert variant={this.state.variant} onClose={this.toggleAlert} dismissible>
                            <strong>{this.state.msg}</strong>
                        </Alert>
                    ): <></>
                }
                <img className="jkl" ref="image" src={this.props.dataUri} alt="Ready Weather" />
                <br />
                <Button as="a" href="/" variant="dark" size="lg" block>Try Again</Button>
            </div>
        );
    }
}

export default ImagePreview;