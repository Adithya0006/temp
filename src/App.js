import logo from './logo.svg';
import './App.css';
import Outer from './V2/Outer';
import Forms from './V2/Forms';
import Layout from './V2/Layout';
import Chartgpt from './V2/Chatgpt';

function App() {
  function T1(buffer){
    console.log("buffer 1  called!",buffer);

  }
  return (
    <>

      {/* <Forms></Forms> */}
      {/* <Layout T2={T1}></Layout> */}
      <Chartgpt></Chartgpt>
    </>
  );
}

export default App;
