import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentController from "./payment.controller";
import PaymentService from "./payment.service";

vi.mock("./payment.service", () => ({
  default: {
    getTransactions: vi.fn(),
    getTransaction: vi.fn(),
    getSubscriptions: vi.fn(),
    getSubscription: vi.fn(),
    createBatchCoupons: vi.fn(),
    destroyCoupon: vi.fn(),
    emptyRecycleBin: vi.fn(),
    discardBatch: vi.fn(),
    undiscardBatch: vi.fn(),
    destroyBatch: vi.fn(),
  },
}));

const item = { id: "record-1", type: "record", attributes: { id: "record-1" } };
const listResponse = {
  data: {
    status: { success: true },
    data: [item],
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

describe("AdminPaymentController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("parses the admin transaction collection", async () => {
    vi.mocked(PaymentService.getTransactions).mockResolvedValue(listResponse as never);
    const result = await PaymentController.getTransactions({ page: 1 });
    expect(result.success).toBe(true);
    expect(result.transactions).toEqual([{ id: "record-1" }]);
  });

  it("parses a transaction detail", async () => {
    vi.mocked(PaymentService.getTransaction).mockResolvedValue({ data: { status: { success: true }, data: item } } as never);
    const result = await PaymentController.getTransaction("record-1");
    expect(result.transaction).toEqual({ id: "record-1" });
  });

  it("parses the admin subscription collection", async () => {
    vi.mocked(PaymentService.getSubscriptions).mockResolvedValue(listResponse as never);
    const result = await PaymentController.getSubscriptions({ page: 1 });
    expect(result.success).toBe(true);
    expect(result.subscriptions).toEqual([{ id: "record-1" }]);
  });

  it("parses a subscription detail", async () => {
    vi.mocked(PaymentService.getSubscription).mockResolvedValue({ data: { status: { success: true }, data: item } } as never);
    const result = await PaymentController.getSubscription("record-1");
    expect(result.subscription).toEqual({ id: "record-1" });
  });

  it("creates batch coupons successfully", async () => {
    vi.mocked(PaymentService.createBatchCoupons).mockResolvedValue(listResponse as never);
    const result = await PaymentController.createBatchCoupons({
      count: 5,
      prefix: "PROMO",
      coupon: { title: "Test Promo", amount: 10, coupon_type: "percentage" },
    });
    expect(result.success).toBe(true);
    expect(result.coupons).toEqual([{ id: "record-1" }]);
  });

  it("handles create batch coupons failure", async () => {
    vi.mocked(PaymentService.createBatchCoupons).mockResolvedValue({
      data: { status: { success: false, message: "Invalid batch count" } },
    } as never);
    const result = await PaymentController.createBatchCoupons({
      count: 0,
      prefix: "PROMO",
      coupon: { title: "Test Promo", amount: 10, coupon_type: "percentage" },
    });
    expect(result.success).toBe(false);
    expect(result.coupons).toEqual([]);
    expect(result.error).toBe("Invalid batch count");
  });

  it("destroys a coupon successfully", async () => {
    vi.mocked(PaymentService.destroyCoupon).mockResolvedValue({
      data: { status: { success: true } },
    } as never);
    const result = await PaymentController.destroyCoupon("coupon-1");
    expect(result.success).toBe(true);
  });

  it("empties recycle bin successfully", async () => {
    vi.mocked(PaymentService.emptyRecycleBin).mockResolvedValue({
      data: { status: { success: true }, data: { count: 3 } },
    } as never);
    const result = await PaymentController.emptyRecycleBin();
    expect(result.success).toBe(true);
    expect(result.count).toBe(3);
  });

  it("batch discards coupons successfully", async () => {
    vi.mocked(PaymentService.discardBatch).mockResolvedValue({
      data: { status: { success: true }, data: { count: 2 } },
    } as never);
    const result = await PaymentController.discardBatch(["c1", "c2"]);
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
  });

  it("batch undiscard coupons successfully", async () => {
    vi.mocked(PaymentService.undiscardBatch).mockResolvedValue({
      data: { status: { success: true }, data: { count: 2 } },
    } as never);
    const result = await PaymentController.undiscardBatch(["c1", "c2"]);
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
  });

  it("batch destroys coupons successfully", async () => {
    vi.mocked(PaymentService.destroyBatch).mockResolvedValue({
      data: { status: { success: true }, data: { count: 2 } },
    } as never);
    const result = await PaymentController.destroyBatch(["c1", "c2"]);
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
  });
});
