import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
import { Redirect } from 'react-router-dom'
import {connect} from "react-redux"
var got = require('got');

class SignIn extends Component {
    constructor( props ) {
        super(props);
        this.state = {
            email: "",
            password: "",
            favorites: [],
            bookmarks: [],
            isSuccess: false
        }
    }
    componentDidMount() {
        this.setState({ favorites: this.props.info.favorite, bookmarks: this.props.info.bookmark})
    }

    handleClick() {
        var infoObject = []
        var info = { email: this.state.email, password: this.state.password, favorites: this.state.favorites, bookmarks: this.state.bookmarks };
        infoObject.push(info);
        var finalObj = JSON.stringify(infoObject);

        got.post("http://localhost:3001/api/parseJSON", {
            body: {
                users: finalObj
            },
            json: true
        })
        .then( res => {
            console.log(res);
            this.setState({ isSuccess: true})
        })
        .catch ( err => {
            console.log(err);
        })
    }

    render() {
        if( this.state.isSuccess ) {
            return (
                <div>
                 <Redirect to="/home"/>
                </div>
            )
        }
        else {
            return (
                <form>
                    <h2> Register/Sign-In </h2>
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
                            Enter
                        </button>
                    </div> 
                </form>
            )
        }
    }
    
}

const mapStateToProps = state => ({
    info: state
  })

export default connect(mapStateToProps)(SignIn);