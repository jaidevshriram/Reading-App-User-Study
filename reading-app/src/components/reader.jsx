import React from 'react';

class TextChunk extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var text = this.props.text.split(/\r?\n/);

        return (
            <div className="px-5" id={this.props.id}>
                {text.map((txt, index) => 
                    <div className="px-4 py-2" key={index}>
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

        await fetch(`http://localhost:8000/get-song-list/${this.props.chapterNum}`).then(res => res.json())
        .then(data => {

            this.context = new (window.AudioContext || window.webkitAudioContext)();
    
            this.sources = [];
            this.gainNodes = [];
    
            this.songList = data;
            this.songBuffers = [];

            console.log(data, this.context);
        }).then(() => {
            for (let i = 0; i < this.songList.length; i++) {

                console.log(this.songList[i]);
                var song = new Audio(this.songList[i]);
                this.songBuffers.push(song);
                this.songBuffers[this.songBuffers.length - 1].crossOrigin = "anonymous";
    
                let tempCreatedSource = this.context.createMediaElementSource(this.songBuffers[this.songBuffers.length - 1]);
                
                this.sources.push(tempCreatedSource);
                // // this.songBuffers.push(new Audio(this.songList[i]));
                this.gainNodes.push(this.context.createGain());
            }
    
            this.setState({
                context: this.context,
                sources: this.sources,
                gainNodes: this.gainNodes,
                songBuffers: this.songBuffers,
            })
            console.log(this.songBuffers);
        })
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

        await fetch(`http://localhost:8000/get-chapter-content/${this.props.chapterNum}`).then(res => res.json())
        .then(data => {
            this.setState({
                loading: false,
                text: data['segmented'],
                name: data['name']
            })
        })

        await this.getSongNames();
    }

    async componentDidMount() {

        await this.getSongNames();

        fetch(`http://localhost:8000/get-chapter-content/${this.props.chapterNum}`).then(res => res.json())
        .then(data => {
            this.setState({
                loading: false,
                text: data['segmented'],
                name: data['name'],
            })
        })

        window.addEventListener('scroll', this.handleScroll);
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
                <div className="px-5 pb-5"><span className="px-4 display-2 stronger">Chapter {this.props.chapterNum+1}: {this.state.name}</span></div>
                <div className="px-5 pb-5">
                    <span className="px-4"> 
                        <button className="btn btn-light" onClick={() => this.state.context.resume()}>
                            Start Now
                        </button>
                    </span>
                </div>
                {this.state.text.map((text, idx) => (
                    // console.log(text, idx);
                    <React.Fragment>
                        <TextChunk key={idx} id={idx} text={text}/>
                        {/* <hr/> */}
                    </React.Fragment>
                ))}
            </div>
            </React.Fragment>
        );
    }
}
