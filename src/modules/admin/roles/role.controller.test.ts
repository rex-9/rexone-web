// src/modules/admin/roles/role.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoleController from "./role.controller";
import RoleService from "./role.service";
import type { IAdminRoleFormValues } from "./types";

vi.mock("./role.service", () => ({
  default: {
    getRoles: vi.fn(),
    getRole: vi.fn(),
    getPermissions: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    discardRole: vi.fn(),
  },
}));

describe("RoleController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRoles", () => {
    it("calls onSuccess with parsed roles when API succeeds", async () => {
      const mockRoles = [
        {
          id: "r1",
          name: "Manager",
          description: "Branch manager",
          system: false,
          permissions: { users: ["read", "update"] },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { roles: mockRoles },
        },
      };

      vi.mocked(RoleService.getRoles).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.getRoles(onSuccess, onError);

      expect(RoleService.getRoles).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: "r1", name: "Manager" }),
        ]),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError when API fails", async () => {
      vi.mocked(RoleService.getRoles).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null,
        },
      } as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.getRoles(onSuccess, onError);

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("getRole", () => {
    it("calls onSuccess with single role", async () => {
      const mockRole = { id: "r1", name: "Admin" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { role: mockRole },
        },
      };

      vi.mocked(RoleService.getRole).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.getRole("r1", onSuccess, onError);

      expect(RoleService.getRole).toHaveBeenCalledWith("r1");
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "r1", name: "Admin" }),
      );
    });
  });

  describe("getPermissions", () => {
    it("calls onSuccess with permission definitions", async () => {
      const mockPermissions = [
        { id: "p1", resource: "users", action: "read" },
        { id: "p2", resource: "users", action: "create" },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { permissions: mockPermissions },
        },
      };

      vi.mocked(RoleService.getPermissions).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.getPermissions(onSuccess, onError);

      expect(RoleService.getPermissions).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ resource: "users" }),
        ]),
      );
    });
  });

  describe("createRole", () => {
    it("calls onSuccess with created role", async () => {
      const formValues: IAdminRoleFormValues = {
        name: "Support Specialist",
        description: "Customer support staff",
        permission_ids: ["p1", "p2"],
      };

      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Role created" },
          data: { role: { id: "r2", name: "Support Specialist" } },
        },
      };

      vi.mocked(RoleService.createRole).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.createRole(formValues, onSuccess, onError);

      expect(RoleService.createRole).toHaveBeenCalledWith(formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "r2", name: "Support Specialist" }),
      );
    });
  });

  describe("updateRole", () => {
    it("calls onSuccess with updated role", async () => {
      const formValues: IAdminRoleFormValues = {
        name: "Support Lead",
        description: "Lead customer support",
        permission_ids: ["p1", "p2", "p3"],
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Role updated" },
          data: { role: { id: "r2", name: "Support Lead" } },
        },
      };

      vi.mocked(RoleService.updateRole).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.updateRole("r2", formValues, onSuccess, onError);

      expect(RoleService.updateRole).toHaveBeenCalledWith("r2", formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "r2", name: "Support Lead" }),
      );
    });
  });

  describe("discardRole", () => {
    it("calls onSuccess when role is discarded", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Role discarded" },
        },
      };

      vi.mocked(RoleService.discardRole).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await RoleController.discardRole("r2", onSuccess, onError);

      expect(RoleService.discardRole).toHaveBeenCalledWith("r2");
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
