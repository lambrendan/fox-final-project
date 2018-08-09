import React, { Component } from "react";
import got from "got";

class BookmarkPage extends Component {
    constructor(props) {
        super(props) 
        this.state = { 
            numPages: 0, 
            pageArray:[], 
            page: 1,
        };
    }

    componentDidMount() {
        this.setState({ 
            numPages: this.props.numPages, 
            pageArray: [
                ...Array(this.props.numPages).keys()
            ].map(index => index++), 
        });
    }

    checkPages = () => {
        if (this.state.page > this.props.numPages || this.state.page <= 0) {
            this.setState({ page: 1 });
            this.pageChange(1);
            this.props.setError(true);
        } else {
            this.pageChange(this.state.page);
        }
    }

    pageChange = page => {
        got.get(`http://localhost:3001/api/videos?page=${page.toString()}`)
            .then(res => this.props.setVideos(JSON.parse(res.body).videoList))
            .catch(err => console.error(err));
    }

    handlePageForwardClick = () => this.setState({ page: this.state.page++ }, () => this.checkPages());
  
    handlePageClick = page => this.setState({ page }, () => this.checkPages());

    handlePageBackwardsClick = () => this.setState({ page: this.state.page-- }, () => this.checkPages());  
      
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.numPages !== prevState.numPages) {
            return {
                numPages: nextProps.numPages,
                pageArray: [...Array(nextProps.numPages).keys()].map( index => index + 1),
            }
        }
        return null;
    }

    render() {
        return (
            <div>
                <button onClick={this.handlePageBackwardsClick}>Previous Page </button>
                {
                    this.state.pageArray.map((item, index) => 
                        <button 
                            key={index} 
                            onClick={() => this.handlePageClick(item)}>
                            {item}
                        </button>
                    )
                }
                <button onClick={this.handlePageForwardClick}>Next Page</button>
            </div>    
        )
    }
}
export default BookmarkPage;