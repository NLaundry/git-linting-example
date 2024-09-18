import logo from "./logo.svg";
import "./App.css";

        function bad_promise() {
Promise.reject("something bad happened");

  Promise.reject(5);

          Promise.reject();

  new Promise(function (resolve, reject) {
    reject("something bad happened");
  });

          new Promise(function (resolve, reject) {
    reject();
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
