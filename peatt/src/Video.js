import React, { Component } from "react";

class Video extends Component {
    constructor(props) {
        super(props)
        this.state = { uID: props.uID, image: props.image, isWatchedBookmarked: false, isHalfBookmarked: false };
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

    handleWatchedBookmark( video ) {
        this.setState({ isWatchedBookmarked: true});
        this.props.handleWatchedClick( video );
    }

    handleWatchedUnbookmark( video  ) {
        this.setState({ isWatchedBookmarked: false});
        this.props.handleWatchedUnclick( video );
    }

    handleHalfBookmark( video ) {
        this.setState({ isHalfBookmarked: true  });
        this.props.handleHalfClick( video )
    }

    handleHalfUnbookmark( video ) {
        this.setState({ isHalfBookmarked: false });
        this.props.handleHalfUnclick( video );
    }

    render() {
        let watchedButton, halfButton;
        if( this.state.isWatchedBookmarked ) {
            watchedButton = <button onClick={() => this.handleWatchedUnbookmark(this.state.uID)}>Unwatch</button>
        }
        else {
            watchedButton = <button onClick={() => this.handleWatchedBookmark(this.state.uID)}>Watch</button>
        }

        if( this.state.isHalfBookmarked ) {
            halfButton = <button onClick={() => this.handleHalfUnbookmark(this.state.uID)}>Unwatch</button>
        }
        else {
            halfButton = <button onClick={() => this.handleHalfBookmark(this.state.uID)}>Partially Watch</button>

        }
        return (
          <div>
            <p> {this.state.uID} </p>
            <img src={this.state.image} alt="Video Images" style={{width: 250}}/>
            <div>
                { watchedButton }
                { halfButton }
            </div>
          </div>  
        )
    }
}



export default Video;
