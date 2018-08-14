import React, { Component } from "react";
import { Media } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "./Video.css"

class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { uID: "", image: "", isWatchedBookmarked: false };
    }

    componentDidMount() {
        this.setState({ uID: this.props.uID, image: this.props.image, isWatchedBookmarked: this.props.watched })
    }

    static getDerivedStateFromProps( nextProps, prevState ) {

        if( nextProps.uID !== prevState.uID || nextProps.watched !== prevState.watched ) {
            return {
                uID: nextProps.uID,
                image: nextProps.image,
                isWatchedBookmarked: nextProps.watched,
            }
        }
        return null;
    }

    handleWatchedBookmark( video ) {
        this.setState({ isWatchedBookmarked: true});
        this.props.handleWatchedClick( video );
    }

    handleWatchedUnbookmark( video  ) {
        this.setState({ isWatchedBookmarked: false});
        this.props.handleWatchedUnclick( video );
    }

    handleHalfBookmark( video ) {
        this.setState({ isWatchedBookmarked: true  });
        this.props.handleHalfClick( video )
    }

    render() {
        let watchedButton, halfButton;
        if( this.state.isWatchedBookmarked ) {
            watchedButton = <button onClick={() => this.handleWatchedUnbookmark(this.state.uID)}>Unwatch</button>
        }
        else {
            watchedButton = <button onClick={() => this.handleWatchedBookmark(this.state.uID)}>Watch</button>
            halfButton = <button onClick={() => this.handleHalfBookmark(this.state.uID)}>Partially Watch</button>

        }
        return (
          <div className='Video-Images'>
          <Media>
                <Media.Body>
                    <Media.Heading style={{background: '#06909F', color:'white', marginBottom: '0'}}> {this.state.uID} </Media.Heading>
                    <div className="Video-display">
                        <img src={this.state.image} alt="Video Images" style={{width: 250}}/>
                    </div>
                    <div className="Video-display">
                        { watchedButton }
                        { halfButton }
                    </div>
                </Media.Body>
            </Media>    
          </div>  
        )
    }
}



export default Video;
