import React from "react";
import { useState } from "react";
import { Button, InputField, decimal_test } from "./utils";
import AuthenticationPanel from "./AuthenticationPanel";

const AuthenticationPage = ({ setLogin }) => {
  const [loginPage, setLoginPage] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [error, setError] = useState("");

  const validateUsernameAndPassword = (value) => {
    const accountRegex = /^[_\-.0-9a-z]{1,127}$/;
    return accountRegex.test(value);
  };

  const validateInitialBalance = (value) => {
    const balanceRegex = /^(0|[1-9][0-9]*)\.[0-9]{2}$/;
    const maxValue = 4294967295.99;
    return balanceRegex.test(value) && parseFloat(value) <= maxValue;
  };

  const onUsernameChange = (ev) => {
    setUsername(ev.target.value);
  };

  const onPasswordChange = (ev) => {
    setPassword(ev.target.value);
  };

  const onNewUsernameChange = (ev) => {
    setNewUsername(ev.target.value);
  };

  const onNewPasswordChange = (ev) => {
    setNewPassword(ev.target.value);
  };

  const onInitialBalanceChange = (ev) => {
    setInitialBalance(ev.target.value);
  };

  const handleLoginSubmit = () => {
    if (
      !validateUsernameAndPassword(username) ||
      !validateUsernameAndPassword(password)
    ) {
      setError("invalid_input");
    } else {
      setError("");
      setLogin(true);
    }
  };

  const handleSignupSubmit = async () => {
    if (
      !validateUsernameAndPassword(newUsername) ||
      !validateUsernameAndPassword(newPassword)
    ) {
      setError("invalid_input");
    } else if (!validateInitialBalance(initialBalance)) {
      if (!decimal_test(initialBalance)) {
        setError("number must be positive and specify 2 decimal places");
      }
    } else {
      fetch("http://localhost:3001/register", {
        method: "POST",
        mode: "cors",
      })
        .then((res) => {
          console.log(res.json());
        })
        .catch((err) => {
          console.log(err.message);
        });

      setError("");
      alert("You Have been Registered");
      setLoginPage(true);
    }
  };

  const LOGIN_PAGE = {
    title: "Welcome to the most secure bank app",
    leftButton: (
      <Button type="primary" caption="Login" onClick={handleLoginSubmit} />
    ),
    rightButton: (
      <Button
        type="secondary"
        caption="Signup"
        onClick={() => {
          setLoginPage(false);
        }}
      />
    ),
    mainContent: (
      <div className="authention-inputs">
        <InputField
          title="Username"
          type="text"
          value={username}
          onChage={onUsernameChange}
          placeholder="Enter a unique username"
          key="username"
        />
        <InputField
          title="Password"
          type="password"
          value={password}
          onChage={onPasswordChange}
          placeholder="Enter password"
          key="password"
        />
      </div>
    ),
  };

  const SIGNUP_PAGE = {
    title: "Signup",
    leftButton: (
      <Button type="primary" caption="Signup" onClick={handleSignupSubmit} />
    ),
    rightButton: (
      <Button
        type="secondary"
        caption="Already have Account?"
        onClick={() => {
          setLoginPage(true);
        }}
      />
    ),
    mainContent: (
      <div className="authention-inputs">
        <InputField
          title="Create Username"
          type="text"
          value={newUsername}
          onChage={onNewUsernameChange}
          placeholder="Enter a unique username"
          key="username"
        />
        <InputField
          title="Create Password"
          type="password"
          value={newPassword}
          onChage={onNewPasswordChange}
          placeholder="Enter password"
          key="password"
        />
        <InputField
          title="Initial Balance"
          type="number"
          value={initialBalance}
          onChage={onInitialBalanceChange}
          placeholder="What is your initial Balance"
          key="balance"
        />
      </div>
    ),
  };

  return (
    <div className="authentication-content">
      {loginPage ? (
        <AuthenticationPanel {...LOGIN_PAGE} />
      ) : (
        <AuthenticationPanel {...SIGNUP_PAGE} />
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default AuthenticationPage;
