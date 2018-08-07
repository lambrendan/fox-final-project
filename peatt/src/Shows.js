import React, { Component } from "react";

class Shows extends Component {
    constructor(props) {
        super(props)
        this.state = ({ showCode: props.showCode, image: props.image})
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if( nextProps.showCode !== prevState.showCode ) {
            return {
                showCode: nextProps.showCode,
                image: nextProps.image
            }
        }
        return null;
    }

    render() {
        return (
          <div>
            <p> {this.state.showCode} </p>
            <img src={this.state.image} alt="Show Images" style={{width: 250}}/>
            <div>
                <button onClick={() => this.props.handleClick(this.state.showCode)}>Favorite</button>
            </div>
          </div>  
        )
    }
}



export default Shows;
