import React, { Component } from "react"
class FavoritePage extends Component {
    constructor( props ) {
        super( props )
        this.state = { totalPages: 0, pageArray: [], page: 1, error: false };
    }

    checkPages = () => {
        console.log(this.state.totalPages);
        console.log(this.state.page);
        if( this.state.page > this.state.totalPages || this.state.page < 0 ) {
            this.setState({ error: true})
        }
    }

    createPageArray = () => {
        var pages = [...Array(this.state.totalPages).keys()].map( index => index + 1)
        return pages;
    }
    componentDidMount() {
        var pages = [...Array(this.state.totalPages).keys()].map( index => index + 1)
        this.setState({ totalPages: this.props.totalPages, pageArray: pages })
    }

    pageChange = () => {
        this.props.setShows( this.state.page )
    }

    handlePageForwardClick = () => {
        this.setState({ page: this.state.page + 1}, () => {
          this.checkPages();
          this.pageChange();
        });
      }
  
    handlePageClick = number => {
        this.setState({ page: number }, () => {
          this.checkPages();  
          this.pageChange();
        })
    }
  
    handlePageBackwardsClick = () => {
        this.setState({ page: this.state.page - 1 }, () => {
          this.checkPages();
          this.pageChange();
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
        console.log(this.state.error)
        if( this.state.error ) {
            return (
                <h1> ERROR </h1>
            )
        }
        else {
            return( 
                <div>
                    <button onClick={this.handlePageBackwardsClick}>Previous Page </button>
                    {
                        this.state.pageArray.map((item, index)=> {
                        return <button key={index} onClick={() => this.handlePageClick(item)}>{item}</button> })
                    }
                    <button onClick={this.handlePageForwardClick}>Next Page</button>
                </div>    
            )
        }   
    }
}
export default FavoritePage;