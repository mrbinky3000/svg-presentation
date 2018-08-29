import React from 'react';
import './App.css';

const Grid = () => {
  const rows = [];
  let i = 0;

  for(let y = 50; y < 800; y += 100) {
    const columns = [];
    for(let x = 50; x < 800; x += 100) {
      columns.push(
        <circle className="waveCircle" id={`waveCircle${i}`} key={i} cx={x} cy={y} r={25} stroke={10} />
      );
      i += 1;
    }
    rows.push(columns);
  }
  return rows;
}

class App extends React.Component {
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
