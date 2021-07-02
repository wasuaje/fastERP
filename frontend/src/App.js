import logo from './logo.svg';
import './App.css';
import Cookies from "js-cookie";
import API from "./api";

function App() {
	var error = "";

     API("cash/", "get")
			.then((data) => {
				console.log("data:", data);
			})
			.catch((err) => {
				error = err;
				console.log("Error getting data: ", error.response);
            });

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
