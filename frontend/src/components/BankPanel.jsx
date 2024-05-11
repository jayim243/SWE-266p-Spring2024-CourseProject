import {} from "./utils";

const Bank = ({ title, input, button, callout }) => {
  return (
    <div className="bank-panel">
      <p className="bank-panel-title">{title}</p>

      {input}
      {button}

      {callout}
    </div>
  );
};

export default Bank;
