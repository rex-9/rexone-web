// src/modules/landing/pages/PrivacyPolicyPage.tsx

import React from "react";
import { LegalLayout, ILegalTocItem } from "../components/LegalLayout";
import { TextLink } from "../../../design";
import AppRoutes from "../../../AppRoutes";

const PRIVACY_TOC: ILegalTocItem[] = [
  { id: "overview", label: "1. Overview & Scope" },
  { id: "collection", label: "2. Information We Collect" },
  { id: "processing", label: "3. How We Use Your Data" },
  { id: "storage-security", label: "4. Storage, Security & Retention" },
  { id: "subprocessors", label: "5. Third-Party Sub-processors" },
  { id: "cookies-storage", label: "6. Cookies, Tokens & Local Storage" },
  { id: "user-rights", label: "7. Your Rights & Choices (GDPR/CCPA)" },
  { id: "ai-processing", label: "8. AI Workflows & Data Isolation" },
  { id: "children-privacy", label: "9. Children's Privacy" },
  { id: "policy-updates", label: "10. Changes to this Policy" },
  { id: "contact-info", label: "11. Contact & Legal Inquiries" },
];

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="At RexOne, sovereign architecture and user trust go hand in hand. This policy describes how we collect, safeguard, and honor your personal data across the RexOne ecosystem."
      lastUpdated="Effective Date: September 21, 2026"
      tableOfContents={PRIVACY_TOC}
    >
      {/* 1. Overview & Scope */}
      <section id="overview" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            01
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Overview & Scope
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          This Privacy Policy governs the collection, processing, and storage
          of personal data by <strong>Rex9 / RexOne</strong> ("RexOne", "we",
          "us", or "our") when you access or interact with our web client (
          <code className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-base-300/60">
            rexone.rex9.me
          </code>
          ), core APIs (
          <code className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-base-300/60">
            api.rexone.rex9.me
          </code>
          ), mobile applications, and services operating under{" "}
          <code className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-base-300/60">
            meritmoon.com
          </code>
          .
        </p>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We adhere to the foundational engineering doctrine:{" "}
          <em>"Start from One. Not from Zero."</em> Privacy and cryptographic
          safety are not afterthoughts bolted on before release—they are built
          directly into our domain models, API authorization tiers, and storage
          abstractions.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 2. Information We Collect */}
      <section id="collection" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            02
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Information We Collect
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We limit the collection of personal information strictly to what is
          necessary to deliver reliable, secure, and performant product
          experiences. The categories of information we collect include:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-2">
            <h3 className="font-display font-bold text-primary text-sm uppercase tracking-wide">
              Identity & Authentication
            </h3>
            <p className="text-xs text-base-content/75 leading-relaxed">
              Email addresses, salted and hashed credentials, confirmation codes,
              and password recovery tokens. For Google OAuth users, we receive
              your verified name, email address, and avatar image URI from
              Google Identity Services.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-2">
            <h3 className="font-display font-bold text-primary text-sm uppercase tracking-wide">
              Billing & Commercial Data
            </h3>
            <p className="text-xs text-base-content/75 leading-relaxed">
              Transaction identifiers, subscription state, coupon redemptions,
              and invoice histories. All raw credit card details, CVVs, and
              banking credentials are processed directly by our PCI-DSS Level 1
              certified partner, Stripe.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-2">
            <h3 className="font-display font-bold text-primary text-sm uppercase tracking-wide">
              User Media & Content
            </h3>
            <p className="text-xs text-base-content/75 leading-relaxed">
              Files, documents, audio recordings, or media assets uploaded to
              your account. Stored under sovereign identifiers using our
              self-hosted Garage S3-compatible infrastructure with signed,
              expiring access tokens.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-2">
            <h3 className="font-display font-bold text-primary text-sm uppercase tracking-wide">
              Telemetry & Client Logs
            </h3>
            <p className="text-xs text-base-content/75 leading-relaxed">
              Anonymized runtime client error traces, browser user-agents,
              application version numbers, and session timestamps used solely
              for debugging and maintaining uptime.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 3. How We Use Your Data */}
      <section id="processing" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            03
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            How We Use Your Data
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          Your personal data is processed exclusively for explicit, legitimate
          operational purposes:
        </p>
        <ul className="space-y-2.5 text-sm sm:text-base text-base-content/80 list-disc list-inside pl-2">
          <li>
            <strong>Providing Core Services:</strong> Authenticating users,
            verifying identity, managing role-based access controls (RBAC), and
            rendering personalized product consoles.
          </li>
          <li>
            <strong>Transactional Communication:</strong> Dispatching critical
            account security alerts, password reset links, email verification
            codes, and billing receipts.
          </li>
          <li>
            <strong>Subscription Management:</strong> Synchronizing payment
            events, validating promo coupons, and maintaining feature
            entitlements.
          </li>
          <li>
            <strong>Infrastructure Defense & Integrity:</strong> Monitoring
            suspicious authentication attempts, enforcing API rate limits, and
            preventing automated abuse or credential stuffing.
          </li>
          <li>
            <strong>We NEVER Sell Your Data:</strong> RexOne does not sell,
            rent, monetize, or trade your personal data or uploaded media to
            third-party data brokers or advertisers.
          </li>
        </ul>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 4. Storage, Security & Retention */}
      <section id="storage-security" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            04
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Storage, Security & Retention
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We maintain defense-in-depth security across our entire technical
          stack:
        </p>

        <div className="space-y-3 text-sm text-base-content/80">
          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1.5">
            <h4 className="font-bold text-glow-white text-sm">
              Transport & At-Rest Encryption
            </h4>
            <p className="text-xs leading-relaxed text-base-content/75">
              All browser and API traffic is encrypted in transit using modern
              TLS 1.3 cryptographic suites. Sensitive records in our PostgreSQL
              databases are stored behind firewall isolation with strict
              connection pools.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1.5">
            <h4 className="font-bold text-glow-white text-sm">
              Sovereign Media Storage (Garage S3)
            </h4>
            <p className="text-xs leading-relaxed text-base-content/75">
              All binary assets, avatars, and user documents are stored in
              self-hosted Garage S3-compatible object storage. Object access
              keys are universally managed and served through authenticated,
              time-bounded presigned URIs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-300/20 border border-glass-border/70 space-y-1.5">
            <h4 className="font-bold text-glow-white text-sm">
              Recycle Bin & Safe Soft Deletion
            </h4>
            <p className="text-xs leading-relaxed text-base-content/75">
              User-deleted accounts, media, and records enter our protected
              Recycle Bin state for a safety retention period of 30 days to
              prevent irreversible accidental data loss. Following this window,
              records are permanently purged from disk and database tables.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 5. Third-Party Sub-processors */}
      <section id="subprocessors" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            05
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Third-Party Sub-processors
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We engage vetted, industry-leading sub-processors to assist in
          delivering specialized services:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-glass-border text-primary font-display uppercase tracking-wider">
                <th className="py-2.5 px-3">Sub-processor</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/40 text-base-content/80">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-glow-white">
                  Stripe, Inc.
                </td>
                <td className="py-2.5 px-3">
                  Payment processing, subscription billing & PCI compliance
                </td>
                <td className="py-2.5 px-3">United States</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-glow-white">
                  OneSignal, Inc.
                </td>
                <td className="py-2.5 px-3">
                  Push notifications & transactional email delivery pipeline
                </td>
                <td className="py-2.5 px-3">United States</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-glow-white">
                  Google LLC
                </td>
                <td className="py-2.5 px-3">
                  OAuth 2.0 Identity Provider (optional user sign-in)
                </td>
                <td className="py-2.5 px-3">Global</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-glow-white">
                  Cloudflare, Inc.
                </td>
                <td className="py-2.5 px-3">
                  DNS routing, DDoS mitigation & TLS termination
                </td>
                <td className="py-2.5 px-3">Global</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 6. Cookies, Tokens & Local Storage */}
      <section id="cookies-storage" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            06
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Cookies, Tokens & Local Storage
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          RexOne uses browser storage exclusively for functional, authentication,
          and security purposes. We do not use third-party advertising cookies,
          behavioral tracking pixels, or cross-site fingerprinting.
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-base-content/80 list-disc list-inside pl-2">
          <li>
            <strong>Session & Auth Tokens:</strong> Encrypted JSON Web Tokens
            (JWT) stored in secure browser storage to authenticate API calls
            and persist your session.
          </li>
          <li>
            <strong>UI State & Preferences:</strong> Lightweight local keys
            persisting your preferred theme, language selection, and layout
            toggles.
          </li>
        </ul>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 7. Your Rights & Choices (GDPR/CCPA) */}
      <section id="user-rights" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            07
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Your Rights & Choices (GDPR & CCPA)
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          Regardless of your physical jurisdiction, RexOne provides all users
          with full sovereignty over their data:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-base-300/25 border border-glass-border/60">
            <strong className="text-glow-white block mb-1">
              Right to Access & Portability
            </strong>
            Request a structured, machine-readable export of all profile data,
            transactions, and assets associated with your account.
          </div>
          <div className="p-3.5 rounded-xl bg-base-300/25 border border-glass-border/60">
            <strong className="text-glow-white block mb-1">
              Right to Rectification
            </strong>
            Update or rectify incomplete or inaccurate personal data directly
            through your User Profile settings.
          </div>
          <div className="p-3.5 rounded-xl bg-base-300/25 border border-glass-border/60">
            <strong className="text-glow-white block mb-1">
              Right to Erasure ("Right to be Forgotten")
            </strong>
            Request immediate discard and permanent deletion of your profile,
            access tokens, and uploaded media.
          </div>
          <div className="p-3.5 rounded-xl bg-base-300/25 border border-glass-border/60">
            <strong className="text-glow-white block mb-1">
              Right to Withdraw Consent
            </strong>
            Opt out of non-essential communications or cancel active
            subscriptions at any time with one click.
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 8. AI Workflows & Data Isolation */}
      <section id="ai-processing" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            08
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            AI Workflows & Data Isolation
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          RexOne provides AI-driven assistants, chat channels, and background
          runs. Your personal prompts, private chats, and confidential inputs
          are strictly isolated per account and are{" "}
          <strong>never used to train public foundational AI models</strong>.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 9. Children's Privacy */}
      <section id="children-privacy" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            09
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Children's Privacy
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          Our services are directed to developers, professionals, and individuals
          who are at least 16 years of age (or the minimum legal age required
          in your jurisdiction). We do not knowingly collect personal data
          from children. If you become aware that a child has provided us with
          personal information, please contact us immediately for removal.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 10. Policy Updates */}
      <section id="policy-updates" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            10
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Changes to this Policy
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          We may update this Privacy Policy periodically to reflect architectural
          refinements, legal requirements, or new features. When changes are
          made, the "Effective Date" at the top will be updated. In case of
          material adjustments, we will notify registered users via in-app
          notification or transactional email.
        </p>
      </section>

      <div className="w-full h-px bg-glass-border/60" />

      {/* 11. Contact Info */}
      <section id="contact-info" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm border border-primary/40">
            11
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wide text-glow-white">
            Contact & Legal Inquiries
          </h2>
        </div>
        <p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
          If you have questions, data protection requests, or legal notices
          regarding this policy, please reach out directly:
        </p>
        <div className="p-4 rounded-xl bg-base-300/30 border border-glass-border space-y-2 text-sm">
          <p>
            <strong>Rex9 Engineering & MeritMoon Operations</strong>
          </p>
          <p className="text-xs sm:text-sm text-base-content/80">
            Support & Privacy Email:{" "}
            <a
              href="mailto:support@meritmoon.com"
              className="text-primary hover:underline font-semibold"
            >
              support@meritmoon.com
            </a>
          </p>
          <p className="text-xs sm:text-sm text-base-content/80">
            Lead Architect Email:{" "}
            <a
              href="mailto:rex@meritmoon.com"
              className="text-primary hover:underline font-semibold"
            >
              rex@meritmoon.com
            </a>
          </p>
        </div>
      </section>

      {/* Cross-Link to Terms */}
      <div className="pt-6 border-t border-glass-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/70">
        <span>Looking for our commercial terms and service rules?</span>
        <TextLink
          to={AppRoutes.client.public.TERMS_AND_CONDITIONS}
          className="text-primary hover:underline font-semibold flex items-center gap-1.5"
        >
          <span>Read the Terms & Conditions →</span>
        </TextLink>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicyPage;
