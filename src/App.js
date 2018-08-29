import React from 'react';
import chroma from 'chroma-js';
import './App.css';

const Grid = () => {
  const rows = [];
  let i = 0;

  for(let y = 50; y < 800; y += 100) {
    const columns = [];
    for(let x = 50; x < 800; x += 100) {
      columns.push(
        <circle className="waveCircle" id={`waveCircle${i}`} key={i} cx={x} cy={y} r={1} stroke={10} />
      );
      i += 1;
    }
    rows.push(columns);
  }
  return rows;
}

class App extends React.Component {
  constructor() {
    super();

    // use the chroma library to create a scale of 100 colors between blue and red
    this.color = chroma.scale(['blue', 'red']).domain([0, 100]);

    // we need to bind methods being used in promises and in animation callbacks
    this.connectToMicrophone = this.connectToMicrophone.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // we are caching references to each of the circles for speed.
    this.circles = [].slice.call(document.querySelectorAll('.waveCircle'));

    // create an array to store the "volume" for each frequency.  This helps us smooth the
    // animations out.
    this.volumes = new Array(64).fill(0);

    // This attempts to connect to a user's microphone.  It's a promise.  If the user says, "OK"
    // the then() is executed.  If they say "no" the catch() is executed.
    navigator.mediaDevices.getUserMedia({audio:true})
      .then((stream) => {
        this.connectToMicrophone(stream);
        this.animate();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  connectToMicrophone(stream) {
    // create a new audio context.  The location of the API depends on the browser.
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // this souce object is the "start" of our audio stream.
    const source = this.audioCtx.createMediaStreamSource(stream);

    // Create a new instance of an audio analyser.
    // The analyser gives us things like frequency data on the incomming audio stream.
    this.analyser = this.audioCtx.createAnalyser();

    // this gives us 512 "buckets" of audio frequencies we can analyze.  Most of the upper end ones
    // are not used as much as the lower frequencies.  It makes the animation mostly empty, so we're
    // clipping them off the higher frequencies later and only using the first 64 chunks.
    // There is no science behind this. It's all what pleases the eye.  It's all art.
    this.analyser.fftSize = 1024;

    // You can chain things to the source stream using connect.
    // It's like adding plugins to the stream.
    source.connect(this.analyser);
  }

  animate() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // only show dots for the first 64 buckets.
    for (let i = 0; i < 64; i += 1) {
      const radius = (dataArray[i] / 128.0) * 50;

      // this helps smooth out the shrinking dots animation. No science here, just art.
      this.volumes[i] = Math.max(radius, (this.volumes[i] - 0.3));
      this.circles[i].setAttribute('r', this.volumes[i]);

      // our color scale goes from 0 (blue) to 100 (red)
      this.circles[i].setAttribute('fill', this.color(Math.min(100, (dataArray[i] / 128.0) * 200)));
    }

    // smoooooooth.  Close to 60fps on my computer.
    window.requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div className="App">
        <svg
          className="svg"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100%" height="100%" fill="#efefef"/>
          <Grid />
        </svg>
      </div>
    );
  }
}

export default App;
