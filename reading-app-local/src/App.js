import React from 'react';

import logo from './logo.svg';
import './App.css';

import song0 from './music_16/0.mp3';
import song1 from './music_16/1.mp3';

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

    this.chaptersToRender = [16];
    this.state = {
        isOpen: false,
        chapter: this.chaptersToRender[0],
        font: 'serif',
        size: 'small'
    }
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  setChapter = (chapNum) => {

    this.setState({
        chapter: chapNum,
        isOpen: false,
    })
  }

  setSans = () => this.setState({ font: 'sans' });
  setSerif = () => this.setState({ font: 'serif' });

  setSmall = () => this.setState({ size: 'small' });
  setMedium = () => this.setState({ size: 'medium' });
  setLarge = () => this.setState({ size: 'large' });

  render () {

    const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;

    var chapterItems = [];

    for (var i=0; i<this.chaptersToRender.length; i++) {
        chapterItems.push(<DropdownItem setChapter={this.setChapter} key={this.chaptersToRender[i]} id={this.chaptersToRender[i]}/>)
    }

    return (
      <React.Fragment>
        <div id="navigation-bar">
              <nav className="navbar navbar-dark navbar-expand bg-dark p-3 mx-auto">
                  <div class="text-center mx-auto order-0 w-100"> 
                    <a className="navbar-brand paper-font" href="#"> 
                        {/* <img src="logo.svg" width="30" height="30" class="d-inline-block align-top px-2" alt=""/> */}
                        <strong>Sonus Texere!</strong> Automated Dense Soundtrack Construction for Books Using Movie Adaptations
                    </a>
                  </div>
              </nav>
              <div className="navbar navbar-dark navbar-expand bg-dark pb-3 mx-auto">
                <div class="text-center mx-auto order-0 w-100"> 
                    <span className="small paper-font text-white"> 
                        {/* <img src="logo.svg" width="30" height="30" class="d-inline-block align-top px-2" alt=""/> */}
                        <i>Set your preferences and start reading!</i>
                    </span>
                  </div>
              </div>
              <div className="navbar navbar-dark navbar-expand bg-blue p-3 mx-auto">
                  <div className="collapse navbar-collapse order-1 order-md-0" id="navbarNavDropdown">
                      <ul className="navbar-nav mx-auto w-100 justify-content-center gap">
                          <li className="nav-item">
                              <button className="nav-link btn btn-outline-dark mr-2 text-sans text-white" onClick={this.setSans}>
                                  Use Sans Font
                              </button>
                          </li>
                          <li className="nav-item">
                            <button className="nav-link btn btn-outline-dark text-serif text-white" onClick={this.setSerif}>
                                  Use Serif Font
                              </button>            
                          </li>
                      </ul>
                  </div>
              </div>
              <div className="navbar navbar-light navbar-expand bg-light-blue p-3 mx-auto">
                  <div className="collapse navbar-collapse order-1 order-md-0" id="navbarNavDropdown">
                      <ul className="navbar-nav mx-auto justify-content-center align-items-center gap">
                      <li className="nav-item">
                              <button className="nav-link btn btn-outline-dark mr-2 text-sans text-white btn-small-text" onClick={this.setSmall}>
                                  Small Font
                              </button>
                          </li>
                          <li className="nav-item">
                            <button className="nav-link btn btn-outline-dark text-sans text-white btn-medium-text" onClick={this.setMedium}>
                                  Medium Font
                              </button>            
                          </li>
                          <li className="nav-item">
                            <button className="nav-link btn btn-outline-dark text-sans text-white btn-large-text" onClick={this.setLarge}>
                                  Large Font
                              </button>            
                          </li>
                      </ul>
                  </div>
              </div>
        </div>
        {/* <audio id="song0" controls  crossOrigin='anonymous'>
          <source src={song0} />
        </audio> */}
        <Reader chapterNum={this.state.chapter} font={this.state.font} size={this.state.size}/>
      </React.Fragment>
    );
  }
}
