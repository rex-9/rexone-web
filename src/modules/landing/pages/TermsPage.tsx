// src/modules/landing/pages/TermsPage.tsx

import React from "react";
import { LegalLayout, ILegalTocItem } from "../components/LegalLayout";
import { TextLink } from "../../../design";
import AppRoutes from "../../../AppRoutes";

const TERMS_TOC: ILegalTocItem[] = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "eligibility", label: "2. Eligibility & Account Security" },
  { id: "acceptable-use", label: "3. Acceptable Use Policy" },
  { id: "subscriptions-billing", label: "4. Billing, Subscriptions & Refunds" },
  { id: "intellectual-property", label: "5. Intellectual Property Rights" },
  { id: "ai-disclaimers", label: "6. AI Features & Output Disclaimers" },
  { id: "termination", label: "7. Account Closure & Suspension" },
  { id: "warranties-liability", label: "8. Disclaimer & Liability Limits" },
  { id: "governing-law", label: "9. Governing Law & Dispute Resolution" },
  { id: "modifications", label: "10. Changes to These Terms" },
  { id: "contact-terms", label: "11. Contact & Legal Notices" },
];

export const TermsPage: React.FC = () => {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="The covenant between Rex9 and our community. Clear rules, sovereign principles, and transparent terms governing the RexOne ecosystem."
      lastUpdated="Effective Date: September 21, 2026"
      tableOfContents={TERMS_TOC}
    >
      {/* 1. Acceptance of Terms */}
      <section id="acceptance" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            01
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Acceptance of Terms
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          Welcome to RexOne. By accessing, browsing, registering for, or using
          any portion of the RexOne web client (
          <code className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-base-300/60">
            rexone.rex9.me
          </code>
          ), API endpoints (
          <code className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-base-300/60">
            api.rexone.rex9.me
          </code>
          ), mobile clients, or related services (collectively, the "Platform"),
          you enter into a legally binding covenant with{" "}
          <strong>Rex9 / RexOne</strong> ("RexOne", "we", "us", or "our").
        </p>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          If you do not agree to these Terms and Conditions or our accompanying{" "}
          <TextLink
            to={AppRoutes.client.public.PRIVACY_POLICY}
            className="text-primary hover:underline font-semibold"
          >
            Privacy Policy
          </TextLink>
          , you must refrain from accessing or utilizing our platform and
          services.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 2. Eligibility & Account Security */}
      <section id="eligibility" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            02
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Eligibility & Account Security
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          To use RexOne, you affirm that you are at least 16 years old (or the
          age of legal majority in your country of residence) and possess full
          legal authority to enter into these terms.
        </p>
        <ul className="space-y-2.5 text-sm sm:text-base text-base-content/80 list-disc list-inside pl-2">
          <li>
            <strong>Accurate Account Credentials:</strong> You agree to provide
            accurate and current information upon registration and to verify
            your email address when requested.
          </li>
          <li>
            <strong>Credential Safeguarding:</strong> You are responsible for
            maintaining the confidentiality of your passcodes, OAuth tokens, and
            session credentials. You must notify us immediately of any
            unauthorized access to your account.
          </li>
          <li>
            <strong>Entity Representation:</strong> If you are accepting these
            terms on behalf of a company, organization, or studio, you represent
            and warrant that you hold legitimate authority to bind that entity.
          </li>
        </ul>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 3. Acceptable Use Policy */}
      <section id="acceptable-use" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            03
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Acceptable Use Policy (AUP)
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          RexOne is engineered as a sovereign, high-discipline foundation. You
          agree never to use or attempt to use the platform in ways that degrade,
          exploit, or subvert its integrity. Prohibited conduct includes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-1.5">
            <h4 className="font-bold text-primary text-sm uppercase">
              Infrastructure Abuse & Attacks
            </h4>
            <p className="text-base-content/75 leading-relaxed">
              Deploying Denial of Service (DoS/DDoS) attacks, automated crawler
              swarms, brute-force passcode cracking, or bypassing API rate
              limits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-1.5">
            <h4 className="font-bold text-primary text-sm uppercase">
              Security Circumvention
            </h4>
            <p className="text-base-content/75 leading-relaxed">
              Tampering with role-based access control (IAM) tokens, attempting
              privilege escalation, reverse-engineering closed backend modules,
              or exploiting unauthorized endpoints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-1.5">
            <h4 className="font-bold text-primary text-sm uppercase">
              Unlawful Content & Malware
            </h4>
            <p className="text-base-content/75 leading-relaxed">
              Uploading malicious software, trojans, ransomware, or media
              containing unlawful, harassing, defamatory, or copyright-infringing
              materials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-1.5">
            <h4 className="font-bold text-primary text-sm uppercase">
              Spam & Unauthorized Relay
            </h4>
            <p className="text-base-content/75 leading-relaxed">
              Using RexOne's notification or messaging pipelines for unsolicited
              bulk messages, phishing, or financial scams.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 4. Subscriptions & Billing */}
      <section id="subscriptions-billing" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            04
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Billing, Subscriptions & Refunds
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          RexOne offers free access tiers, one-time product licenses, and
          recurring premium subscriptions. All payment transactions are powered
          by Stripe Inc.
        </p>

        <div className="space-y-3 text-xs sm:text-sm text-base-content/80">
          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1">
            <strong className="text-glow-white block text-sm">
              Recurring Billing & Renewals
            </strong>
            <p className="text-xs leading-relaxed text-base-content/75">
              Subscriptions renew automatically at the end of each billing cycle
              (monthly or annually) unless cancelled before the renewal date
              via the User Profile or Stripe Customer Portal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1">
            <strong className="text-glow-white block text-sm">
              Cancellations & Proration
            </strong>
            <p className="text-xs leading-relaxed text-base-content/75">
              When you cancel a subscription, you retain access to paid features
              until the conclusion of the current prepaid billing period. No
              further recurring charges will occur.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1">
            <strong className="text-glow-white block text-sm">
              Coupons & Promotional Pricing
            </strong>
            <p className="text-xs leading-relaxed text-base-content/75">
              Promotional codes or discount coupons are non-transferable, cannot
              be redeemed for cash, and are subject to the specific duration and
              usage caps specified at issuance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1">
            <strong className="text-glow-white block text-sm">
              Refund Policy
            </strong>
            <p className="text-xs leading-relaxed text-base-content/75">
              Except where mandatory local consumer protection statutes
              require otherwise, payments are generally non-refundable once the
              service period has commenced. In cases of billing errors or
              technical service failures, please contact support within 14 days
              for review.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 5. Intellectual Property Rights */}
      <section id="intellectual-property" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            05
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Intellectual Property Rights
          </h2>
        </div>
        <div className="space-y-3 text-sm text-base-content/80">
          <p>
            <strong>RexOne Proprietary Assets:</strong> All software architecture,
            codebases, design tokens, logos, visual trademarks, documentation,
            and interface layouts are the sovereign property of Rex9 and its
            licensors. Open-source components are provided under their respective
            open-source licenses.
          </p>
          <p>
            <strong>Your Content Sovereignty:</strong> You retain complete
            ownership of any media, documents, text, code, or digital assets
            you upload to RexOne. By uploading content, you grant RexOne only the
            limited, non-exclusive license strictly necessary to store, encode,
            and transmit your content back to you and your authorized users.
          </p>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 6. AI Features & Output Disclaimers */}
      <section id="ai-disclaimers" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            06
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            AI Features & Output Disclaimers
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          RexOne includes artificial intelligence modules, generative chat
          assistants, and automated background runs. You acknowledge and agree
          that:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-base-content/80 list-disc list-inside pl-2">
          <li>
            AI-generated content is probabilistic in nature and may contain
            inaccuracies, omissions, or unintended hallucinations.
          </li>
          <li>
            You are solely responsible for evaluating and verifying the
            accuracy, safety, and suitability of any AI output before using it
            in production, legal, financial, or critical applications.
          </li>
          <li>
            RexOne makes no warranty that AI features will be error-free or
            uninterrupted.
          </li>
        </ul>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 7. Account Closure & Suspension */}
      <section id="termination" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            07
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Account Closure & Suspension
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          You may terminate your account at any time through your Profile
          Settings or by reaching out to support. Upon account closure, data is
          transferred to the Recycle Bin prior to permanent purging in accordance
          with our{" "}
          <TextLink
            to={AppRoutes.client.public.PRIVACY_POLICY}
            className="text-primary hover:underline font-semibold"
          >
            Privacy Policy
          </TextLink>
          .
        </p>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We reserve the right to suspend, rate-limit, or terminate your access
          with immediate effect if you violate these Terms, engage in fraud, or
          endanger the availability or security of other users.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 8. Disclaimer & Liability Limits */}
      <section id="warranties-liability" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            08
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Disclaimer of Warranties & Limitation of Liability
          </h2>
        </div>
        <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-3 text-xs sm:text-sm text-base-content/80">
          <p className="font-mono text-xs uppercase tracking-wider text-base-content/60">
            As-Is Provision & Statutory Disclaimers
          </p>
          <p className="leading-relaxed">
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
            OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p className="leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL REX9,
            REXONE, ITS ARCHITECTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF
            PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH
            YOUR ACCESS OR USE OF THE PLATFORM.
          </p>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 9. Governing Law */}
      <section id="governing-law" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            09
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Governing Law & Dispute Resolution
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          These Terms and any dispute arising from them shall be governed by
          and construed in accordance with generally accepted international
          principles of commercial law, without regard to conflicts of law
          provisions. Prior to filing any formal legal claim, you agree to
          contact us and make a reasonable, good-faith effort to resolve the
          dispute informally.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 10. Modifications */}
      <section id="modifications" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            10
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Changes to These Terms
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We may modify these Terms occasionally to accommodate legal updates,
          platform growth, or new features. When changes are published, the
          "Effective Date" at the top of this document will be updated. Your
          continued use of RexOne after changes take effect constitutes your
          binding acceptance of the modified Terms.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 11. Contact Info */}
      <section id="contact-terms" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            11
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Contact & Legal Notices
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          For legal notices, service concerns, or partnership agreements,
          contact our operational team:
        </p>
        <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-2 text-sm">
          <p>
            <strong>Rex9 Engineering & MeritMoon Operations</strong>
          </p>
          <p className="text-xs sm:text-sm text-base-content/80">
            Official Legal & Support Email:{" "}
            <a
              href="mailto:support@meritmoon.com"
              className="text-primary hover:underline font-semibold"
            >
              support@meritmoon.com
            </a>
          </p>
          <p className="text-xs sm:text-sm text-base-content/80">
            Creator & Lead Architect:{" "}
            <a
              href="mailto:rex@meritmoon.com"
              className="text-primary hover:underline font-semibold"
            >
              rex@meritmoon.com
            </a>
          </p>
        </div>
      </section>

      {/* Cross-Link to Privacy Policy */}
      <div className="pt-6 border-t border-glass-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/70">
        <span>Curious about how we protect and isolate your data?</span>
        <TextLink
          to={AppRoutes.client.public.PRIVACY_POLICY}
          className="text-primary hover:underline font-semibold flex items-center gap-1.5"
        >
          <span>Read the Privacy Policy →</span>
        </TextLink>
      </div>
    </LegalLayout>
  );
};

export default TermsPage;
