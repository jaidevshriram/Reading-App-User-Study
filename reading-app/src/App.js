import React from 'react';

import logo from './logo.svg';
import './App.css';

import Reader from './components/reader';

class DropdownItem extends React.Component {
  render() {

      return (
          <a className="dropdown-item" key={this.props.id} onClick={() => this.props.setChapter(this.props.id)}>
              Chapter {this.props.id+1}
          </a>
      );
  }
}

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        isOpen: false,
        chapter: 0,
    }
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  setChapter = (chapNum) => {

    this.setState({
        chapter: chapNum,
        isOpen: false,
    })
  }

  render () {

    const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;

    var chapterItems = [];
    for (var i=0; i<17; i++) {
        chapterItems.push(<DropdownItem setChapter={this.setChapter} key={i} id={i}/>)
    }

    return (
      <React.Fragment>
        <div id="navigation-bar">
              <nav className="navbar navbar-light navbar-expand bg-light p-3">
                  <a className="navbar-brand" href="#">
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
        <Reader chapterNum={this.state.chapter}/>
      </React.Fragment>
    );
  }
}
