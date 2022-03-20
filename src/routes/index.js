import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { UserContext } from "../context/AppContext";

const LIST_ROUTES_PRIVATE = [
  {
    path: "*",
    component: React.lazy(() => import("../containers/NotMatchPage")),
  },
  {
    path: "/",
    component: React.lazy(() => import("../containers/Homepage")),
  },
  {
    path: "/homepage",
    component: React.lazy(() => import("../containers/Homepage")),
  },
  {
    path: "/department-management",
    component: React.lazy(() => import("../containers/DepartmentManagement")),
  },
  {
    path: "/user-management",
    component: React.lazy(() => import("../containers/UserManagement")),
  },
  {
    path: "/tag-management",
    component: React.lazy(() => import("../containers/TagManagement")),
  },
];
const LIST_ROUTES_PUBLIC = [
  {
    path: "/login",
    component: React.lazy(() => import("../containers/Login")),
  },
  {
    path: "/signin",
    component: React.lazy(() => import("../containers/Login")),
  },
];

export function ListRoute() {
  const { state, setState } = useContext(UserContext);
  const publicRoute = () => {
    return LIST_ROUTES_PUBLIC.map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <PrivateRoute>
                <route.component />
              </PrivateRoute>
            </React.Suspense>
          }
        />
      );
    });
  };
  const privateRoute = () => {
    return LIST_ROUTES_PRIVATE.map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <Sidebar>
                <PublicRoute>
                  <route.component />
                </PublicRoute>
              </Sidebar>
            </React.Suspense>
          }
        />
      );
    });
  };
  if (state.loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <>
      <Routes>
        {publicRoute()}
        {privateRoute()}
      </Routes>
    </>
  );
}
