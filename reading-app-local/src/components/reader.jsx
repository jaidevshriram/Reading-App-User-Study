import React from 'react';

import songNames from '../song_names/16.json';
import chapterContent from '../chapter_content/16.json';

class TextChunk extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var text = this.props.text.split(/\r?\n/);

        return (
            <div className="px-5" id={this.props.id}>
                {text.map((txt, index) => 
                    <div className={`py-2 text-${this.props.font} ${this.props.size}-text`} key={index}>
                        {txt}
                    </div>
                )}
            </div>
        );
    }
}

export default class Reader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            text: 'Loaded',
            name: 'None',
            currentDiv: -1,
            context: '',
            gainNodes: '',
            sources: '',
            songBuffers: '',
        }
    }

    async getSongNames() {

        console.log(songNames);

        // await fetch(process.env.PUBLIC_URL + `/chapter_song_list/${this.props.chapterNum}.json`).then(res => res.json())
        // .then(data => {

        //     console.log(data);

        this.context = new (window.AudioContext || window.webkitAudioContext)();

        this.sources = [];
        this.gainNodes = [];

        this.songList = songNames;
        this.songBuffers = [];

        // console.log(data, this.context);

        for (let i = 0; i < this.songList.length; i++) {

                var songPath = 'https://jaidevshriram.com/assets/' + "/music/16/" + this.songList[i];
                console.log(songPath);

                var song = new Audio(songPath);
                // console.log(document.getElementById('song0'));

                // var song = document.getElementById('song0');
                this.songBuffers.push(song);
                this.songBuffers[this.songBuffers.length - 1].crossOrigin = "anonymous";

                // console.log("Trying to create media el source")
                let tempCreatedSource = this.context.createMediaElementSource(this.songBuffers[this.songBuffers.length - 1]);
                // console.log("After");

                this.sources.push(tempCreatedSource);
                // this.sources.push(song);
                // // // this.songBuffers.push(new Audio(this.songList[i]));
                this.gainNodes.push(this.context.createGain());
        }
    
        this.setState({
            context: this.context,
            sources: this.sources,
            gainNodes: this.gainNodes,
            songBuffers: this.songBuffers,
        })
        console.log(this.songBuffers);
    }

    playSongs = (kill, revive) => {

        const fadeTimes = 10;
        const fadeTimem = fadeTimes * 1000;

        console.log(kill, revive, this.state.context);

        var currTime = this.state.context.currentTime;
        // console.log(this.sources, this.gainNodes, this.state.context.destination);

        this.state.sources[revive].connect(this.gainNodes[revive])
        this.state.gainNodes[revive].connect(this.state.context.destination);

        console.log(currTime, currTime + fadeTimes, fadeTimem);

        this.state.gainNodes[revive].gain.linearRampToValueAtTime(0, currTime);
        this.state.gainNodes[revive].gain.linearRampToValueAtTime(1, currTime + fadeTimes);
        this.state.songBuffers[revive].loop = true;
        this.state.songBuffers[revive].play();

        if (kill < 0) {
            return;
        }

        this.state.gainNodes[kill].gain.linearRampToValueAtTime(1, currTime);
        this.state.gainNodes[kill].gain.linearRampToValueAtTime(0, currTime + fadeTimes);
        window.setTimeout(() => {
            this.state.songBuffers[kill].pause();
            this.state.songBuffers[kill].currentTime = 0;    

            this.state.sources[kill].disconnect(this.gainNodes[kill]);
            this.state.gainNodes[kill].disconnect(this.state.context.destination);
        }, fadeTimem);
    }

    async componentDidUpdate(prevProps, prevState) {

        if ((prevState.currentDiv == this.state.currentDiv) && (prevProps.chapterNum == this.props.chapterNum)) {
            return;
        }

        if (prevState.currentDiv != this.state.currentDiv) {
            this.playSongs(prevState.currentDiv, this.state.currentDiv);
            return;
        }

        this.setState({
            loading: false,
            text: chapterContent['segmented'],
            name: chapterContent['name']
        })

        await this.getSongNames();
    }

    componentDidMount() {

        this.setState({
            loading: false,
            text: chapterContent['segmented'],
            name: chapterContent['name'],
        })

        window.addEventListener('scroll', this.handleScroll);
        this.getSongNames();
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll);
    }

    getTop = el => el.offsetTop + (el.offsetParent && this.getTop(el.offsetParent))

    handleScroll = () => {
        var currScroll = window.scrollY;

        for(let i=0; i<this.state.text.length-1; i++) {
            var position1 = this.getTop(document.getElementById(`${i}`));
            var position2 = this.getTop(document.getElementById(`${i+1}`));

            if ((currScroll >= position1) && (currScroll < position2)) {
                this.setState({
                    currentDiv: i
                })
            }
        }

        if (currScroll >= this.getTop(document.getElementById(`${this.state.text.length-1}`))) {
            this.setState({
                currentDiv: this.state.text.length - 1,
            })
        }
    }

    render() {
        if (this.state.loading) 
            return <div className="d-flex align-items-center justify-content-center h-75"><div className="center text-center py-auto"><h1>Loading...</h1></div></div>

        return (
            <React.Fragment>

            <div class="container h5 py-5">
                <div class="px-5 pb-3 h6 text-muted"><i>
                    This page is a demo for <a href="https://auto-book-soundtrack.github.io/" class="text-muted">'Sonus Texere'</a> (ISMIR '22). There are six different songs that will *automatically* play in the background of this chapter. Simply press 'Start' and begin scrolling; the music should start playing in 1-2 seconds (only after you have scrolled past the first few lines). The songs will automatically change at certain moments in the chapter, just read as you normally would. Also, spoiler alert!
                </i></div><br/>
                <div className="px-5 pb-4 chapter-font text-dark">Harry Potter and the Philosopher's Stone</div>
                <div className="px-5 pb-5"><span className="pr-4 display-2 stronger chapter-font">Chapter {this.props.chapterNum+1}: {this.state.name}</span></div>
                <div className="px-5 pb-5">
                    <span className=""> 
                        <button className="btn btn-outline-dark" onClick={() => this.state.context.resume()}>
                            Start Now
                        </button>
                    </span>

                </div>
                {this.state.text.map((text, idx) => (
                    // console.log(text, idx);
                    <React.Fragment>
                        <TextChunk key={idx} id={idx} text={text} font={this.props.font} size={this.props.size}/>
                        {/* <hr/> */}
                    </React.Fragment>
                ))}
            </div>
            </React.Fragment>
        );
    }
}
