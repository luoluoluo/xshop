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
// import { Register } from "./pages/register";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/user";
import { RoleCreate, RoleEdit, RoleList, RoleShow } from "./pages/role";

import { accessControlProvider } from "./providers/acl";

import { dataProvider } from "./providers/data";
import type { I18nProvider } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { Title } from "./components/title";

import { getResources } from "./config/app";

import { ArticleCreate, ArticleEdit, ArticleList } from "./pages/article";
import { WithdrawalList } from "./pages/withdrawal";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any) => String(t(key, options) as any),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  return (
    <BrowserRouter basename="/admin">
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdConfigProvider locale={zhCN}>
            <AntdApp>
              <Refine
                i18nProvider={i18nProvider}
                dataProvider={dataProvider()}
                notificationProvider={useNotificationProvider}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                routerProvider={routerBindings}
                resources={getResources()}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  title: { text: t("title"), icon: <AppIcon /> },
                  disableTelemetry: true,
                  reactQuery: {
                    clientConfig: {
                      defaultOptions: {
                        queries: {
                          refetchOnWindowFocus: false,
                          retry: false,
                        },
                        mutations: {
                          retry: false,
                        },
                      },
                    },
                  },
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
                    <Route path="/user">
                      <Route index element={<UserList />} />
                      <Route path="new" element={<UserCreate />} />
                      <Route path=":id/edit" element={<UserEdit />} />
                      <Route path=":id" element={<UserShow />} />
                    </Route>
                    <Route path="/role">
                      <Route index element={<RoleList />} />
                      <Route path="new" element={<RoleCreate />} />
                      <Route path=":id/edit" element={<RoleEdit />} />
                      <Route path=":id" element={<RoleShow />} />
                    </Route>

                    <Route path="/article">
                      <Route index element={<ArticleList />} />
                      <Route path="new" element={<ArticleCreate />} />
                      <Route path=":id/edit" element={<ArticleEdit />} />
                    </Route>

                    <Route path="/withdrawal">
                      <Route index element={<WithdrawalList />} />
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
                    {/* <Route path="/register" element={<Register />} /> */}
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
