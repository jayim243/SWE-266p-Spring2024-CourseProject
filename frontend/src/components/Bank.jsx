import React, { useState, useEffect } from "react";
import { Button, InputField, decimal_test } from "./utils";
import BankPanel from "./BankPanel";

const Bank = ({ setLogin }) => {
  const [balance, setBalance] = useState(null);
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");

  const onChangeWithdraw = (ev) => {
    setWithdraw(ev.target.value);
  };

  const onChangeDeposit = (ev) => {
    setDeposit(ev.target.value);
  };

  const onDeposit = () => {
    if (decimal_test(deposit)) {
      fetch("http://localhost:3001/deposit", {
        mode: "cors",
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: deposit,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setBalance(res.balance);
          setDeposit("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("invalid deposit value");
    }
  };

  const onWithdraw = () => {
    if (decimal_test(withdraw)) {
      fetch("http://localhost:3001/withdraw", {
        mode: "cors",
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: withdraw,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) alert(res.error);
          else {
            setBalance(res.balance);
            setWithdraw("");
            alert("withdrew!");
          }
        });
    } else {
      alert("invalid withdrawal value");
    }
  };

  const DEPOSIT_PANEL = {
    title: "Deposit",
    input: (
      <InputField
        title="How many $ do you want to deposit"
        placeholder="Enter $"
        type="number"
        value={deposit}
        onChage={onChangeDeposit}
      />
    ),
    button: <Button type="primary" caption="Deposit" onClick={onDeposit} />,
  };

  const WITHDRAWAL_PANEL = {
    title: "Withdraw",
    input: (
      <InputField
        title="How many $ do you want to withdraw"
        placeholder="Enter $"
        type="number"
        value={withdraw}
        onChage={onChangeWithdraw}
      />
    ),
    button: <Button type="primary" caption="Withdraw" onClick={onWithdraw} />,
  };

  useEffect(() => {
    fetch("http://localhost:3001/balance", {
      method: "GET",
      mode: "cors",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setBalance(res.balance);
      });
  }, [balance]);

  return (
    <div className="bank">
      <p>
        Welcome <b>{localStorage.getItem("username")}</b>
      </p>
      <p className="balance">Your current balance: {balance?.toFixed(2)}</p>

      <div className="panel-wrapper">
        <BankPanel {...DEPOSIT_PANEL} />
        <BankPanel {...WITHDRAWAL_PANEL} />
      </div>

      <Button
        type="primary"
        caption="Logout"
        onClick={() => {
          setLogin(false);
          localStorage.setItem("username", null);
          localStorage.setItem("token", null);
        }}
      />
    </div>
  );
};

export default Bank;
