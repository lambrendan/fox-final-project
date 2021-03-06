import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.css";

class FavoritePage extends Component {
    constructor( props ) {
        super( props )
        this.state = { totalPages: 0, pageArray:[], page: 1 };
    }

    checkPages = () => {
        if( this.state.page > this.props.totalPages || this.state.page <= 0 ) {
            this.props.setShows(1);
            this.setState({ page: 1})
            this.props.setError( true );
        }
        else {
            this.pageChange();
        }
    }

    componentDidMount() {
        var pages = [...Array(this.props.totalPages).keys()].map( index => index + 1)
        this.setState({ totalPages: this.props.totalPages, pageArray: pages })
    }

    pageChange = () => {
        this.props.setShows( this.state.page )
    }

    handlePageForwardClick = () => {
        this.setState({ page: this.state.page + 1}, () => {
          this.checkPages();
        });
      }
  
    handlePageClick = number => {
        this.setState({ page: number }, () => {
          this.checkPages();  
        })
    }
  
    handlePageBackwardsClick = () => {
        this.setState({ page: this.state.page - 1 }, () => {
          this.checkPages();
        });  
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if( nextProps.totalPages !== prevState.totalPages ) {
            var pages = [...Array(nextProps.totalPages).keys()].map( index => index + 1)
            return {
                totalPages: nextProps.totalPages,
                pageArray: pages
            }
        }
        return null;
    }

    render() {
        return( 
            <div>
                <button className= "btn btn-outline-light" type='button' onClick={this.handlePageBackwardsClick}>Previous Page </button>
                {
                    this.state.pageArray.map((item, index)=> {
                    return <button className= "btn btn-outline-light" type='button'  key={index} onClick={() => this.handlePageClick(item)}>{item}</button> })
                }
                <button className= "btn btn-outline-light" type='button' onClick={this.handlePageForwardClick}>Next Page</button>
            </div>    
        )
    }
}
export default FavoritePage;