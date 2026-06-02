import React, { useRef } from "react";

export interface IPasscodeBoxesInput {
  idPrefix: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export const PasscodeBoxesInput: React.FC<IPasscodeBoxesInput> = ({
  idPrefix,
  value,
  onChange,
  label,
  helperText,
  error,
  disabled = false,
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");
  const displayText = error || helperText;
  const hasError = !!error;

  const updateDigit = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    const merged = nextDigits.join("").slice(0, 6);
    onChange(merged);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    startIndex: number,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6 - startIndex);

    if (!pasted) return;

    const nextDigits = [...digits];
    pasted.split("").forEach((digit, offset) => {
      nextDigits[startIndex + offset] = digit;
    });

    onChange(nextDigits.join("").slice(0, 6));

    const nextFocusIndex = Math.min(startIndex + pasted.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-body-s font-medium text-base-content mb-8">
        {label}
      </label>

      <div className="flex items-center justify-center gap-[8px]">
        {digits.map((digit, index) => (
          <React.Fragment key={`${idPrefix}-${index}`}>
            <input
              id={`${idPrefix}-${index}`}
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              value={digit}
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={(event) => handlePaste(event, index)}
              disabled={disabled}
              aria-label={`${label} digit ${index + 1}`}
              className={`w-[42px] sm:w-[46px] h-[50px] sm:h-[55px] rounded-m border-2 text-center text-body-l font-semibold font-primary tracking-[0.08em] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary ${
                hasError
                  ? "border-error focus:border-error focus:ring-error"
                  : "border-base-300 focus:border-primary"
              } ${disabled ? "opacity-50 cursor-not-allowed bg-base-200" : "bg-base-100"}`}
            />
            {index === 2 && (
              <span className="text-body-l font-semibold text-base-content opacity-70 px-[4px]">
                -
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {displayText && (
        <span
          className={`text-caption mt-6 ${
            hasError ? "text-error" : "text-base-content opacity-60"
          }`}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};

export default PasscodeBoxesInput;