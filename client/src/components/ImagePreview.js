import React from 'react'
import '../styles/ImagePreview.css'
import Button from 'react-bootstrap/Button'

class ImagePreview extends React.Component {
    constructor(props){
        super(props);
    }
    goBack() {

    }

    render() {
        return (
            <div>
                <img className="jkl" ref="image" src={this.props.dataUri} alt="Ready Weather" />
                <br />
                <Button as="a" href="/" variant="dark" size="lg" block>Try Again</Button>
            </div>
        );
    }
}

export default ImagePreview;