# 🔀 Web Branch Merge & Conflict Resolution Guide

This guide explains architectural updates made to `rexone-web` and `rexone-core`, and details how developers working on other feature branches should resolve merge conflicts.

---

## 🏛️ 1. Key Architectural Updates

### A. Controller Pattern: Clean Async Returns (Zero Callback Soup)
Controllers in `src/modules/*/` no longer accept callback parameters (`onSuccess`, `onError`, `setError`, `setMessage`, `navigate`).

- **Why**:
  - `api.service.ts` handles all HTTP transport and Axios errors internally and guarantees a resolved Promise (`{ data, error }`).
  - Wrapping controller methods in redundant `try...catch` blocks with `onSuccess` callbacks accidentally caught React UI rendering bugs and reported them as API network failures.
  - Controllers are now pure async methods returning typed outcome objects.

#### ❌ Old Pattern (Callback Soup & Redundant Catch)
```typescript
// Old Controller
async cancelSubscription(id: string, onSuccess: (data) => void, onError: (err) => void) {
  try {
    const res = await PaymentService.cancelSubscription(id);
    if (res.data?.status?.success) {
      onSuccess(res.data.data);
    } else {
      onError(res.data?.status?.error || "Failed");
    }
  } catch (error) {
    onError("An error occurred.");
  }
}

// Old Component
PaymentController.cancelSubscription(id, () => fetchData(), (err) => error(err));
```

#### ✅ New Pattern (Async / Await Return)
```typescript
// New Controller
async cancelSubscription(subscriptionId: string): Promise<{
  success: boolean;
  subscription?: ISubscription;
  message?: string;
  error?: string;
}> {
  const response = await PaymentService.cancelSubscription(subscriptionId);
  const { status, data } = response.data || {};

  if (status?.success && data) {
    return {
      success: true,
      subscription: data,
      message: status.message || "Subscription canceled successfully",
    };
  }

  return {
    success: false,
    error: status?.error || response.error || "Failed to cancel subscription",
  };
}

// New Component
const handleCancel = async (id: string) => {
  setLoading(true);
  const result = await PaymentController.cancelSubscription(id);
  setLoading(false);

  if (result.success) {
    success(result.message);
    await fetchData();
  } else {
    error(result.error);
  }
};
```

---

### B. Single-Request IAM Introspection (`/v1/users/current/iam`)
The `read_current_iam` endpoint now returns explicit segregation of roles and permissions:

```typescript
interface ICurrentIamResponse {
  user: IUser;
  is_admin: boolean;            // true if user has ANY role containing 'admin'
  is_super_admin: boolean;      // true if user has 'super_admin'
  roles: IRole[];               // All assigned roles
  admin_roles: IRole[];         // Assigned admin roles (*_admin, super_admin, admin)
  non_admin_roles: IRole[];     // Assigned standard user roles (user, etc.)
  permissions: IPermission[];   // All permissions combined
  admin_permissions: IPermission[];     // Permissions granted via admin roles
  non_admin_permissions: IPermission[]; // Permissions granted via non-admin roles
}
```

- Use `admin_permissions` to dynamically render sidebar navigation items under `/admin/*`.
- Partial admins (e.g. `feedback_admin`) only see sidebar items matching `read_<resource>` inside `admin_permissions`.

---

## 🛠️ 2. How to Resolve Common Merge Conflicts

### 1. Conflict in Controllers (`payment.controller.ts`, `ai.controller.ts`, `auth.controller.ts`)
- **Resolution**: Convert newly added controller methods to return `Promise<{ success: boolean; data?: T; error?: string }>` instead of taking `onSuccess` / `onError` callbacks.
- Remove redundant `try...catch` blocks wrapping pure `Service.*` calls unless the method executes complex synchronous data parsing.

### 2. Conflict in React Components / Pages
- **Resolution**: Change calls from `Controller.method(args, onSuccess, onError)` to `const res = await Controller.method(args)`.
- Handle loading state and toast messages directly in the component with `if (res.success) { ... } else { ... }`.

### 3. Removed `apiHandler` Utility
- **Resolution**: `apiHandler` in `src/services/api.service.ts` has been deprecated and removed. Rewrite the caller to standard async/await.

---

## 🧪 3. Verification Commands After Merging

```bash
# In rexone-web
npm run build
```
Ensure build compiles with 0 TypeScript and Vite bundle errors.
