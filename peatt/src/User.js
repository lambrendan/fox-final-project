import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class User extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            email: "",
            password: "",
          
        }
    }

    handleClick() {
        this.props.setUserInfo( this.state.email, this.state.password );
        this.props.history.push(`${this.props.match.path}/home`)
    }
    
    render() {
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
            </form>
   
        )
    }
}

export default User;