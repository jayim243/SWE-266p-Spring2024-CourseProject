import React from "react";
import { Button } from "./utils";
import BankPanel from "./BankPanel";

const Bank = ({ setLogin }) => {
  return (
    <div>
      <p>Welcome {"{username}"}</p>
      <p className="balance">Your current balance: $69</p>

      <div className="panel-wrapper">
        <BankPanel />
        <BankPanel />
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
