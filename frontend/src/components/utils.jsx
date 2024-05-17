import "./utils.css";

const AuthenticationTitle = ({ title }) => (
  <p className="authentication-title">{title}</p>
);

const decimal_test = x => !isNaN(+x) && Boolean(x.match(/\...$/) && x > 0);


const Button = ({ type, caption, onClick }) => (
  <button className={`btn-${type}`} onClick={onClick}>
    {caption}
  </button>
);

const InputField = ({
  title,
  type,
  placeholder = "Enter value",
  onChage,
  value,
  error = false,
}) => {
  return (
    <div className="input-wrapper">
      <p className="input-title">{title}</p>
      <input
        className="form-input"
        value={value}
        type={type}
        onChange={onChage}
        placeholder={placeholder}
      />
    </div>
  );
};

const Callout = ({ text, visible = true, type }) => {
  if (visible) return <div className={`callout-${type}`}>{text}</div>;

  return <></>;
};

export { AuthenticationTitle, Button, Callout, InputField, decimal_test };
