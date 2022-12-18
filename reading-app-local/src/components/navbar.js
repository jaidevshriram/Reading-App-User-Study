import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React from 'react';

import img from '../logo.svg';

class DropdownItem extends React.Component {
    render() {

        return (
            <a className="dropdown-item" id={this.props.id} key={this.props.id} onClick={() => this.props.setChapter(this.props.id)}>
                Chapter {this.props.id}
            </a>
        );
    }
}

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            chapter: 0,
        }
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    setChapter = (chapNum) => {

        console.log(chapNum);

        this.setState({
            chapter: chapNum,
            isOpen: false,
        })
    }

    render() {
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;

        var chapterItems = [];
        for (var i=0; i<17; i++) {
            chapterItems.push(<DropdownItem setChapter={this.setChapter} key={i} id={i}/>)
        }

        return (
            <React.Fragment>
                <div>
                {/* <!-- Image and text --> */}
                    <nav className="navbar navbar-light navbar-expand bg-light p-3">
                        <a className="navbar-brand" href="https://google.com">
                            {/* <img src="logo.svg" width="30" height="30" class="d-inline-block align-top px-2" alt=""/> */}
                            <strong>Reading App</strong>
                        </a>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <button className="nav-link btn btn-light dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleOpen}>
                                        Chapter
                                    </button>
                                    <div className={menuClass} aria-labelledby="dropdown01">
                                        {
                                            chapterItems
                                        }
                                    </div>  
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </React.Fragment>
        );
    }
}

