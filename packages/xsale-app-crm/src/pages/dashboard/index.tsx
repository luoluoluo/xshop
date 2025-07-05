import { Card, message, Statistic } from "antd";
import * as Icons from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Clipboard } from "../../components/clipboard";
import { useGetIdentity } from "@refinedev/core";
import { Affiliate } from "../../generated/graphql";

const Dashboard = () => {
  const { data: me } = useGetIdentity<Affiliate>();
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card title="我的推广ID">
        <div className="mt-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-1">
              <div>{me!.id}</div>
              <Clipboard
                value={me!.id}
                onSuccess={() => {
                  message.success("推广ID复制成功");
                }}
                className=" text-nowrap px-2"
              >
                复制
              </Clipboard>
            </div>
          </div>
        </div>
      </Card>

      <Card title="快捷导航">
        <div className="flex flex-wrap gap-8">
          <Link
            to="/order/order/list"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.GiftOutlined className="text-[32px] " />
            <div className="text-sm mt-1">订单管理</div>
          </Link>
          <Link
            to="/product/sku/list"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.ProductOutlined className="text-[32px] " />
            <div className="text-sm mt-1">产品管理</div>
          </Link>
          <Link
            to="/content/banner/list"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.FileDoneOutlined className="text-[32px] " />
            <div className="text-sm mt-1">广告图管理</div>
          </Link>
          <Link
            to="/system/business-card/edit"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.SettingOutlined className="text-[32px] " />
            <div className="text-sm mt-1">名片设置</div>
          </Link>
        </div>
      </Card>

      <Card title="仪表盘">
        <div className="flex flex-wrap gap-8 mt-8">
          <div className="flex flex-col text-gray-700">
            <Statistic title="余额" value={me?.balance || 0} />
            <Link
              to="/affiliate-withdrawal/new"
              className="mt-4"
              type="primary"
            >
              申请提现
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
