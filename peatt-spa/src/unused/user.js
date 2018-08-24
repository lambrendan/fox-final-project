import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css"
var got = require('got');

class User extends Component {
    constructor( props ) {
        super(props);
        this.state = {
            email: "",
            password: "", 
            error: ""
        }
    }

    signUp() {
        var email = this.state.email;
        var password = this.state.password;
        got.post("http://localhost:3001/api/signup", {
            body: {
                "email": email,
                "password": password
            }, json: true
        })
        .then( res => {
            console.log("yay");
        })
        .catch ( err => {
            this.setState( {error: err});
        })
    }
    
    render() {
        return (
            <form>
                <h2> Sign-Up </h2>
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
                        onClick={()=> this.signUp()}
                    >
                        Sign-up
                    </button>
                </div>    
            </form>
        )
    }
}
export default User;