// src/routes/RouteManager.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { ProtectedRoute, PublicRoute } from ".";
import {
  SignIn,
  SignUp,
  SignOut,
  ConfirmEmail,
  ForgotPassword,
  ResetPassword,
  NotFoundPage,
  HomePage,
  RootPage,
  ProfilePage,
} from "../design/pages";
import { AuthDialog } from "../design";
import { AnapanaPage } from "../modules/anapana/pages";

const RouteManager = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={
          <>
            <AuthDialog />
            <Outlet />
          </>
        }
      >
        <Route path={AppRoutes.client.public.ROOT}>
          <Route index element={<RootPage />} />
          <Route path="anapana" element={<AnapanaPage />} />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route
              path={AppRoutes.client.public.SIGN_IN}
              element={<SignIn />}
            />
            <Route
              path={AppRoutes.client.public.SIGN_UP}
              element={<SignUp />}
            />
            <Route
              path={AppRoutes.client.public.CONFIRM_EMAIL}
              element={<ConfirmEmail />}
            />
            <Route
              path={AppRoutes.client.public.FORGOT_PASSWORD}
              element={<ForgotPassword />}
            />
            <Route
              path={AppRoutes.client.public.RESET_PASSWORD}
              element={<ResetPassword />}
            />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path={AppRoutes.client.protected.HOME}
              element={<HomePage />}
            />
            <Route
              path={AppRoutes.client.protected.PROFILE}
              element={<ProfilePage />}
            />
            <Route
              path={AppRoutes.client.protected.SIGN_OUT}
              element={<SignOut />}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default RouteManager;
