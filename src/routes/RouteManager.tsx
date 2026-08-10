// src/routes/RouteManager.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { AdminAccessRoute, AdminHomeRoute, ProtectedRoute, PublicRoute } from ".";
import {
  SignInPage,
  SignUpPage,
  SignOutPage,
  ConfirmEmailPage,
  ForgotPasscodePage,
  ResetPasscodePage,
  NotFoundPage,
  HomePage,
  RootPage,
  ProfilePage,
  PaymentPage,
  PaymentSuccessPage,
  PaymentCancelPage,
  AiPage,
  AdminChatMessageEditPage,
  AdminChatRoomsPage,
  AdminChatRoomEditPage,
  AdminChatMessagesPage,
  AdminUsersPage,
  AdminUserCreatePage,
  AdminUserEditPage,
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
              path={AppRoutes.client.public.FORGOT_PASSCODE}
              element={<ForgotPasscodePage />}
            />
            <Route
              path={AppRoutes.client.public.RESET_PASSCODE}
              element={<ResetPasscodePage />}
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
            <Route
              path={AppRoutes.client.protected.PAYMENT}
              element={<PaymentPage />}
            />
            <Route
              path={AppRoutes.client.protected.PAYMENT_SUCCESS}
              element={<PaymentSuccessPage />}
            />
            <Route
              path={AppRoutes.client.protected.PAYMENT_CANCEL}
              element={<PaymentCancelPage />}
            />
            <Route path={AppRoutes.client.protected.AI} element={<AiPage />} />
            <Route
              path={AppRoutes.client.protected.ADMIN}
              element={<AdminHomeRoute />}
            />
            <Route
              element={<AdminAccessRoute action="read" resource="users" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_USERS}
                element={<AdminUsersPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="create" resource="users" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_USER_CREATE}
                element={<AdminUserCreatePage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="update" resource="users" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_USER_EDIT}
                element={<AdminUserEditPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="read" resource="chat_rooms" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_ROOMS}
                element={<AdminChatRoomsPage />}
              />
            </Route>
            <Route
              element={
                <AdminAccessRoute action="update" resource="chat_rooms" />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_ROOM_EDIT}
                element={<AdminChatRoomEditPage />}
              />
            </Route>
            <Route
              element={
                <AdminAccessRoute action="read" resource="chat_messages" />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_MESSAGES}
                element={<AdminChatMessagesPage />}
              />
            </Route>
            <Route
              element={
                <AdminAccessRoute action="update" resource="chat_messages" />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_MESSAGE_EDIT}
                element={<AdminChatMessageEditPage />}
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};
