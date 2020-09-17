import React, { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import UserKit from "./data/UserKit";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [organisationKind, setOrganisationKind] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const history = useHistory();
  const searchString = history.location.search;
  const urlParameters = new URLSearchParams(searchString);

  const [uid, setUid] = useState(urlParameters.get("uid"));
  const [token, setToken] = useState(urlParameters.get("token"));

  const userKit = new UserKit();

  console.log(uid, token);

  function handleActivateUser() {
    userKit.activateUser(uid, token).then(() => {
      setUid(null);
      setToken(null);
      history.push("/login");
    });
  }
  function handleLogin() {
    userKit
      .login(loginEmail, loginPassword)
      .then((res) => res.json())
      .then((data) => {
        userKit.setToken(data.token);
        history.push("/home");
      });
  }

  function handleRegister() {
    userKit.register(
      firstName,
      lastName,
      email,
      password,
      organisationName,
      organisationKind
    );
  }

  function renderInput(placeholder, stateVariable, stateSetVariable) {
    return (
      <div>
        <label>{placeholder}</label>
        <input
          placeholder={placeholder}
          value={stateVariable}
          onChange={(e) => stateSetVariable(e.target.value)}
        />
      </div>
    );
  }
  function getCustomerList() {
    userKit
      .getCustomerList()
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div>
      <h1>Business Project</h1>
      <Switch>
        <Route path="/home">
          <div>
            <button onClick={getCustomerList}>Customer List</button>
          </div>
        </Route>
        <Route path="/login">
          {uid && token ? (
            <div>
              <h2>Activate Account</h2>
              <button onClick={handleActivateUser}>Activate User</button>
            </div>
          ) : (
            <div>
              <h2>Login</h2>
              <input
                placeholder="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
        </Route>
        <Route path="/">
          <h2>Register</h2>
          <p>Enter details to register</p>

          {renderInput("First Name", firstName, setFirstName)}
          {renderInput("Last Name", lastName, setLastName)}
          {renderInput("Email", email, setEmail)}
          {renderInput("Password", password, setPassword)}
          {renderInput(
            "Organisation Name",
            organisationName,
            setOrganisationName
          )}
          {renderInput(
            "Organisation Kind",
            organisationKind,
            setOrganisationKind
          )}

          <button onClick={handleRegister}>Register</button>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
