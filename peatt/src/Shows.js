import React, { Component } from "react";
import { Media } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "./Shows.css"


class Shows extends Component {
    constructor(props) {
        super(props)
        this.state = ({ showCode: props.showCode, image: props.image, isFavorited: false })
    }

    componentDidMount() {
        this.setState({ isFavorited: this.props.found})
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if( nextProps.showCode !== prevState.showCode || nextProps.found !== prevState.found) {
            return {
                showCode: nextProps.showCode,
                image: nextProps.image,
                isFavorited: nextProps.found
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
          <div className = "Show-images">  
            <Media>
                <Media.Body>
                    <Media.Heading style={{background: '#06909F', color:'white'}}> {this.state.showCode} </Media.Heading>
                    <div className="Show-display">
                        <img src={this.state.image} alt="Show Images" style={{width: 250}}/>
                    </div>
                    <div className="Show-display">
                        {actionButton}
                    </div>
                </Media.Body>
            </Media>
          </div>  
        )
    }
}



export default Shows;
