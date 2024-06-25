import './App.css';
import Scene from './components/Particles/Particles';

function App() {
  return (
    <div className="app-container">
      <img className='cover-logo' src="./Tata_Comm_logo.svg" alt="" />
      <h1 className='re'>Re</h1>
      <p className='cover-subtitle'>Integrated <br />Report 2023-24</p>
      <div className="scene-container">
      <h1 className='imagine'>imagine</h1>
        <Scene />
      </div>
    </div>
  );
}

export default App;
