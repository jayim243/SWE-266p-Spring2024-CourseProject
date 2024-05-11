import { AuthenticationTitle } from "./utils";

const AuthenticationPanel = ({
  title,
  leftButton,
  rightButton,
  mainContent,
}) => {
  return (
    <div className="authentication-wrapper">
      <AuthenticationTitle title={title} />

      {mainContent}

      <div className="bottom-buttons">
        {leftButton} {rightButton}
      </div>
    </div>
  );
};

export default AuthenticationPanel;
