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
  SignInPage,
  SignUpPage,
  SignOutPage,
  ConfirmEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  NotFoundPage,
  HomePage,
  RootPage,
  ProfilePage,
} from "../design/pages";
import { AuthDialog } from "../design";
import { AnapanaPage } from "../modules/anapana/pages";

export const RouteManager = () => {
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
              element={<SignInPage />}
            />
            <Route
              path={AppRoutes.client.public.SIGN_UP}
              element={<SignUpPage />}
            />
            <Route
              path={AppRoutes.client.public.CONFIRM_EMAIL}
              element={<ConfirmEmailPage />}
            />
            <Route
              path={AppRoutes.client.public.FORGOT_PASSWORD}
              element={<ForgotPasswordPage />}
            />
            <Route
              path={AppRoutes.client.public.RESET_PASSWORD}
              element={<ResetPasswordPage />}
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
              element={<SignOutPage />}
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
