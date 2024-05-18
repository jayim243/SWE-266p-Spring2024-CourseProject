import React, { useState } from "react";
import { Button, InputField, decimal_test } from "./utils";
import BankPanel from "./BankPanel";

const Bank = ({ setLogin }) => {
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
      alert("Deposited!");
    } else {
      alert("invalid deposit value");
    }
  };
  const onWithdraw = () => {
    if (decimal_test(withdraw)) {
      alert("withdrew!");
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

  return (
    <div className="bank">
      <p>Welcome {"{username}"}</p>
      <p className="balance">Your current balance: $69</p>

      <div className="panel-wrapper">
        <BankPanel {...DEPOSIT_PANEL} />
        <BankPanel {...WITHDRAWAL_PANEL} />
      </div>

      <Button
        type="primary"
        caption="Logout"
        onClick={() => {
          setLogin(false);
        }}
      />
    </div>
  );
};

export default Bank;
