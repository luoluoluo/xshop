import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import { Layout as AntdLayout, Space, Switch, theme, Typography } from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "@refinedev/core";
import { Button, Dropdown } from "antd";
// import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";
import { User } from "../../generated/graphql";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<User>();
  const { mode, setMode } = useContext(ColorModeContext);
  // const { i18n } = useTranslation();
  const { getLocale, changeLocale } = useTranslation();
  const currentLocale = getLocale();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Space style={{ marginLeft: "8px" }} size="middle">
          <Text strong>{user?.name || user?.slug || user?.id}</Text>
        </Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Dropdown
          className="hidden"
          menu={{
            items: languages.map((lang) => ({
              key: lang.value,
              label: lang.label,
              onClick: () => {
                changeLocale(lang.value);
                window.location.reload();
              },
            })),
          }}
        >
          <Button type="link">
            <Space>
              {/* <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} /> */}
              {languages.find((lng) => lng.value === currentLocale)?.label}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};
