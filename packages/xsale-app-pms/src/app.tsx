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
import { authProvider } from "./providers/auth";
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

import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from "./pages/product";

import { getResources } from "./config/app";
import { OrderList, OrderShow } from "./pages/order";
import { AffiliateCreate, AffiliateList } from "./pages/affiliate";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any) => String(t(key, options) as any),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  return (
    <BrowserRouter basename="/app-pms">
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
                            fallback={<NavigateToResource resource="product" />}
                          >
                            <div className="pt-8 lg:mt-0">
                              <Outlet />
                            </div>
                          </CanAccess>
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="product" />}
                    />

                    <Route path="/product">
                      <Route index element={<ProductList />} />
                      <Route path="new" element={<ProductCreate />} />
                      <Route path=":id/edit" element={<ProductEdit />} />
                      <Route path=":id" element={<ProductShow />} />
                    </Route>

                    <Route path="/order">
                      <Route index element={<OrderList />} />
                      <Route path=":id" element={<OrderShow />} />
                    </Route>

                    <Route path="/settings" element={<Settings />} />

                    <Route path="/affiliate">
                      <Route index element={<AffiliateList />} />
                      <Route path="new" element={<AffiliateCreate />} />
                    </Route>

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
