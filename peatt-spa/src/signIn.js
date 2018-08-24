import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
import { Link, Redirect } from 'react-router-dom'
import Video from "./video.js"
import Shows from "./shows.js"
import Bookmark from "./bookmark.js"
import Favorite from "./favorite.js"
import {connect} from "react-redux"
import { bindActionCreators } from 'redux'
import { userInfo } from "./reducers.js"
import * as sessionActions from "./actions.js"
var got = require('got');

class SignIn extends Component {
    constructor( props ) {
        super(props);
        this.state = {
            email: "",
            password: "", 
            accessToken: "",
            userID: "",
            isSignedIn: false
        }
    }

    handleClick() {
        this.props.actions.loginUser(this.state.email, this.state.password);
        this.setState({isSignedIn: true});
    }

    render() {
        if( this.state.isSignedIn ) {
            return(
                <div>
                    <Redirect to="/home" />
                </div>
            )
        }
        else {
            return (
                <form>
                    <h2> Sign-In </h2>
                    <div className="form-group">
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="email"
                            onChange={ event => this.setState({ email: event.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            placeholder="password"
                            onChange = { event => this.setState({ password: event.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <button 
                            className="btn btn-primary"
                            type="button"
                            onClick={()=> this.handleClick() }
                        >
                            Sign-in
                        </button>
                    </div> 
                </form>
            )
        }
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions: bindActionCreators( sessionActions , dispatch)
    }
};

export default connect( null, mapDispatchToProps)(SignIn);