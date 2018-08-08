import React, { Component } from "react";

class Shows extends Component {
    constructor(props) {
        super(props)
        this.state = ({ showCode: props.showCode, image: props.image, isFavorited: false })
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

    handleFavoriting( showCode ) {
        this.setState({isFavorited: true});
        this.props.handleClick( showCode );
    }

    handleUnfavoriting( showCode ) {
        this.setState({ isFavorited: false});
        this.props.handleUnclick( showCode );
    }

    render() {
        let actionButton;
        if( this.state.isFavorited ) {
            actionButton = <button onClick={() => this.handleUnfavoriting(this.state.showCode)}>Unfavorite</button>
        }
        else {
            actionButton = <button onClick={() => this.handleFavoriting(this.state.showCode)}>Favorite</button>
        }
        return (
          <div>
            <p> {this.state.showCode} </p>
            <img src={this.state.image} alt="Show Images" style={{width: 250}}/>
            <div>
                {actionButton}
            </div>
          </div>  
        )
    }
}



export default Shows;
