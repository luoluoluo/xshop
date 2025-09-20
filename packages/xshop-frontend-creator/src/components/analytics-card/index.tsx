import { useState, useEffect } from "react";
import { Card, Tabs, Statistic, Row, Col, Spin, message } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getAnalyticsStats } from "../../requests/analytics";
import { getDateRange, formatDateRange } from "../../utils/date";
import { AnalyticsStats } from "../../generated/graphql";
import { Link } from "react-router";

type TabType = "day" | "week" | "month";

interface AnalyticsData {
  current: AnalyticsStats;
  previous: AnalyticsStats;
}

const AnalyticsCard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("day");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchData = async (type: TabType) => {
    setLoading(true);
    try {
      const dateRange = getDateRange(type);

      // 并行获取当前期间和对比期间的数据
      const [currentData, previousData] = await Promise.all([
        getAnalyticsStats({
          where: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        }),
        getAnalyticsStats({
          where: {
            startDate: dateRange.previousStartDate,
            endDate: dateRange.previousEndDate,
          },
        }),
      ]);

      setData({
        current: currentData,
        previous: previousData,
      });
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      message.error("获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const formatLabels = formatDateRange(activeTab);

  const renderStatistic = (
    title: string,
    currentValue: number,
    previousValue: number,
    formatter?: (value: any) => React.ReactNode,
  ) => {
    const change = currentValue - previousValue;
    const changePercent =
      previousValue > 0 ? (change / previousValue) * 100 : 0;
    const isPositive = change >= 0;

    return (
      <Statistic
        title={title}
        value={currentValue}
        formatter={formatter}
        valueStyle={{ color: "#3f8600" }}
        prefix={
          change !== 0 ? (
            isPositive ? (
              <ArrowUpOutlined style={{ color: "#3f8600" }} />
            ) : (
              <ArrowDownOutlined style={{ color: "#cf1322" }} />
            )
          ) : null
        }
        suffix={
          change !== 0 ? (
            <span
              style={{
                color: isPositive ? "#3f8600" : "#cf1322",
                fontSize: "12px",
              }}
            >
              {isPositive ? "+" : ""}
              {changePercent.toFixed(1)}%
            </span>
          ) : null
        }
      />
    );
  };

  const tabItems = [
    {
      key: "day",
      label: "日",
    },
    {
      key: "week",
      label: "周",
    },
    {
      key: "month",
      label: "月",
    },
  ];

  return (
    <Card
      title="数据统计"
      className="mb-4"
      extra={<Link to="/view">查看访问记录</Link>}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabType)}
        items={tabItems}
      />

      <Spin spinning={loading}>
        {data && (
          <div className="mt-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                {renderStatistic(
                  `浏览量 (${formatLabels.current})`,
                  data.current.pv,
                  data.previous.pv,
                )}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderStatistic(
                  `访客数 (${formatLabels.current})`,
                  data.current.uv,
                  data.previous.uv,
                )}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderStatistic(
                  `订单数 (${formatLabels.current})`,
                  data.current.orderCount,
                  data.previous.orderCount,
                )}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderStatistic(
                  `订单金额 (${formatLabels.current})`,
                  data.current.orderAmount,
                  data.previous.orderAmount,
                  (value) => `¥${value.toFixed(2)}`,
                )}
              </Col>
            </Row>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default AnalyticsCard;
