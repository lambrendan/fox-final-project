import React, { Component } from "react";

class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { uID: props.uID, image: props.image };
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if( nextProps.uID !== prevState.uID) {
            return {
                uID: nextProps.uID,
                image: nextProps.image
            }
        }
        return null;
    }

    render() {
        return (
          <div>
            <p> {this.state.uID} </p>
            <img src={this.state.image} alt="Video Images" style={{width: 250}}/>
            <div>
                <button onClick = {() => this.props.handleWatchedClick(this.state.uID)}>Watched</button>
                <button onClick = {() => this.props.handleHalfClick(this.state.uID)}>Partially Watched</button>
            </div>
          </div>  
        )
    }
}



export default Video;
