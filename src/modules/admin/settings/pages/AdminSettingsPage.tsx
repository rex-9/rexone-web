import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import AppRoutes from "../../../../AppRoutes";
import atoms from "../../../../atoms";
import { iconsLib } from "../../../../assets";
import { useAuth } from "../../../../contexts";
import {
  Badge,
  Button,
  PageHeader,
  ProfileAvatar,
} from "../../../../design";
import {
  BadgeVariants,
  ButtonTypes,
  ButtonVariants,
  ComponentSizes,
  ThemeVariants,
  type ThemeVariant,
} from "../../../../design/constants";
import { cn } from "../../../../design/helpers";
import {
  useBrowserTimeZone,
  usePermissions,
  useSocket,
} from "../../../../hooks";
import { AppLocales, i18n, useTranslate } from "../../../../locales";

export const AdminSettingsPage: React.FC = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isSuperAdmin, permissions } = usePermissions();
  const { isConnected } = useSocket();
  const { timeZone, utcOffset } = useBrowserTimeZone();

  const [theme, setTheme] = useAtom(atoms.themeAtom);
  const [locale, setLocale] = useAtom(atoms.localeAtom);

  const resolvedTheme: ThemeVariant =
    theme === ThemeVariants.NIGHT ? ThemeVariants.NIGHT : ThemeVariants.DAY;

  const displayName = useMemo(
    () =>
      currentUser?.name ||
      currentUser?.username ||
      currentUser?.email ||
      t(AppLocales.Admin.Layout.DefaultAdminUser),
    [currentUser, t],
  );

  const roleNames = useMemo(
    () =>
      currentUser?.iam?.roles?.map((role) => role.attributes.name) ?? [],
    [currentUser?.iam?.roles],
  );

  const handleThemeSelect = (nextTheme: ThemeVariant) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleLanguageSelect = (nextLocale: string) => {
    setLocale(nextLocale);
    void i18n.changeLanguage(nextLocale);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Settings.Title)}
        description={t(AppLocales.Admin.Settings.Description)}
      />

      {/* 1. Administrator Account & Session (Moved from Sidebar Footer) */}
      <div className="rounded-2xl border border-glass-border bg-glass-card p-6 shadow-glass-card backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-h5 font-display font-semibold text-base-content">
            {t(AppLocales.Admin.Settings.AccountSectionTitle)}
          </h2>
          <p className="mt-1 text-body-s text-base-content/70">
            {t(AppLocales.Admin.Settings.AccountSectionDesc)}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <ProfileAvatar
              src={currentUser?.avatar_url}
              alt={displayName}
              size={ComponentSizes.LG}
              className="shrink-0"
            />
            <div className="min-w-0 space-y-1">
              <div className="text-caption font-semibold uppercase tracking-wider text-primary">
                {t(AppLocales.Admin.Layout.SignedInAs)}
              </div>
              <div className="truncate text-h5 font-semibold text-base-content">
                {displayName}
              </div>
              <div className="truncate text-body-s text-base-content/70">
                {currentUser?.email}
                {currentUser?.username ? ` · @${currentUser.username}` : ""}
              </div>
              {roleNames.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {roleNames.map((roleName) => (
                    <Badge
                      key={roleName}
                      variant={
                        roleName === "super_admin"
                          ? BadgeVariants.SUCCESS
                          : BadgeVariants.INFO
                      }
                    >
                      {roleName}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type={ButtonTypes.BUTTON}
              variant={ButtonVariants.GLASS}
              size={ComponentSizes.MD}
              className="gap-2 rounded-xl border border-glass-border bg-glass-card text-base-content hover:border-primary/40 hover:bg-primary/15 hover:text-primary"
              onClick={() => navigate(AppRoutes.client.protected.HOME)}
            >
              <iconsLib.home className="h-4 w-4 shrink-0" />
              <span>{t(AppLocales.Common.Home)}</span>
            </Button>

            <Button
              type={ButtonTypes.BUTTON}
              variant={ButtonVariants.GLASS}
              size={ComponentSizes.MD}
              className="gap-2 rounded-xl border border-glass-border bg-glass-card text-base-content hover:border-glass-border-hover hover:bg-glass-card-hover"
              onClick={() => navigate(AppRoutes.client.protected.PROFILE)}
            >
              <iconsLib.pencilSquare className="h-4 w-4 shrink-0" />
              <span>{t(AppLocales.Admin.Settings.EditProfile)}</span>
            </Button>

            <Button
              type={ButtonTypes.BUTTON}
              variant={ButtonVariants.GLASS}
              size={ComponentSizes.MD}
              className="gap-2 rounded-xl border border-error/30 bg-error/10 text-error hover:border-error/50 hover:bg-error/20"
              onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
            >
              <iconsLib.logout className="h-4 w-4 shrink-0" />
              <span>{t(AppLocales.Auth.SignOut)}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Appearance & Visual Comfort */}
      <div className="rounded-2xl border border-glass-border bg-glass-card p-6 shadow-glass-card backdrop-blur-xl space-y-6">
        <div>
          <h2 className="text-h5 font-display font-semibold text-base-content">
            {t(AppLocales.Admin.Settings.AppearanceSectionTitle)}
          </h2>
          <p className="mt-1 text-body-s text-base-content/70">
            {t(AppLocales.Admin.Settings.AppearanceSectionDesc)}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-body-m font-semibold text-base-content">
              {t(AppLocales.Admin.Settings.ThemeLabel)}
            </div>
            <p className="text-body-s text-base-content/70">
              {t(AppLocales.Admin.Settings.ThemeDesc)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => handleThemeSelect(ThemeVariants.NIGHT)}
              className={cn(
                "flex items-start gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer",
                resolvedTheme === ThemeVariants.NIGHT
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30 shadow-glass-card"
                  : "border-glass-border bg-glass-card hover:border-glass-border-hover hover:bg-glass-card-hover",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                  resolvedTheme === ThemeVariants.NIGHT
                    ? "border-primary/40 bg-primary/20 text-primary"
                    : "border-glass-border bg-base-200/60 text-base-content/70",
                )}
              >
                <iconsLib.moon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-m font-semibold text-base-content">
                    {t(AppLocales.Admin.Settings.ThemeNightTitle)}
                  </span>
                  {resolvedTheme === ThemeVariants.NIGHT && (
                    <iconsLib.check className="h-5 w-5 shrink-0 text-primary" />
                  )}
                </div>
                <p className="mt-1 text-body-s text-base-content/70">
                  {t(AppLocales.Admin.Settings.ThemeNightDesc)}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleThemeSelect(ThemeVariants.DAY)}
              className={cn(
                "flex items-start gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer",
                resolvedTheme === ThemeVariants.DAY
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30 shadow-glass-card"
                  : "border-glass-border bg-glass-card hover:border-glass-border-hover hover:bg-glass-card-hover",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                  resolvedTheme === ThemeVariants.DAY
                    ? "border-primary/40 bg-primary/20 text-primary"
                    : "border-glass-border bg-base-200/60 text-base-content/70",
                )}
              >
                <iconsLib.sun className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-m font-semibold text-base-content">
                    {t(AppLocales.Admin.Settings.ThemeDayTitle)}
                  </span>
                  {resolvedTheme === ThemeVariants.DAY && (
                    <iconsLib.check className="h-5 w-5 shrink-0 text-primary" />
                  )}
                </div>
                <p className="mt-1 text-body-s text-base-content/70">
                  {t(AppLocales.Admin.Settings.ThemeDayDesc)}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Workspace & Localization */}
      <div className="rounded-2xl border border-glass-border bg-glass-card p-6 shadow-glass-card backdrop-blur-xl space-y-6">
        <div>
          <h2 className="text-h5 font-display font-semibold text-base-content">
            {t(AppLocales.Admin.Settings.WorkspaceSectionTitle)}
          </h2>
          <p className="mt-1 text-body-s text-base-content/70">
            {t(AppLocales.Admin.Settings.WorkspaceSectionDesc)}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-body-m font-semibold text-base-content">
              {t(AppLocales.Admin.Settings.LanguageLabel)}
            </div>
            <p className="text-body-s text-base-content/70">
              {t(AppLocales.Admin.Settings.LanguageDesc)}
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-glass-border bg-base-200/40 p-1">
            <button
              type="button"
              onClick={() => handleLanguageSelect("en")}
              className={cn(
                "rounded-lg px-3.5 py-2 text-body-s font-semibold transition-all cursor-pointer",
                locale === "en"
                  ? "bg-primary text-primary-content shadow-xs"
                  : "text-base-content/70 hover:text-base-content",
              )}
            >
              🇺🇸 English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageSelect("my")}
              className={cn(
                "rounded-lg px-3.5 py-2 text-body-s font-semibold transition-all cursor-pointer",
                locale === "my"
                  ? "bg-primary text-primary-content shadow-xs"
                  : "text-base-content/70 hover:text-base-content",
              )}
            >
              🇲🇲 မြန်မာ
            </button>
          </div>
        </div>
      </div>

      {/* 4. Environment & Access Diagnostics */}
      <div className="rounded-2xl border border-glass-border bg-glass-card p-6 shadow-glass-card backdrop-blur-xl space-y-5">
        <div>
          <h2 className="text-h5 font-display font-semibold text-base-content">
            {t(AppLocales.Admin.Settings.SystemInfoTitle)}
          </h2>
          <p className="mt-1 text-body-s text-base-content/70">
            {t(AppLocales.Admin.Settings.SystemInfoDesc)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-glass-border bg-base-200/30 p-4">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-base-content/60">
              <iconsLib.clock className="h-4 w-4 text-primary" />
              <span>{t(AppLocales.Common.LocalTimeZone)}</span>
            </div>
            <div className="mt-2 text-body-m font-semibold text-base-content">
              {utcOffset} · {timeZone}
            </div>
          </div>

          <div className="rounded-xl border border-glass-border bg-base-200/30 p-4">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-base-content/60">
              {isConnected ? (
                <iconsLib.wifi className="h-4 w-4 text-success" />
              ) : (
                <iconsLib.wifiOff className="h-4 w-4 text-warning" />
              )}
              <span>{t(AppLocales.Admin.Settings.SocketStatusLabel)}</span>
            </div>
            <div className="mt-2 text-body-m font-semibold text-base-content">
              {isConnected
                ? t(AppLocales.Admin.Settings.SocketConnected)
                : t(AppLocales.Admin.Settings.SocketDisconnected)}
            </div>
          </div>

          <div className="rounded-xl border border-glass-border bg-base-200/30 p-4">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-base-content/60">
              <iconsLib.shieldCheck className="h-4 w-4 text-primary" />
              <span>{t(AppLocales.Admin.Settings.AccessScopeLabel)}</span>
            </div>
            <div className="mt-2 text-body-m font-semibold text-base-content">
              {isSuperAdmin
                ? t(AppLocales.Admin.Settings.SuperAdminScope)
                : t(AppLocales.Admin.Settings.PermissionsCountScope, {
                    count: permissions.length,
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
