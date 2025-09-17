import { Card, Layout } from "antd";
import { Title } from "../../components/title";
import { WechatLogin } from "../../components/wechat-login";

const { Content } = Layout;

export const Login = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <Title />
        </div>
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <WechatLogin />
        </Card>
      </Content>
    </Layout>
  );
};
