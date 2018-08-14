import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import "./Root.css"

class Root extends Component {
    render() {
        return (
            <div>
                <div> 
                    <h1 style={{ color: 'white', fontSize: '30px'}}> Guide to using the Fox Profile Evaluation Tool: </h1>
                    <p>{'nbsp'}</p>
                    <ul style={{ 'listStyle': 'none' }}>
                        <li className='Root-list'> 1. Start by clicking on the link below </li>
                        <li>{'nbsp'}</li>
                        <li className='Root-list'> 2. Either sign-up/sign-in or randomize a user by clicking on the 'Randomize Button' </li>
                        <li>{'nbsp'}</li>
                        <li className='Root-list'> 3. Choose to either start favoriting shows or bookmarking videos </li>
                        <li>{'nbsp'}</li>
                        <li className='Root-list'> 4. Favoriting: 
                            <ul style={{ 'listStyle': 'none' }}>
                                <li className='Root-listToo'> a.) Randomize a selection by clicking the "Random" button </li>
                                <li className='Root-listToo'> b.) Manually favorite shows by clicking on "Favorites" </li>
                                <li className='Root-listToo'> c.) Click "Finish" once you are done</li>
                            </ul>
                        </li>
                        <li>{'nbsp'}</li>
                        <li className='Root-list'> 5. Bookmarking: 
                            <ul style={{ 'listStyle': 'none' }}>
                                <li className='Root-listToo'> a.) Randomize a selection by clicking the "Random" button </li>
                                <li className='Root-listToo'> b.) Manually watch a video partially by clicking the "Partially Watched" button </li>
                                <li className='Root-listToo'> c.) Manually watch an entire video by clicking the "Watch" button </li>
                                <li className='Root-listToo'> c.) Click "Finish" once you are done </li>
                            </ul>
                        </li>
                        <li>{'nbsp'}</li>
                        <li className='Root-list'> 6. Once you are finished with this user, click on the "Done" button on the homepage </li>
                    </ul>
                   
                </div>
                <div>
                    <Link to='/user'> 
                        <button
                            className="btn btn-secondary"
                            type="button">
                            Start here 
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Root;