import { Avatar, Button, Card, message, Statistic } from "antd";
import * as Icons from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Clipboard } from "../../components/clipboard";
import { useGetIdentity } from "@refinedev/core";
import { Merchant, WechatMerchantStatus } from "../../generated/graphql";

const Dashboard = () => {
  const { data: me } = useGetIdentity<Merchant>();
  return (
    <div className="flex flex-col gap-4">
      <Card title="我的店铺链接">
        <div className="mt-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-1">
              <div>https://xltzx.com/merchant/{me?.id}</div>
              <Clipboard
                value={`https://xltzx.com/merchant/${me?.id}`}
                onSuccess={() => {
                  message.success("复制成功");
                }}
                className=" text-nowrap px-2"
              >
                复制
              </Clipboard>
            </div>
            {me?.wechatMerchantStatus !== WechatMerchantStatus.Completed && (
              <div className="mt-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-500">
                    <span>
                      配置微信支付后，资金将自动提现到您的微信商户号，
                    </span>
                    <Link to="/settings">立即配置</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title="快捷导航">
        <div className="flex flex-wrap gap-8">
          <Link
            to="/order"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.GiftOutlined className="text-[32px] " />
            <div className="text-sm mt-1">订单管理</div>
          </Link>
          <Link
            to="/product"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.ProductOutlined className="text-[32px] " />
            <div className="text-sm mt-1">商品管理</div>
          </Link>
          <Link
            to="/affiliate"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.UserOutlined className="text-[32px] " />
            <div className="text-sm mt-1">推广员管理</div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
