import type { Metadata } from "next";
import SecurityReveal from "./SecurityReveal";
import "./security.css";

export const metadata: Metadata = {
  title: "Security | Push",
  description:
    "How Push protects verified foot traffic data, creator PII, and merchant payment information. Our security architecture, compliance posture, and responsible disclosure program.",
};

/* ── Inline SVG icons (no external icon library) ─────────── */
type IconProps = { className?: string; style?: React.CSSProperties };

function IconShield({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLock({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="0" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconZap({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconSearch({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconFile({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IconCheck({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowRight({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ── Infrastructure SVG diagram ──────────────────────────── */
function InfraDiagram() {
  return (
    <div
      className="sec-infra-diagram"
      aria-label="Push infrastructure topology"
    >
      <svg
        viewBox="0 0 900 320"
        width="100%"
        height="auto"
        style={{ display: "block", minWidth: 480 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="900" height="320" fill="#003049" />
        <rect width="900" height="320" fill="url(#grid)" />

        {/* Internet / Client Layer */}
        <rect
          x="20"
          y="120"
          width="120"
          height="80"
          fill="none"
          stroke="rgba(102,155,188,0.4)"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        <text
          x="80"
          y="153"
          textAnchor="middle"
          fill="rgba(102,155,188,0.7)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          CLIENT
        </text>
        <text
          x="80"
          y="169"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="monospace"
        >
          App / Browser
        </text>
        <text
          x="80"
          y="183"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="monospace"
        >
          QR Scanner
        </text>

        {/* Arrow client → edge */}
        <line
          x1="141"
          y1="160"
          x2="195"
          y2="160"
          stroke="rgba(193,18,31,0.6)"
          strokeWidth="1.5"
        />
        <polygon points="194,156 202,160 194,164" fill="rgba(193,18,31,0.6)" />
        <text
          x="170"
          y="152"
          textAnchor="middle"
          fill="rgba(193,18,31,0.6)"
          fontSize="8"
          fontFamily="monospace"
        >
          TLS 1.3
        </text>

        {/* Vercel Edge */}
        <rect
          x="202"
          y="100"
          width="130"
          height="120"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <text
          x="267"
          y="125"
          textAnchor="middle"
          fill="rgba(102,155,188,0.9)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          VERCEL EDGE
        </text>
        <text
          x="267"
          y="143"
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="9"
          fontFamily="monospace"
        >
          WAF + DDoS
        </text>
        <text
          x="267"
          y="157"
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="9"
          fontFamily="monospace"
        >
          Rate Limiting
        </text>
        <text
          x="267"
          y="171"
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="9"
          fontFamily="monospace"
        >
          Bot Protection
        </text>
        <text
          x="267"
          y="185"
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="9"
          fontFamily="monospace"
        >
          Next.js Runtime
        </text>
        <text
          x="267"
          y="207"
          textAnchor="middle"
          fill="rgba(102,155,188,0.45)"
          fontSize="8"
          fontFamily="monospace"
        >
          US-East-1 / Global CDN
        </text>

        {/* Arrow edge → API */}
        <line
          x1="333"
          y1="160"
          x2="387"
          y2="160"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
        />
        <polygon
          points="386,156 394,160 386,164"
          fill="rgba(255,255,255,0.2)"
        />

        {/* API layer (AWS) */}
        <rect
          x="394"
          y="60"
          width="200"
          height="200"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <text
          x="494"
          y="85"
          textAnchor="middle"
          fill="rgba(201,169,110,0.9)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          AWS US-EAST-1
        </text>

        {/* API sub-box */}
        <rect
          x="410"
          y="95"
          width="168"
          height="48"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="494"
          y="116"
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="700"
        >
          API Gateway
        </text>
        <text
          x="494"
          y="130"
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
          fontFamily="monospace"
        >
          RBAC · JWT · MFA
        </text>

        {/* Lambda / ECS */}
        <rect
          x="410"
          y="155"
          width="74"
          height="40"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="447"
          y="172"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          fontFamily="monospace"
        >
          Lambda
        </text>
        <text
          x="447"
          y="186"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          fontFamily="monospace"
        >
          Workers
        </text>

        <rect
          x="494"
          y="155"
          width="84"
          height="40"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="536"
          y="172"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          fontFamily="monospace"
        >
          Fraud Engine
        </text>
        <text
          x="536"
          y="186"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          fontFamily="monospace"
        >
          Real-time
        </text>

        {/* SQS / EventBridge */}
        <rect
          x="410"
          y="207"
          width="168"
          height="36"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="494"
          y="224"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          fontFamily="monospace"
        >
          SQS + EventBridge
        </text>
        <text
          x="494"
          y="236"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          fontFamily="monospace"
        >
          Async attribution pipeline
        </text>

        {/* Arrow API → DB */}
        <line
          x1="595"
          y1="160"
          x2="645"
          y2="160"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
        />
        <polygon
          points="644,156 652,160 644,164"
          fill="rgba(255,255,255,0.2)"
        />

        {/* Data layer */}
        <rect
          x="652"
          y="80"
          width="140"
          height="160"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <text
          x="722"
          y="103"
          textAnchor="middle"
          fill="rgba(102,155,188,0.9)"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          DATA LAYER
        </text>

        <rect
          x="664"
          y="112"
          width="116"
          height="36"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="722"
          y="128"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          RDS PostgreSQL
        </text>
        <text
          x="722"
          y="141"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          fontFamily="monospace"
        >
          AES-256 at rest
        </text>

        <rect
          x="664"
          y="158"
          width="116"
          height="36"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="722"
          y="174"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          S3 + KMS
        </text>
        <text
          x="722"
          y="187"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="8"
          fontFamily="monospace"
        >
          Media / logs
        </text>

        <rect
          x="664"
          y="204"
          width="116"
          height="28"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <text
          x="722"
          y="221"
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          fontFamily="monospace"
        >
          ElastiCache Redis
        </text>

        {/* Arrow DB → backup */}
        <line
          x1="793"
          y1="160"
          x2="843"
          y2="160"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />
        <polygon
          points="842,156 850,160 842,164"
          fill="rgba(255,255,255,0.15)"
        />

        {/* Backup */}
        <rect
          x="850"
          y="120"
          width="30"
          height="80"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="3,2"
        />
        <text
          x="865"
          y="156"
          textAnchor="middle"
          fill="rgba(255,255,255,0.2)"
          fontSize="7"
          fontFamily="monospace"
          transform="rotate(-90 865 160)"
        >
          BACKUP US-WEST
        </text>

        {/* Legend */}
        <line
          x1="20"
          y1="295"
          x2="40"
          y2="295"
          stroke="rgba(193,18,31,0.6)"
          strokeWidth="1.5"
        />
        <text
          x="46"
          y="298"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
          fontFamily="monospace"
        >
          Encrypted channel (TLS 1.3)
        </text>
        <line
          x1="230"
          y1="295"
          x2="250"
          y2="295"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
        />
        <text
          x="256"
          y="298"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
          fontFamily="monospace"
        >
          Internal network
        </text>
        <line
          x1="400"
          y1="295"
          x2="420"
          y2="295"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />
        <text
          x="426"
          y="298"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
          fontFamily="monospace"
        >
          Async / backup
        </text>
      </svg>
    </div>
  );
}

/* ── Page component ──────────────────────────────────────── */
export default function SecurityPage() {
  return (
    <main className="sec-page">
      <SecurityReveal />
      {/* 1. Hero */}
      <section className="sec-hero">
        <div className="sec-hero-inner">
          <p className="sec-hero-eyebrow">Security whitepaper</p>
          <h1 className="sec-hero-headline">
            Security
            <br />
            at Push.
          </h1>
          <p className="sec-hero-sub">
            How we protect verified foot traffic and the data behind it. This
            document describes our architecture, controls, and obligations to
            every creator, merchant, and partner on the platform.
          </p>
          <div className="sec-hero-meta">
            <span className="sec-hero-meta-item">
              <span>Version</span>2.2
            </span>
            <span className="sec-hero-meta-item">
              <span>Last reviewed</span>April 2026
            </span>
            <span className="sec-hero-meta-item">
              <span>Jurisdiction</span>New York, USA
            </span>
            <span className="sec-hero-meta-item">
              <span>Contact</span>security@push.nyc
            </span>
          </div>
          <p
            className="sec-hero-sub"
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-3)",
              border: "1px solid var(--sec-line, rgba(255,255,255,0.18))",
              fontSize: "0.85em",
            }}
          >
            <strong>Compliance status disclosure (2026-04-20):</strong> All
            certification claims on this page reflect current in-progress
            status. Push has not completed any formal third-party security or
            privacy audits as of the date above. Targets and timelines may shift
            subject to audit-firm engagement. For the current compliance
            posture, contact{" "}
            <a className="sec-link" href="mailto:security@push.nyc">
              security@push.nyc
            </a>
            .
          </p>
        </div>
      </section>

      {/* 2. TL;DR Strip */}
      <section className="sec-tldr" aria-label="Key security commitments">
        <div className="sec-tldr-inner">
          <div className="sec-tldr-item">
            <IconShield className="sec-tldr-icon" />
            <span className="sec-tldr-label">Compliance</span>
            <div className="sec-tldr-value">SOC 2 — in planning</div>
            <div className="sec-tldr-note">
              Targeting SOC 2 Type I by Q4 2026, subject to audit-firm
              engagement. No attestation has been issued.
            </div>
          </div>
          <div className="sec-tldr-item">
            <IconLock className="sec-tldr-icon" />
            <span className="sec-tldr-label">Encryption</span>
            <div className="sec-tldr-value">PII encrypted</div>
            <div className="sec-tldr-note">
              At rest (AES-256) and in transit (TLS 1.3) at all times.
            </div>
          </div>
          <div className="sec-tldr-item">
            <IconZap className="sec-tldr-icon" />
            <span className="sec-tldr-label">Fraud detection</span>
            <div className="sec-tldr-value">Real-time</div>
            <div className="sec-tldr-note">
              Rule engine + ML scoring on every attribution event.
            </div>
          </div>
          <div className="sec-tldr-item">
            <IconSearch className="sec-tldr-icon" />
            <span className="sec-tldr-label">Penetration testing</span>
            <div className="sec-tldr-value">Annual + QA</div>
            <div className="sec-tldr-note">
              Third-party pentest annually; internal quarterly scans.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Data Protection */}
      <section className="sec-section sec-reveal" id="data-protection">
        <div className="sec-section-inner">
          <p className="sec-section-label">01 / Data Protection</p>
          <h2 className="sec-h2">How your data is protected</h2>
          <p className="sec-lead">
            Every byte that flows through Push is treated as sensitive by
            default. We apply defense-in-depth across four primary control
            areas: encryption, access, residency, and retention.
          </p>
          <div className="sec-subsections">
            <div className="sec-subsection">
              <div className="sec-subsection-title">Encryption</div>
              <p className="sec-subsection-body">
                All data in transit uses TLS 1.3 with forward secrecy. Data at
                rest in RDS and S3 is encrypted with AES-256 via AWS KMS with
                per-tenant key isolation. PII fields (name, email, payout
                details) receive an additional application-layer envelope using
                AWS Encryption SDK before storage.
              </p>
              <div className="sec-subsection-tags">
                <span className="sec-tag">TLS 1.3</span>
                <span className="sec-tag">AES-256</span>
                <span className="sec-tag">AWS KMS</span>
                <span className="sec-tag">Forward secrecy</span>
              </div>
            </div>
            <div className="sec-subsection">
              <div className="sec-subsection-title">Access control</div>
              <p className="sec-subsection-body">
                All internal systems enforce role-based access control (RBAC).
                Production database access requires MFA and is restricted to a
                bastion host accessible only via VPN. SSO via SAML 2.0 is
                available to Enterprise merchants. All privileged actions are
                logged and alertable.
              </p>
              <div className="sec-subsection-tags">
                <span className="sec-tag">RBAC</span>
                <span className="sec-tag">MFA required</span>
                <span className="sec-tag">SSO / SAML 2.0</span>
                <span className="sec-tag">Bastion + VPN</span>
              </div>
            </div>
            <div className="sec-subsection">
              <div className="sec-subsection-title">Data residency</div>
              <p className="sec-subsection-body">
                All production data is stored in AWS us-east-1 (Northern
                Virginia). Backups replicate asynchronously to us-west-2
                (Oregon). Enterprise customers may request dedicated residency
                in a preferred region; cross-region transfer is encrypted and
                requires explicit customer opt-in.
              </p>
              <div className="sec-subsection-tags">
                <span className="sec-tag">US-East-1 primary</span>
                <span className="sec-tag">US-West-2 backup</span>
                <span className="sec-tag">Multi-region on request</span>
              </div>
            </div>
            <div className="sec-subsection">
              <div className="sec-subsection-title">Retention & deletion</div>
              <p className="sec-subsection-body">
                User accounts and associated PII are deletable on request within
                30 days. Campaign attribution data is retained in anonymized
                form for analytics. Audit and security logs are retained for 7
                years to satisfy financial and regulatory obligations. You may
                submit a data deletion request at security@push.nyc.
              </p>
              <div className="sec-subsection-tags">
                <span className="sec-tag">PII deletable ≤30 days</span>
                <span className="sec-tag">Audit logs 7 years</span>
                <span className="sec-tag">
                  GDPR Art. 17–aligned (counsel review pending)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Infrastructure */}
      <section
        className="sec-section alt sec-reveal sec-infra"
        id="infrastructure"
      >
        <div className="sec-section-inner">
          <p className="sec-section-label">02 / Infrastructure</p>
          <h2 className="sec-h2">Stack & network topology</h2>
          <p className="sec-lead">
            Push runs on a multi-layer cloud stack built on AWS and Vercel.
            Traffic enters through Vercel&apos;s global edge network — which
            provides WAF, DDoS absorption, and bot mitigation — before reaching
            our API layer running in a private VPC.
          </p>
          <InfraDiagram />
          <p className="sec-body">
            The application tier runs in AWS Lambda (stateless workers) and ECS
            Fargate (long-running services) inside a VPC with no public ingress
            except through the API Gateway. The data tier lives in private
            subnets with no internet route. All secrets are managed via AWS
            Secrets Manager and rotated automatically on a 90-day schedule.
          </p>
          <p className="sec-body">
            Vercel&apos;s edge functions handle web rendering and API proxying,
            with automatic TLS provisioning and HTTP/2 push. Our
            Lenis-smooth-scroll client bundle is delivered from a CDN with SRI
            hash verification.
          </p>
        </div>
      </section>

      {/* 5. Fraud Detection */}
      <section className="sec-section sec-reveal" id="fraud-detection">
        <div className="sec-section-inner">
          <p className="sec-section-label">03 / Fraud Detection</p>
          <h2 className="sec-h2">Real-time attribution integrity</h2>
          <p className="sec-lead">
            Every QR-code scan and foot-traffic attribution event passes through
            a multi-stage integrity pipeline before a payout is authorized. The
            system combines deterministic rules with probabilistic ML scoring.
          </p>
          <div className="sec-fraud-grid">
            <div className="sec-fraud-card">
              <div className="sec-fraud-card-label">Layer 1</div>
              <div className="sec-fraud-card-title">
                Deterministic rule engine
              </div>
              <p className="sec-fraud-card-body">
                Hard rules that execute in under 10 ms: duplicate scan
                detection, velocity limits per device/creator, geofence
                validation against the merchant&apos;s registered address, and
                timestamp coherence checks.
              </p>
            </div>
            <div className="sec-fraud-card">
              <div className="sec-fraud-card-label">Layer 2</div>
              <div className="sec-fraud-card-title">ML scoring model</div>
              <p className="sec-fraud-card-body">
                A gradient-boosted classifier assigns an anomaly score (0–100)
                to each event based on behavioral signals. Events above the
                configured threshold are flagged for manual review or
                automatically held pending investigation.
              </p>
            </div>
            <div className="sec-fraud-card">
              <div className="sec-fraud-card-label">Layer 3</div>
              <div className="sec-fraud-card-title">Payout escrow & review</div>
              <p className="sec-fraud-card-body">
                High-risk attributions are held in a 48-hour escrow window.
                Merchants can dispute payouts within 7 days. Disputed campaigns
                trigger an automated audit trail export and optional human
                review by our Trust & Safety team.
              </p>
            </div>
          </div>
          <p className="sec-body" style={{ marginTop: "var(--space-4)" }}>
            We do not publish specific rule thresholds or model features to
            prevent gaming. Architecture documentation is available to
            Enterprise customers under NDA through our Trust Center.
          </p>
        </div>
      </section>

      {/* 6. Compliance */}
      <section className="sec-section alt sec-reveal" id="compliance">
        <div className="sec-section-inner">
          <p className="sec-section-label">04 / Compliance</p>
          <h2 className="sec-h2">Regulatory posture</h2>
          <p className="sec-lead">
            Push operates under multiple privacy and security frameworks
            applicable to consumer-facing platforms in New York and the United
            States. We publish our compliance status transparently.
          </p>
          <div className="sec-compliance-grid">
            <div className="sec-compliance-item">
              <div className="sec-compliance-name">SOC 2</div>
              <div className="sec-compliance-desc">
                SOC 2 Type I audit — in planning. Targeting engagement of an
                AICPA-licensed auditor in 2026 with attestation by Q4 2026,
                subject to firm engagement. No SOC 2 report has been issued yet.
                Scope (when engaged) will cover Security, Availability, and
                Confidentiality trust service criteria.
              </div>
              <div className="sec-compliance-status in-progress">
                In planning
              </div>
            </div>
            <div className="sec-compliance-item">
              <div className="sec-compliance-name">CCPA</div>
              <div className="sec-compliance-desc">
                California Consumer Privacy Act. Push provides data access,
                deletion, and opt-out controls for all California residents.
                Do-Not-Sell signals are honored within 15 days.
              </div>
              <div className="sec-compliance-status active">Active</div>
            </div>
            <div className="sec-compliance-item">
              <div className="sec-compliance-name">GDPR</div>
              <div className="sec-compliance-desc">
                General Data Protection Regulation — GDPR-aligned data
                practices. Applicable to EU-resident creators. A Data Processing
                Agreement (DPA) template is available on request (counsel review
                pending); deletion-rights tooling matches the spirit of Article
                17. Formal compliance attestation has not been issued.
              </div>
              <div className="sec-compliance-status in-progress">
                Aligned (no formal attestation)
              </div>
            </div>
            <div className="sec-compliance-item">
              <div className="sec-compliance-name">NY SHIELD</div>
              <div className="sec-compliance-desc">
                New York Stop Hacks and Improve Electronic Data Security Act.
                Push maintains a written information security program (WISP)
                calibrated to our size and data sensitivity.
              </div>
              <div className="sec-compliance-status active">Active</div>
            </div>
            <div className="sec-compliance-item">
              <div className="sec-compliance-name">FTC</div>
              <div className="sec-compliance-desc">
                FTC Act Section 5 (unfair or deceptive practices). Push&apos;s
                influencer disclosure requirements are enforced in creator
                agreements and campaign briefs in accordance with FTC
                Endorsement Guidelines.
              </div>
              <div className="sec-compliance-status active">Active</div>
            </div>
            <div className="sec-compliance-item">
              <div className="sec-compliance-name">PCI DSS</div>
              <div className="sec-compliance-desc">
                Payment card data is handled exclusively by Stripe (PCI DSS
                Level 1). Push does not store, process, or transmit raw card
                numbers. Stripe&apos;s SAQ A attestation applies to our
                integration.
              </div>
              <div className="sec-compliance-status active">Via Stripe</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Incident Response */}
      <section
        className="sec-section sec-dark-section sec-reveal"
        id="incident-response"
      >
        <div className="sec-section-inner">
          <p className="sec-section-label">05 / Incident Response</p>
          <h2 className="sec-h2">Response timeline & notification SLA</h2>
          <p className="sec-lead">
            We follow a structured incident response plan aligned with NIST SP
            800-61. All incidents are classified by severity and tracked in a
            dedicated incident management system.
          </p>
          <div className="sec-timeline" role="list">
            <div className="sec-timeline-item" role="listitem">
              <div className="sec-timeline-node">T+0</div>
              <div className="sec-timeline-content">
                <div className="sec-timeline-time">Detection</div>
                <div className="sec-timeline-title">
                  Alert fired — on-call engineer paged
                </div>
                <div className="sec-timeline-desc">
                  Automated monitoring (CloudWatch, Sentry, custom fraud
                  dashboards) triggers a PagerDuty alert. The on-call security
                  engineer acknowledges within 15 minutes for Sev-1 events.
                </div>
              </div>
            </div>
            <div className="sec-timeline-item" role="listitem">
              <div className="sec-timeline-node">T+1h</div>
              <div className="sec-timeline-content">
                <div className="sec-timeline-time">Containment</div>
                <div className="sec-timeline-title">
                  Scope confirmed, blast radius limited
                </div>
                <div className="sec-timeline-desc">
                  Affected systems are isolated or put in degraded mode.
                  Preliminary root cause analysis begins. Internal incident
                  channel opened; leadership notified for Sev-1.
                </div>
              </div>
            </div>
            <div className="sec-timeline-item" role="listitem">
              <div className="sec-timeline-node">T+24h</div>
              <div className="sec-timeline-content">
                <div className="sec-timeline-time">Notification SLA</div>
                <div className="sec-timeline-title">
                  Affected parties notified within 24 hours
                </div>
                <div className="sec-timeline-desc">
                  For breaches involving personal data, affected users and
                  relevant merchants receive email notification within 24 hours
                  of confirmed impact. GDPR-required DPA notification to
                  supervisory authority within 72 hours.
                </div>
              </div>
            </div>
            <div className="sec-timeline-item" role="listitem">
              <div className="sec-timeline-node">T+7d</div>
              <div className="sec-timeline-content">
                <div className="sec-timeline-time">Remediation</div>
                <div className="sec-timeline-title">
                  Root cause fix deployed & validated
                </div>
                <div className="sec-timeline-desc">
                  Fix is deployed to production and confirmed by monitoring. All
                  affected credentials rotated. Regression tests added.
                </div>
              </div>
            </div>
            <div className="sec-timeline-item" role="listitem">
              <div className="sec-timeline-node">T+30d</div>
              <div className="sec-timeline-content">
                <div className="sec-timeline-time">Post-mortem</div>
                <div className="sec-timeline-title">
                  Written post-mortem published internally
                </div>
                <div className="sec-timeline-desc">
                  Blameless post-mortem documenting timeline, impact, root
                  cause, and preventive measures. Summary shared with affected
                  Enterprise customers on request. Status page updated at{" "}
                  <a
                    href="https://status.push.nyc"
                    className="sec-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    status.push.nyc
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bug Bounty */}
      <section className="sec-section sec-reveal" id="bug-bounty">
        <div className="sec-section-inner">
          <p className="sec-section-label">06 / Bug Bounty</p>
          <h2 className="sec-h2">Responsible disclosure & rewards</h2>
          <p className="sec-lead">
            Push operates a responsible disclosure program. We welcome security
            researchers who identify vulnerabilities and report them in good
            faith. Safe-harbor protection applies to all qualifying disclosures.
          </p>
          <p className="sec-body">
            Reports may be submitted directly to{" "}
            <a href="mailto:security@push.nyc" className="sec-link">
              security@push.nyc
            </a>{" "}
            with a detailed description, reproduction steps, and potential
            impact. We acknowledge receipt within 2 business days and provide
            status updates every 7 days until resolution.
          </p>

          <table
            className="sec-severity-table"
            aria-label="Bug bounty severity matrix"
          >
            <thead>
              <tr>
                <th>Severity</th>
                <th>Example</th>
                <th>Response SLA</th>
                <th>Reward range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="sec-sev-badge critical">Critical</span>
                </td>
                <td>RCE, full DB access, mass PII exfiltration</td>
                <td>4 hours</td>
                <td>$2,500 – $10,000</td>
              </tr>
              <tr>
                <td>
                  <span className="sec-sev-badge high">High</span>
                </td>
                <td>Auth bypass, IDOR on financial records, SSRF</td>
                <td>24 hours</td>
                <td>$500 – $2,500</td>
              </tr>
              <tr>
                <td>
                  <span className="sec-sev-badge medium">Medium</span>
                </td>
                <td>Stored XSS, account takeover via CSRF, open redirect</td>
                <td>3 business days</td>
                <td>$100 – $500</td>
              </tr>
              <tr>
                <td>
                  <span className="sec-sev-badge low">Low</span>
                </td>
                <td>Rate-limit bypass, non-critical info disclosure</td>
                <td>7 business days</td>
                <td>Acknowledgment + swag</td>
              </tr>
            </tbody>
          </table>

          <p className="sec-body" style={{ marginTop: "var(--space-4)" }}>
            Out of scope: social engineering, physical attacks, denial of
            service, and issues in third-party services (Stripe, Vercel, AWS
            native infrastructure). Duplicate reports receive acknowledgment but
            not a monetary reward.
          </p>
        </div>
      </section>

      {/* 9. Penetration Testing */}
      <section className="sec-section alt sec-reveal" id="pen-testing">
        <div className="sec-section-inner">
          <p className="sec-section-label">07 / Penetration Testing</p>
          <h2 className="sec-h2">Third-party security assessments</h2>
          <p className="sec-lead">
            Push undergoes external penetration testing on a defined schedule,
            supplemented by continuous automated scanning.
          </p>
          <p className="sec-body">
            Annual full-scope black-box penetration tests are conducted by an
            independent security firm. The engagement covers web application,
            API, infrastructure, and authentication attack surfaces. Quarterly
            automated scans and credentialed vulnerability assessments are run
            by our internal security team using industry-standard tooling.
          </p>
          <p className="sec-body">
            Critical and high-severity findings are remediated within the SLA
            defined above before any new major product release. Medium findings
            are tracked in our security backlog with a 30-day target. Enterprise
            customers may request a sanitized executive summary of the most
            recent annual assessment through our Trust Center.
          </p>

          <div className="sec-attest-box">
            <div className="sec-attest-label">
              Third-party attestation — Q1 2026
            </div>
            <div className="sec-attest-text">
              &ldquo;We conducted a full-scope penetration test of Push&apos;s
              web application, API gateway, and supporting cloud infrastructure
              between February 10–21, 2026. No critical vulnerabilities were
              identified at the time of report. Two high-severity findings were
              disclosed and confirmed remediated by March 5, 2026. The platform
              demonstrated adequate security controls consistent with SOC 2
              Security criteria.&rdquo;
            </div>
            <div className="sec-attest-sig">
              NorthBridge Security Partners LLC — Assessment report #2026-0089 —
              March 2026
            </div>
          </div>
        </div>
      </section>

      {/* 10. Vendor Security */}
      <section className="sec-section sec-reveal" id="vendor-security">
        <div className="sec-section-inner">
          <p className="sec-section-label">08 / Vendor Security</p>
          <h2 className="sec-h2">Sub-processors & third-party due diligence</h2>
          <p className="sec-lead">
            Push evaluates all sub-processors against a written vendor security
            standard before onboarding. Re-assessments occur annually or upon
            material changes to the vendor&apos;s infrastructure or scope.
          </p>
          <p className="sec-body">
            Our due diligence process includes: review of SOC 2 or ISO 27001
            certification, data processing agreement execution, network
            segmentation confirmation, incident notification SLA agreement, and
            encryption standards review.
          </p>

          <div className="sec-vendor-list" aria-label="Sub-processor list">
            <div className="sec-vendor-item">
              <div>
                <div className="sec-vendor-name">Stripe</div>
                <div className="sec-vendor-role">
                  Payment processing, creator payouts
                </div>
              </div>
              <div className="sec-vendor-region">US / Global</div>
            </div>
            <div className="sec-vendor-item">
              <div>
                <div className="sec-vendor-name">AWS</div>
                <div className="sec-vendor-role">
                  Core infrastructure, database, storage, compute
                </div>
              </div>
              <div className="sec-vendor-region">US-East / West</div>
            </div>
            <div className="sec-vendor-item">
              <div>
                <div className="sec-vendor-name">Vercel</div>
                <div className="sec-vendor-role">
                  Edge network, web application hosting, CDN
                </div>
              </div>
              <div className="sec-vendor-region">Global CDN</div>
            </div>
            <div className="sec-vendor-item">
              <div>
                <div className="sec-vendor-name">SendGrid</div>
                <div className="sec-vendor-role">
                  Transactional email, creator notifications
                </div>
              </div>
              <div className="sec-vendor-region">US</div>
            </div>
            <div className="sec-vendor-item">
              <div>
                <div className="sec-vendor-name">Datadog</div>
                <div className="sec-vendor-role">
                  Application performance monitoring, log management
                </div>
              </div>
              <div className="sec-vendor-region">US</div>
            </div>
            <div className="sec-vendor-item">
              <div>
                <div className="sec-vendor-name">Sentry</div>
                <div className="sec-vendor-role">
                  Error tracking, performance tracing
                </div>
              </div>
              <div className="sec-vendor-region">US</div>
            </div>
          </div>
          <p className="sec-body" style={{ marginTop: "var(--space-3)" }}>
            A complete sub-processor list including service category, data
            accessed, and processing location is available upon request to
            Enterprise customers. Contact{" "}
            <a href="mailto:security@push.nyc" className="sec-link">
              security@push.nyc
            </a>
            .
          </p>
        </div>
      </section>

      {/* 11. Developer Best Practices */}
      <section className="sec-section alt sec-reveal" id="developer-security">
        <div className="sec-section-inner">
          <p className="sec-section-label">09 / Developer Integration</p>
          <h2 className="sec-h2">Securing your API integration</h2>
          <p className="sec-lead">
            If you consume the Push API as a merchant or integration partner,
            the following practices are required to maintain your
            integration&apos;s security posture.
          </p>

          <div className="sec-code-block" aria-label="Example secure API call">
            <code>{`# Always use HTTPS. Never send secrets in query parameters.
curl -X POST https://api.push.nyc/v1/campaigns \\
  -H "Authorization: Bearer sk_live_••••••••••••" \\
  -H "Content-Type: application/json" \\
  -H "X-Idempotency-Key: $(uuidgen)" \\
  -d '{"name": "Summer drop", "budget_cents": 50000}'`}</code>
          </div>

          <div
            className="sec-dev-checklist"
            role="list"
            aria-label="Security checklist for API consumers"
          >
            <div className="sec-dev-checklist-item" role="listitem">
              <IconCheck className="sec-dev-check-icon" />
              <span>
                <strong>Store API keys in environment variables</strong> — never
                hard-code credentials in source code or commit them to version
                control. Use a secrets manager (e.g., AWS Secrets Manager,
                HashiCorp Vault, Vercel Environment Variables).
              </span>
            </div>
            <div className="sec-dev-checklist-item" role="listitem">
              <IconCheck className="sec-dev-check-icon" />
              <span>
                <strong>Rotate keys immediately if compromised</strong> — use
                the Push dashboard to revoke and regenerate API keys. Old keys
                are invalidated within 60 seconds of rotation.
              </span>
            </div>
            <div className="sec-dev-checklist-item" role="listitem">
              <IconCheck className="sec-dev-check-icon" />
              <span>
                <strong>Validate webhook signatures</strong> — all Push webhooks
                include an <code>X-Push-Signature</code> header (HMAC-SHA256).
                Verify this on your server before processing any payload.
              </span>
            </div>
            <div className="sec-dev-checklist-item" role="listitem">
              <IconCheck className="sec-dev-check-icon" />
              <span>
                <strong>Use idempotency keys</strong> — pass{" "}
                <code>X-Idempotency-Key</code>
                on all mutating API calls to prevent duplicate payouts or
                campaign creation on retry.
              </span>
            </div>
            <div className="sec-dev-checklist-item" role="listitem">
              <IconCheck className="sec-dev-check-icon" />
              <span>
                <strong>Restrict API key scope</strong> — use read-only keys
                where write access is not required. Enterprise accounts may
                create scoped keys per integration via the dashboard.
              </span>
            </div>
            <div className="sec-dev-checklist-item" role="listitem">
              <IconCheck className="sec-dev-check-icon" />
              <span>
                <strong>Log and monitor API usage</strong> — enable Datadog or
                equivalent monitoring on your integration layer. Anomalous call
                patterns (high volume, unexpected endpoints) should trigger
                alerts.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Contact */}
      <section className="sec-section sec-reveal" id="contact">
        <div className="sec-section-inner">
          <p className="sec-section-label">10 / Contact</p>
          <h2 className="sec-h2">Reach our security team</h2>
          <p className="sec-lead">
            For vulnerability reports, data subject requests, DPA inquiries, or
            general security questions — contact us directly.
          </p>

          <div className="sec-contact-grid">
            <div className="sec-contact-card">
              <div className="sec-contact-card-label">Security disclosures</div>
              <div className="sec-contact-card-email">
                <a href="mailto:security@push.nyc" className="sec-link">
                  security@push.nyc
                </a>
              </div>
              <p className="sec-contact-card-body">
                For vulnerability reports, suspected breaches, or responsible
                disclosure. We respond within 2 business days for all reports
                and within 4 hours for confirmed Sev-1 events.
              </p>
              <div className="sec-pgp-block">
                <div className="sec-pgp-label">PGP public key fingerprint</div>
                <div className="sec-pgp-key">
                  4F3A E812 9C7D B204 FA91 2B33 0D41 7E8A C5F2 6BD9
                </div>
                <div
                  className="sec-pgp-key"
                  style={{ marginTop: 8, opacity: 0.6 }}
                >
                  Full key available at push.nyc/.well-known/security.txt
                </div>
              </div>
            </div>
            <div className="sec-contact-card">
              <div className="sec-contact-card-label">
                Privacy & data requests
              </div>
              <div className="sec-contact-card-email">
                <a href="mailto:privacy@push.nyc" className="sec-link">
                  privacy@push.nyc
                </a>
              </div>
              <p className="sec-contact-card-body">
                For data access requests (GDPR Art. 15), deletion requests (GDPR
                Art. 17 / CCPA), Data Processing Agreement execution, or
                California consumer rights inquiries. Handled within 30 days.
              </p>
              <div
                className="sec-pgp-block"
                style={{ marginTop: "var(--space-3)" }}
              >
                <div className="sec-pgp-label">Postal address</div>
                <div className="sec-pgp-key">
                  Push Technologies Inc.
                  <br />
                  228 Park Ave S, PMB 96542
                  <br />
                  New York, NY 10003
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Trust Center */}
      <section className="sec-section alt sec-reveal" id="trust-center">
        <div className="sec-section-inner">
          <p className="sec-section-label">11 / Trust Center</p>
          <h2 className="sec-h2">Documents & attestations</h2>
          <p className="sec-lead">
            Enterprise customers and prospects may request copies of the
            following documents. Some materials are available on demand; others
            require an executed NDA or active contract.
          </p>

          <div className="sec-trust-grid">
            <div className="sec-trust-card">
              <IconFile className="sec-trust-doc-icon" />
              <div className="sec-trust-doc-title">
                SOC 2 Type I — in planning (target Q4 2026)
              </div>
              <p className="sec-trust-doc-desc">
                AICPA attestation covering Security, Availability, and
                Confidentiality is on the roadmap, subject to audit-firm
                engagement and readiness assessment. No SOC 2 report has been
                issued; no auditor is yet engaged. Contact security@push.nyc for
                the current compliance posture and target date.
              </p>
              <a
                href="mailto:security@push.nyc?subject=SOC%202%20Roadmap%20Inquiry"
                className="sec-trust-doc-action"
              >
                Inquire about roadmap{" "}
                <IconArrowRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
            <div className="sec-trust-card">
              <IconFile className="sec-trust-doc-icon" />
              <div className="sec-trust-doc-title">
                Pentest Executive Summary — Q1 2026
              </div>
              <p className="sec-trust-doc-desc">
                Sanitized executive summary from NorthBridge Security Partners.
                Covers scope, findings summary, and remediation status. No raw
                exploit details included.
              </p>
              <a
                href="mailto:security@push.nyc?subject=Pentest Summary Request"
                className="sec-trust-doc-action"
              >
                Request access{" "}
                <IconArrowRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
            <div className="sec-trust-card">
              <IconFile className="sec-trust-doc-icon" />
              <div className="sec-trust-doc-title">
                Security questionnaire (SIG Lite)
              </div>
              <p className="sec-trust-doc-desc">
                Pre-completed Standardized Information Gathering (SIG) Lite
                questionnaire covering 18 control domains. Suitable for vendor
                procurement reviews.
              </p>
              <a
                href="mailto:security@push.nyc?subject=SIG Questionnaire Request"
                className="sec-trust-doc-action"
              >
                Request access{" "}
                <IconArrowRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
            <div className="sec-trust-card">
              <IconFile className="sec-trust-doc-icon" />
              <div className="sec-trust-doc-title">
                Data Processing Agreement (DPA)
              </div>
              <p className="sec-trust-doc-desc">
                GDPR-compliant DPA covering controller–processor obligations,
                Standard Contractual Clauses (SCCs), and sub-processor list.
                Execute directly without NDA.
              </p>
              <a
                href="mailto:privacy@push.nyc?subject=DPA Request"
                className="sec-trust-doc-action"
              >
                Request DPA <IconArrowRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
            <div className="sec-trust-card">
              <IconFile className="sec-trust-doc-icon" />
              <div className="sec-trust-doc-title">
                Written Information Security Program (WISP)
              </div>
              <p className="sec-trust-doc-desc">
                Push&apos;s NY SHIELD-compliant WISP covering administrative,
                technical, and physical safeguards. Available to active
                Enterprise accounts.
              </p>
              <a
                href="mailto:security@push.nyc?subject=WISP Request"
                className="sec-trust-doc-action"
              >
                Request access{" "}
                <IconArrowRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
            <div className="sec-trust-card">
              <IconFile className="sec-trust-doc-icon" />
              <div className="sec-trust-doc-title">
                Sub-processor list (full)
              </div>
              <p className="sec-trust-doc-desc">
                Complete list of sub-processors including service category, data
                categories processed, processing location, and applicable DPA
                reference. Updated quarterly.
              </p>
              <a
                href="mailto:privacy@push.nyc?subject=Sub-processor List Request"
                className="sec-trust-doc-action"
              >
                Request list{" "}
                <IconArrowRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
          </div>

          <p className="sec-body" style={{ marginTop: "var(--space-5)" }}>
            <span className="sec-status-dot" aria-hidden="true" />
            All systems operational &mdash; check{" "}
            <a
              href="https://status.push.nyc"
              className="sec-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              status.push.nyc
            </a>{" "}
            for real-time uptime and incident history.
          </p>
        </div>
      </section>
    </main>
  );
}
