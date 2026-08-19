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
  HomePage,
  NotFoundPage,
  ProfilePage,
  RootPage,
} from "../design/pages";
import { AnapanaPage } from "../modules/anapana/pages";
import {
  AuthDialog,
  ConfirmEmailPage,
  ForgotPasscodePage,
  ResetPasscodePage,
  SignInPage,
  SignOutPage,
  SignUpPage,
} from "../modules/auth";
import {
  PaymentCancelPage,
  PaymentPage,
  PaymentSuccessPage,
} from "../modules/payment/pages";
import { AiPage } from "../modules/ai/pages";
import {
  AdminChatMessageEditPage,
  AdminChatMessagesPage,
  AdminChatRoomEditPage,
  AdminChatRoomsPage,
  AdminNotificationsPage,
  AdminProductCreatePage,
  AdminProductEditPage,
  AdminProductsPage,
  AdminRoleCreatePage,
  AdminRoleEditPage,
  AdminRolesPage,
  AdminUserCreatePage,
  AdminUserEditPage,
  AdminUsersPage,
} from "../modules/admin";

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
              path={`${AppRoutes.client.protected.ADMIN}/`}
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
              element={
                <AdminAccessRoute
                  action="read"
                  resource="roles"
                  superAdminOnly
                />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_ROLES}
                element={<AdminRolesPage />}
              />
            </Route>
            <Route
              element={
                <AdminAccessRoute
                  action="create"
                  resource="roles"
                  superAdminOnly
                />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_ROLE_CREATE}
                element={<AdminRoleCreatePage />}
              />
            </Route>
            <Route
              element={
                <AdminAccessRoute
                  action="update"
                  resource="roles"
                  superAdminOnly
                />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_ROLE_EDIT}
                element={<AdminRoleEditPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="read" resource="rooms" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_ROOMS}
                element={<AdminChatRoomsPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="update" resource="rooms" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_ROOM_EDIT}
                element={<AdminChatRoomEditPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="read" resource="messages" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_MESSAGES}
                element={<AdminChatMessagesPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="update" resource="messages" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_CHAT_MESSAGE_EDIT}
                element={<AdminChatMessageEditPage />}
              />
            </Route>
            <Route
              element={
                <AdminAccessRoute action="read" resource="notifications" />
              }
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_NOTIFICATIONS}
                element={<AdminNotificationsPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="read" resource="products" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_PRODUCTS}
                element={<AdminProductsPage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="create" resource="products" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_PRODUCT_CREATE}
                element={<AdminProductCreatePage />}
              />
            </Route>
            <Route
              element={<AdminAccessRoute action="update" resource="products" />}
            >
              <Route
                path={AppRoutes.client.protected.ADMIN_PRODUCT_EDIT}
                element={<AdminProductEditPage />}
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
