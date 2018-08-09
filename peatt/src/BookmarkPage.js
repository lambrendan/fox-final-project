import React, { Component } from "react"
var got = require("got")
class BookmarkPage extends Component {
    constructor( props ) {
        super(props) 
        this.state = { numPages: 0, pageArray:[], page: 1 };
    }

    componentDidMount() {
        var pages = [...Array(this.props.numPages).keys()].map( index => index + 1);
        console.log(pages);
        this.setState({ numPages: this.props.numPages, pageArray: pages })
    }

    checkPages = () => {
        if( this.state.page > this.props.numPages || this.state.page <= 0 ) {
            this.setState({ page: 1})
            this.pageChange(1);
            this.props.setError( true )
        }
        else {
            this.pageChange( this.state.page );
        }
    }

    pageChange = page => {
        got.get(`http://localhost:3001/api/videos?page=${page.toString()}`)
        .then((res) =>{
          var videoObject = JSON.parse(res.body)
          this.props.setVideos(videoObject.videoList);
        })
        .catch( function(err){
          console.log('error:', err);
        })
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
        if( nextProps.numPages !== prevState.numPages ) {
            var pages = [...Array(nextProps.numPages).keys()].map( index => index + 1);
            return {
                numPages: nextProps.numPages,
                pageArray: pages
            }
        }
        return null;
    }

    render() {
        console.log(this.props)
        return (
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
export default BookmarkPage