// src/modules/admin/users/user.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserController from "./user.controller";
import UserService from "./user.service";
import type { IAdminUserFormValues } from "./types";
import type { IAdminRole } from "../roles";

vi.mock("./user.service", () => ({
  default: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    getDiscardedUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    discardUser: vi.fn(),
    undiscardUser: vi.fn(),
    getRoles: vi.fn(),
  },
}));

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUsers", () => {
    it("calls onSuccess with parsed users and pagination when API succeeds", async () => {
      const mockUsers = [
        {
          id: "u1",
          email: "user1@example.com",
          username: "user1",
          name: "User One",
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockUsers,
          meta: {
            pagination: {
              page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      };

      vi.mocked(UserService.getUsers).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.getUsers({ page: 1 }, onSuccess, onError);

      expect(UserService.getUsers).toHaveBeenCalledWith({ page: 1 });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "u1" })]),
        expect.objectContaining({ total_count: 1 }),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError when API fails", async () => {
      const mockResponse = {
        data: {
          status: { code: 500, success: false, message: "Server Error" },
          data: null,
        },
      };

      vi.mocked(UserService.getUsers).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.getUsers(undefined, onSuccess, onError);

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    it("calls onSuccess with single user when API succeeds", async () => {
      const mockUser = {
        id: "u1",
        email: "user1@example.com",
        username: "user1",
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { user: mockUser },
        },
      };

      vi.mocked(UserService.getUser).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.getUser("u1", onSuccess, onError);

      expect(UserService.getUser).toHaveBeenCalledWith("u1");
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "u1", email: "user1@example.com" }),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError when user is not found", async () => {
      const mockResponse = {
        data: {
          status: { code: 404, success: false, message: "Not Found" },
          data: null,
        },
      };

      vi.mocked(UserService.getUser).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.getUser("u999", onSuccess, onError);

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("getDiscardedUsers", () => {
    it("calls onSuccess with discarded users list", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [{ id: "u2", email: "discarded@example.com" }],
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(UserService.getDiscardedUsers).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.getDiscardedUsers({ page: 1 }, onSuccess, onError);

      expect(UserService.getDiscardedUsers).toHaveBeenCalledWith({ page: 1 });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "u2" })]),
        expect.objectContaining({ total_count: 1 }),
      );
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    it("creates user and invokes onSuccess with created user and message", async () => {
      const formValues: IAdminUserFormValues = {
        email: "new@example.com",
        username: "newuser",
        name: "New User",
        role_ids: ["r1"],
      };

      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "User created" },
          data: { user: { id: "u3", email: "new@example.com" } },
        },
      };

      vi.mocked(UserService.createUser).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.createUser(formValues, onSuccess, onError);

      expect(UserService.createUser).toHaveBeenCalledWith(formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "u3" }),
        "User created",
      );
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    it("updates user and invokes onSuccess with updated user", async () => {
      const formValues: IAdminUserFormValues = {
        email: "updated@example.com",
        username: "updateduser",
        name: "Updated User",
      };

      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "User updated" },
          data: { user: { id: "u1", email: "updated@example.com" } },
        },
      };

      vi.mocked(UserService.updateUser).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.updateUser("u1", formValues, onSuccess, onError);

      expect(UserService.updateUser).toHaveBeenCalledWith("u1", formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "u1" }),
        "User updated",
      );
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("discardUser", () => {
    it("discards user and calls onSuccess with status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "User moved to recycle bin" },
          data: {},
        },
      };

      vi.mocked(UserService.discardUser).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.discardUser("u1", onSuccess, onError);

      expect(UserService.discardUser).toHaveBeenCalledWith("u1");
      expect(onSuccess).toHaveBeenCalledWith("User moved to recycle bin");
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("undiscardUser", () => {
    it("undiscards user and calls onSuccess with status message", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "User restored" },
          data: {},
        },
      };

      vi.mocked(UserService.undiscardUser).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.undiscardUser("u1", onSuccess, onError);

      expect(UserService.undiscardUser).toHaveBeenCalledWith("u1");
      expect(onSuccess).toHaveBeenCalledWith("User restored");
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("getRoles", () => {
    it("calls onSuccess with role list", async () => {
      const mockRoles: IAdminRole[] = [
        { id: "r1", name: "admin", description: "Admin", system: true },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { roles: mockRoles },
        },
      };

      vi.mocked(UserService.getRoles).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await UserController.getRoles(onSuccess, onError);

      expect(UserService.getRoles).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "r1" })]),
      );
      expect(onError).not.toHaveBeenCalled();
    });
  });
});
