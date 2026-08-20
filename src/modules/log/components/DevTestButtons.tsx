import React from "react";
import { Button } from "../../../design/components";
import LogController from "../log.controller";

export const DevTestButtons: React.FC = () => {
  // === Test: Trigger a frontend rendering error ===
  const triggerFrontendError = () => {
    // This will cause a runtime error (cannot read property of undefined)
    const obj = undefined as unknown as Record<string, unknown>;
    console.log(obj.someProperty); // Uncaught TypeError
  };

  // === Test: Trigger an API error (should NOT be logged) ===
  const triggerApiError = async () => {
    try {
      await fetch("/v1/nonexistent-endpoint");
    } catch {
      // This error will have "fetch" in stack trace → filtered out
    }
  };

  // === Test: Storage issue (optional) ===
  const triggerStorageIssue = () => {
    // 🚨 This will be caught by the fixed AtomService
    localStorage.setItem("invalid_json", "{not valid}");
    // The next time AtomService loads, it will remove this entry
    LogController.logStorageIssue(
      "invalid_json",
      "valid JSON",
      localStorage.getItem("invalid_json"),
      { component: "HomePage" },
    );
  };

  return (
    <div className="border border-dashed border-gray-400 p-4 space-y-2">
      <p className="text-sm text-gray-500">
        🧪 Test Logging (remove later)
      </p>
      <Button variant="primary" onClick={triggerFrontendError}>
        🔥 Trigger FE Error (should log)
      </Button>
      <Button variant="primary" onClick={triggerApiError}>
        🌐 Trigger API Error (should NOT log)
      </Button>
      <Button variant="primary" onClick={triggerStorageIssue}>
        💾 Trigger Storage Issue (should log)
      </Button>
    </div>
  );
};
