import { useState } from "react";
import Bank from "./components/Bank";
import AuthenticationPage from "./components/AuthenticationPage";
import "./App.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <div className="App">
      <h1>Bank App</h1>

      {loggedIn ? (
        <Bank setLogin={setLoggedIn} />
      ) : (
        <AuthenticationPage setLogin={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
