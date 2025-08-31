import { Authenticated, CanAccess, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { ConfigProvider as AntdConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/es/locale/zh_CN"; // 中文
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  authProvider,
  TOKEN_KEY,
  TOKEN_EXPIRATION_KEY,
} from "./providers/auth";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Settings } from "./pages/settings";

import { dataProvider } from "./providers/data";
import type { I18nProvider } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { Title } from "./components/title";

import { ProductList } from "./pages/product";

import { getResources } from "./config/app";

import { OrderList, OrderShow } from "./pages/order";
import Dashboard from "./pages/dashboard";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useEffect } from "react";

// 处理 URL 中的 token 组件
function TokenHandler() {
  useEffect(() => {
    // 检查 URL 查询参数中是否有 token
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      // 设置 token 到 cookie 中，过期时间设为 7 天
      const expires = dayjs().add(7, "days").toDate();
      Cookies.set(TOKEN_KEY, urlToken, { expires });
      Cookies.set(TOKEN_EXPIRATION_KEY, expires.toString(), { expires });
    }
  }, []);

  return null;
}

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any) => String(t(key, options) as any),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  return (
    <BrowserRouter basename="/app-crm">
      <TokenHandler />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdConfigProvider locale={zhCN}>
            <AntdApp>
              <Refine
                i18nProvider={i18nProvider}
                dataProvider={dataProvider()}
                notificationProvider={useNotificationProvider}
                authProvider={authProvider}
                routerProvider={routerBindings}
                resources={getResources()}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  title: { text: t("title"), icon: <AppIcon /> },
                  disableTelemetry: true,
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => (
                            <ThemedSiderV2 {...props} Title={Title} fixed />
                          )}
                        >
                          <CanAccess
                            fallback={<NavigateToResource resource="/" />}
                          >
                            <div className="pt-8 lg:mt-0">
                              <Outlet />
                            </div>
                          </CanAccess>
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="/product">
                      <Route index element={<ProductList />} />
                    </Route>

                    <Route path="/order">
                      <Route index element={<OrderList />} />
                      <Route path=":id" element={<OrderShow />} />
                    </Route>

                    <Route path="/settings" element={<Settings />} />

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={() => t("title")} />
              </Refine>
            </AntdApp>
          </AntdConfigProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
