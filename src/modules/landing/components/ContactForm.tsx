// src/modules/landing/components/ContactForm.tsx

import React, { useState } from "react";
import {
  FormVariants,
  ButtonVariants,
  ButtonTypes,
  ComponentSizes,
} from "../../../constants";
import { Button, FormContainer } from "../../../design";
import { iconsLib } from "../../../assets";
import { LANDING_DATA } from "../constants";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  return (
    <FormContainer
      variant={FormVariants.GLASS}
      action={LANDING_DATA.formspreeUrl}
      method="POST"
      target="_blank"
      rel="noopener noreferrer"
      className="relative font-primary w-full max-w-md space-y-4 rounded-3xl bg-glass-card/90 backdrop-blur-xl border border-glass-border p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-glass-border-hover hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.35)] transition-all duration-300"
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-1 mb-1">
        <h2 className="font-display text-2xl sm:text-3xl text-glow-white [text-shadow:0_0_6px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.7)] tracking-wide">
          Keep in Touch
        </h2>
        <p className="text-xs text-base-content/70 font-primary">
          Direct line to Rex. Every message is cherished.
        </p>
      </div>

      {/* Name Input */}
      <div className="space-y-1.5 text-left">
        <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
          <span>Your Full Name</span>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Satoshi Nakamoto"
          required
          className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-black/40 border border-glass-border hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary/40 text-sm sm:text-base text-white placeholder:text-base-content/40 transition-all duration-200 outline-none font-primary"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-1.5 text-left">
        <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
          <span>Your Email</span>
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          required
          className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-black/40 border border-glass-border hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary/40 text-sm sm:text-base text-white placeholder:text-base-content/40 transition-all duration-200 outline-none font-primary"
        />
      </div>

      {/* Message Input */}
      <div className="space-y-1.5 text-left">
        <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
          <span>How May I Kindly Help You?</span>
        </label>
        <textarea
          name="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Write your note, proposal, or feedback here..."
          required
          rows={3}
          className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-black/40 border border-glass-border hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary/40 text-sm sm:text-base text-white placeholder:text-base-content/40 transition-all duration-200 outline-none resize-none font-primary leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          variant={ButtonVariants.PRIMARY}
          type={ButtonTypes.SUBMIT}
          size={ComponentSizes.MD}
          fullWidth
          className="w-full justify-center py-2.5 sm:py-3 text-sm sm:text-base font-bold shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.35)] hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.6)] flex items-center gap-2 cursor-pointer transition-all duration-300"
        >
          <iconsLib.mail className="w-4 h-4 text-primary-light" />
          <span>Send Message</span>
        </Button>
      </div>
    </FormContainer>
  );
};
