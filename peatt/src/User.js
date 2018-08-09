import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
var got = require("got");

class User extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            email: "",
            password: "",
            isLoggedIn: false,
        }
    }

    handleRandom() {
        got.get("http://localhost:3001/api/random/signup")
        .then((res) =>{
            var userObject = JSON.parse(res.body);
            this.props.setUserInfo( userObject.email, userObject.password );
            this.setState({ email: userObject.email, password: userObject.password, isLoggedIn: true})
        })
        .catch( function(err){
            console.log('error:', err);
        })
    }

    handleClick() {
        this.props.setUserInfo( this.state.email, this.state.password );
        this.setState({ isLoggedIn: true})
    }

    handleContinue() {
        this.props.history.push( `${this.props.match.path}/home` )
    }
    
    render() {
        if( this.state.isLoggedIn ) {
            return ( 
                <div>
                    <p> Email is: {this.state.email}</p>
                    <p> Password is: {this.state.password} </p>
                    <button onClick = { () => this.handleContinue() }> Continue </button>
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
                        >Enter </button>
                    </div> 

                    <div className="form-group">
                        <button 
                            className="btn btn-secondary"
                            type="button" 
                            onClick={()=> this.handleRandom() }
                        > Randomize </button>
                    </div>
                </form>
   
            )
        }
    }
}

export default User;