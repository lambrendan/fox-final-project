import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./User.css"
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
                    <p className='User-info'> Your email is: {this.state.email}</p>
                    <p className='User-info'> Your password is: {this.state.password} </p>
                    <button className="btn btn-secondary"
                        type="button"
                        onClick = { () => this.handleContinue() }> 
                        Continue 
                    </button>
                </div>
            )
        }
        else {
            return (    
                <form> 
                    <h1 className='User-header'> Register/Sign-In </h1>
                    <div className="form-group" style={{ paddingLeft: '27em', paddingRight: '27em'}}>
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="email"
                            onChange={ event => this.setState({ email: event.target.value})}
                        />
                    </div>

                    <div className="form-group" style={{ paddingLeft: '27em', paddingRight: '27em'}}> 
                        <input
                            className="form-control"
                            type="password"
                            placeholder="password"
                            onChange = { event => this.setState({ password: event.target.value})}
                        />
                    </div>
                                
                    <div className="form-group">
                        <button 
                            className="btn btn-secondary"
                            type="button"
                            onClick={()=> this.handleClick() }
                        >Enter </button>
                    </div> 

                    <div className="form-group">
                        <button 
                            className="btn btn-light"
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