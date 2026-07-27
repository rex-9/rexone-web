import AppRoutes from "../AppRoutes";
import { ProtectedRoute, PublicRoute } from ".";
import { Outlet } from "react-router-dom";
import { AuthDialog } from "../design/molecules";
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
  PaymentPage,
  PaymentStatusPage,
} from "../design/pages";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
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
            <Route
              path={`${AppRoutes.client.public.PAYMENT_STATUS}/:orderId`}
              element={<PaymentStatusPage />}
            />
          <Route element={<AnapanaPage />} /> {/* // ANAPANA MODULE */}
          <Route element={<ProtectedRoute />}>
            <Route
              path={AppRoutes.client.public.PAYMENT}
              element={<PaymentPage />}
            />
            <Route
              path={AppRoutes.client.protected.SIGN_OUT}
              element={<SignOut />}
            />
            <Route
              path={AppRoutes.client.protected.HOME}
              element={<HomePage />}
            />
            <Route
              path={AppRoutes.client.protected.PROFILE}
              element={<ProfilePage />}
            />
          </Route>
          <Route element={<PublicRoute />}>
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
            <Route
              path={AppRoutes.client.public.SIGN_IN}
              element={<SignIn />}
            />
            <Route
              path={AppRoutes.client.public.SIGN_UP}
              element={<SignUp />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default RouteManager;
