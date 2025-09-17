import { AuthPage } from "@refinedev/antd";
import { Title } from "../../components/title";

export const Login = () => {
  return (
    <AuthPage
      title={<Title />}
      type="login"
      registerLink={false}
      rememberMe={false}
      forgotPasswordLink={false}
    />
  );
};
