"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./api-docs.css";

/* ── Copy button ─────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      className={`api-code-copy${copied ? " copied" : ""}`}
      onClick={handle}
      aria-label="Copy code"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ── Code block ──────────────────────────────────────────── */
function CodeBlock({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const getText = () => preRef.current?.textContent ?? "";

  return (
    <div className="api-code-block">
      <div className="api-code-header">
        <span className="api-code-lang">{lang}</span>
        <CopyButton text={getText()} />
      </div>
      <div className="api-code-body">
        <pre ref={preRef}>{children}</pre>
      </div>
    </div>
  );
}

/* ── Method badge ────────────────────────────────────────── */
function MethodBadge({
  method,
}: {
  method: "GET" | "POST" | "PATCH" | "DELETE";
}) {
  const cls = `api-method api-method--${method.toLowerCase()}`;
  return <span className={cls}>{method}</span>;
}

/* ── Endpoint card ───────────────────────────────────────── */
function Endpoint({
  method,
  path,
  desc,
  children,
}: {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="api-endpoint api-reveal">
      <div className="api-endpoint-header">
        <MethodBadge method={method} />
        <code className="api-endpoint-path">{path}</code>
      </div>
      <div className="api-endpoint-body">
        <p className="api-endpoint-desc">{desc}</p>
        {children}
      </div>
    </div>
  );
}

/* ── Left TOC nav ────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: "Getting started",
    items: [
      { id: "quickstart", label: "Quickstart" },
      { id: "auth", label: "Authentication" },
    ],
  },
  {
    label: "Resources",
    items: [
      { id: "campaigns", label: "Campaigns" },
      { id: "applications", label: "Applications" },
      { id: "qr-codes", label: "QR Codes" },
      { id: "attribution", label: "Attribution" },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "webhooks", label: "Webhooks" },
      { id: "errors", label: "Error Codes" },
      { id: "sdks", label: "SDKs" },
    ],
  },
];

function TocNav({ active }: { active: string }) {
  return (
    <nav className="api-toc" aria-label="API documentation navigation">
      {NAV_SECTIONS.map((section) => (
        <div className="api-toc-section" key={section.label}>
          <span className="api-toc-label">{section.label}</span>
          {section.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

/* ── Right panel code examples ───────────────────────────── */
const LANGS = ["cURL", "JavaScript", "Python", "Ruby"] as const;
type Lang = (typeof LANGS)[number];

function ExamplesPanel() {
  const [lang, setLang] = useState<Lang>("cURL");

  const examples: Record<Lang, React.ReactNode> = {
    cURL: (
      <>
        <p className="api-example-title">List campaigns</p>
        <CodeBlock lang="bash">
          {`curl https://api.pushapp.co/v1/campaigns \\
  -H `}
          <span className="tok-str">
            &apos;Authorization: Bearer sk_live_&lt;key&gt;&apos;
          </span>
        </CodeBlock>
        <p className="api-example-title">Create campaign</p>
        <CodeBlock lang="bash">
          {`curl -X POST https://api.pushapp.co/v1/campaigns \\
  -H `}
          <span className="tok-str">
            &apos;Authorization: Bearer sk_live_&lt;key&gt;&apos;
          </span>
          {` \\
  -H `}
          <span className="tok-str">
            &apos;Content-Type: application/json&apos;
          </span>
          {` \\
  -d `}
          <span className="tok-str">
            &apos;&#123; "name": "Summer Drop", "budget_cents": 50000,
            "payout_per_visit_cents": 300 &#125;&apos;
          </span>
        </CodeBlock>
        <p className="api-example-title">Response</p>
        <CodeBlock lang="json">
          {`{
  `}
          <span className="tok-key">&quot;id&quot;</span>
          {`: `}
          <span className="tok-str">&quot;camp_01HX...&quot;</span>
          {`,
  `}
          <span className="tok-key">&quot;name&quot;</span>
          {`: `}
          <span className="tok-str">&quot;Summer Drop&quot;</span>
          {`,
  `}
          <span className="tok-key">&quot;status&quot;</span>
          {`: `}
          <span className="tok-str">&quot;draft&quot;</span>
          {`,
  `}
          <span className="tok-key">&quot;budget_cents&quot;</span>
          {`: `}
          <span className="tok-num">50000</span>
          {`,
  `}
          <span className="tok-key">&quot;created_at&quot;</span>
          {`: `}
          <span className="tok-str">&quot;2026-04-17T00:00:00Z&quot;</span>
          {`
}`}
        </CodeBlock>
      </>
    ),
    JavaScript: (
      <>
        <p className="api-example-title">Install SDK</p>
        <CodeBlock lang="bash">npm install @pushapp/sdk</CodeBlock>
        <p className="api-example-title">List campaigns</p>
        <CodeBlock lang="javascript">
          {`import { `}
          <span className="tok-fn">Push</span>
          {` } from `}
          <span className="tok-str">&apos;@pushapp/sdk&apos;</span>
          {`;

`}
          <span className="tok-kw">const</span>
          {` push = `}
          <span className="tok-kw">new</span>
          {` `}
          <span className="tok-fn">Push</span>
          {`({
  apiKey: `}
          <span className="tok-str">&apos;sk_live_&lt;key&gt;&apos;</span>
          {`
});

`}
          <span className="tok-kw">const</span>
          {` campaigns = `}
          <span className="tok-kw">await</span>
          {` push.campaigns.`}
          <span className="tok-fn">list</span>
          {`({
  status: `}
          <span className="tok-str">&apos;active&apos;</span>
          {`,
  limit: `}
          <span className="tok-num">20</span>
          {`
});`}
        </CodeBlock>
        <p className="api-example-title">Create campaign</p>
        <CodeBlock lang="javascript">
          {``}
          <span className="tok-kw">const</span>
          {` campaign = `}
          <span className="tok-kw">await</span>
          {` push.campaigns.`}
          <span className="tok-fn">create</span>
          {`({
  name: `}
          <span className="tok-str">&apos;Summer Drop&apos;</span>
          {`,
  budget_cents: `}
          <span className="tok-num">50000</span>
          {`,
  payout_per_visit_cents: `}
          <span className="tok-num">300</span>
          {`,
  start_date: `}
          <span className="tok-str">&apos;2026-05-01&apos;</span>
          {`
});`}
        </CodeBlock>
      </>
    ),
    Python: (
      <>
        <p className="api-example-title">Install SDK</p>
        <CodeBlock lang="bash">pip install pushapp</CodeBlock>
        <p className="api-example-title">List campaigns</p>
        <CodeBlock lang="python">
          {``}
          <span className="tok-kw">from</span>
          {` pushapp `}
          <span className="tok-kw">import</span>
          {` Push

push = `}
          <span className="tok-fn">Push</span>
          {`(api_key=`}
          <span className="tok-str">&quot;sk_live_&lt;key&gt;&quot;</span>
          {`)

campaigns = push.campaigns.`}
          <span className="tok-fn">list</span>
          {`(
    status=`}
          <span className="tok-str">&quot;active&quot;</span>
          {`,
    limit=`}
          <span className="tok-num">20</span>
          {`
)`}
        </CodeBlock>
        <p className="api-example-title">Create campaign</p>
        <CodeBlock lang="python">
          {`campaign = push.campaigns.`}
          <span className="tok-fn">create</span>
          {`(
    name=`}
          <span className="tok-str">&quot;Summer Drop&quot;</span>
          {`,
    budget_cents=`}
          <span className="tok-num">50000</span>
          {`,
    payout_per_visit_cents=`}
          <span className="tok-num">300</span>
          {`,
    start_date=`}
          <span className="tok-str">&quot;2026-05-01&quot;</span>
          {`
)`}
        </CodeBlock>
      </>
    ),
    Ruby: (
      <>
        <p className="api-example-title">Install SDK</p>
        <CodeBlock lang="bash">gem install push-ruby</CodeBlock>
        <p className="api-example-title">List campaigns</p>
        <CodeBlock lang="ruby">
          {`require `}
          <span className="tok-str">&apos;push&apos;</span>
          {`

Push.api_key = `}
          <span className="tok-str">&apos;sk_live_&lt;key&gt;&apos;</span>
          {`

campaigns = Push::Campaign.`}
          <span className="tok-fn">list</span>
          {`(
  status: `}
          <span className="tok-str">&apos;active&apos;</span>
          {`,
  limit: `}
          <span className="tok-num">20</span>
          {`
)`}
        </CodeBlock>
        <p className="api-example-title">Create campaign</p>
        <CodeBlock lang="ruby">
          {`campaign = Push::Campaign.`}
          <span className="tok-fn">create</span>
          {`(
  name: `}
          <span className="tok-str">&apos;Summer Drop&apos;</span>
          {`,
  budget_cents: `}
          <span className="tok-num">50000</span>
          {`,
  payout_per_visit_cents: `}
          <span className="tok-num">300</span>
          {`
)`}
        </CodeBlock>
      </>
    ),
  };

  return (
    <aside className="api-examples" aria-label="Code examples">
      <div className="api-tabs" role="tablist">
        {LANGS.map((l) => (
          <button
            key={l}
            className={`api-tab${lang === l ? " active" : ""}`}
            role="tab"
            aria-selected={lang === l}
            onClick={() => setLang(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="api-example-panel active">{examples[lang]}</div>
    </aside>
  );
}

/* ── Scroll reveal hook ──────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".api-reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Active section tracking ─────────────────────────────── */
function useActiveSection() {
  const [active, setActive] = useState("quickstart");
  useEffect(() => {
    const ids = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { threshold: 0, rootMargin: "-80px 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

/* ══════════════════════════════════════════════════════════ */
/*   Page                                                      */
/* ══════════════════════════════════════════════════════════ */
export default function ApiDocsPage() {
  useScrollReveal();
  const active = useActiveSection();

  return (
    <main className="api-docs-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="api-hero">
        <div className="api-hero-inner">
          <p className="api-hero-eyebrow">Developer Reference</p>
          <h1 className="api-hero-title">Push API.</h1>
          <p className="api-hero-sub">
            Programmatic access to attribution, creator matching, and campaign
            management. Build on the same infrastructure powering thousands of
            local campaigns across NYC.
          </p>
          <div className="api-hero-meta">
            <span className="api-version-badge">v1.0</span>
            <span className="api-status-dot">All systems operational</span>
          </div>
        </div>
      </header>

      {/* ── Three-column layout ───────────────────────────── */}
      <div className="api-docs-layout">
        {/* Left: TOC */}
        <TocNav active={active} />

        {/* Center: Documentation body */}
        <article className="api-content">
          {/* ── Quickstart ─────────────────────────────────── */}
          <section id="quickstart" className="api-section">
            <p className="api-section-eyebrow">01</p>
            <h2 className="api-section-title">Quickstart</h2>
            <p className="api-section-desc">
              Get your first API response in under two minutes. You need an
              active Push account and at least one campaign to follow along.
            </p>

            <ol className="api-steps">
              <li className="api-step api-reveal">
                <span className="api-step-num">01</span>
                <div className="api-step-body">
                  <h3 className="api-step-title">Retrieve your API key</h3>
                  <p className="api-step-desc">
                    Navigate to{" "}
                    <Link href="/settings/api" className="api-inline-code">
                      Settings → API Keys
                    </Link>{" "}
                    and create a new key. Keys are prefixed{" "}
                    <code className="api-inline-code">sk_live_</code> for
                    production and{" "}
                    <code className="api-inline-code">sk_test_</code> for
                    sandbox. Store your key securely — it is shown only once.
                  </p>
                </div>
              </li>
              <li className="api-step api-reveal">
                <span className="api-step-num">02</span>
                <div className="api-step-body">
                  <h3 className="api-step-title">Make your first request</h3>
                  <p className="api-step-desc">
                    All requests require the{" "}
                    <code className="api-inline-code">Authorization</code>{" "}
                    header. Paste your key and run the command below:
                  </p>
                  <CodeBlock lang="bash">
                    {`curl https://api.pushapp.co/v1/campaigns \\
  -H `}
                    <span className="tok-str">
                      &apos;Authorization: Bearer sk_live_YOUR_KEY&apos;
                    </span>
                  </CodeBlock>
                </div>
              </li>
              <li className="api-step api-reveal">
                <span className="api-step-num">03</span>
                <div className="api-step-body">
                  <h3 className="api-step-title">Inspect the response</h3>
                  <p className="api-step-desc">
                    A successful response returns HTTP 200 with a JSON body. All
                    collections are paginated using cursor-based pagination.
                  </p>
                  <CodeBlock lang="json">
                    {`{
  `}
                    <span className="tok-key">&quot;object&quot;</span>
                    {`: `}
                    <span className="tok-str">&quot;list&quot;</span>
                    {`,
  `}
                    <span className="tok-key">&quot;data&quot;</span>
                    {`: [`}
                    <span className="tok-comment">/* Campaign objects */</span>
                    {`],
  `}
                    <span className="tok-key">&quot;has_more&quot;</span>
                    {`: `}
                    <span className="tok-bool">false</span>
                    {`,
  `}
                    <span className="tok-key">&quot;next_cursor&quot;</span>
                    {`: `}
                    <span className="tok-bool">null</span>
                    {`
}`}
                  </CodeBlock>
                </div>
              </li>
            </ol>

            {/* Rate limits */}
            <div className="api-subsection api-reveal">
              <h3 className="api-subsection-title">Rate limits</h3>
              <p className="api-subsection-desc">
                Limits apply per API key. Headers{" "}
                <code className="api-inline-code">X-RateLimit-Limit</code> and{" "}
                <code className="api-inline-code">X-RateLimit-Remaining</code>{" "}
                are included in every response.
              </p>
              <div className="api-table-wrap">
                <table className="api-rate-table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Requests / min</th>
                      <th>Requests / day</th>
                      <th>Burst</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Lite ($0/mo)</td>
                      <td>30</td>
                      <td>2,000</td>
                      <td>50</td>
                    </tr>
                    <tr>
                      <td>Essentials ($99/mo)</td>
                      <td>120</td>
                      <td>50,000</td>
                      <td>300</td>
                    </tr>
                    <tr>
                      <td>Pro (outcome-based)</td>
                      <td>600</td>
                      <td>500,000</td>
                      <td>1,200</td>
                    </tr>
                    <tr>
                      <td>Advanced ($349/mo)</td>
                      <td>1,200</td>
                      <td>Unlimited</td>
                      <td>2,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="api-note api-reveal">
                <p className="api-note-label">Note</p>
                <p className="api-note-body">
                  Exceeding a rate limit returns HTTP 429. Retry after the
                  number of seconds specified in the{" "}
                  <code className="api-inline-code">Retry-After</code> header.
                </p>
              </div>
            </div>
          </section>

          <hr className="api-divider" />

          {/* ── Auth ───────────────────────────────────────── */}
          <section id="auth" className="api-section">
            <p className="api-section-eyebrow">02</p>
            <h2 className="api-section-title">Authentication</h2>
            <p className="api-section-desc">
              The Push API uses Bearer token authentication over HTTPS. All
              requests to production endpoints must be authenticated.
            </p>

            <div className="api-subsection api-reveal">
              <h3 className="api-subsection-title">Bearer token format</h3>
              <CodeBlock lang="http">
                <span className="tok-header">Authorization</span>
                {`: Bearer `}
                <span className="tok-str">sk_live_xxxxxxxxxxxxxxxxxxxx</span>
              </CodeBlock>
              <div className="api-note api-reveal api-note--warn">
                <p className="api-note-label">Security</p>
                <p className="api-note-body">
                  Never expose API keys in client-side code or public
                  repositories. Use environment variables. Rotate compromised
                  keys immediately via the dashboard.
                </p>
              </div>
            </div>

            <div className="api-subsection api-reveal">
              <h3 className="api-subsection-title">Scoped permissions</h3>
              <p className="api-subsection-desc">
                When creating an API key, select only the scopes you need.
                Narrower scopes limit blast radius if a key is compromised.
              </p>
              <ul className="api-scopes-grid">
                {[
                  {
                    name: "campaigns:read",
                    desc: "List and retrieve campaign details",
                  },
                  {
                    name: "campaigns:write",
                    desc: "Create, update, and pause campaigns",
                  },
                  {
                    name: "applications:read",
                    desc: "List creator applications and status",
                  },
                  {
                    name: "applications:write",
                    desc: "Approve or reject creator applications",
                  },
                  {
                    name: "attribution:read",
                    desc: "Read QR scan events and attribution data",
                  },
                  {
                    name: "webhooks:write",
                    desc: "Register and manage webhook endpoints",
                  },
                  {
                    name: "qr:read",
                    desc: "Retrieve QR code assets and metadata",
                  },
                  {
                    name: "analytics:read",
                    desc: "Access aggregated campaign analytics",
                  },
                ].map((scope) => (
                  <li className="api-scope-item" key={scope.name}>
                    <code className="api-scope-name">{scope.name}</code>
                    <span className="api-scope-desc">{scope.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="api-divider" />

          {/* ── Campaigns ──────────────────────────────────── */}
          <section id="campaigns" className="api-section">
            <p className="api-section-eyebrow">03</p>
            <h2 className="api-section-title">Campaigns</h2>
            <p className="api-section-desc">
              Campaigns define payout budgets, creator requirements, and
              geographic targets. Creators apply to active campaigns; QR codes
              are generated per approved creator per campaign.
            </p>

            <Endpoint
              method="GET"
              path="/v1/campaigns"
              desc="Returns a cursor-paginated list of campaigns belonging to the authenticated merchant."
            >
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "status",
                        type: "string",
                        req: false,
                        desc: "Filter by status: draft | active | paused | completed",
                      },
                      {
                        name: "limit",
                        type: "integer",
                        req: false,
                        desc: "Number of results to return (1–100). Default: 20",
                      },
                      {
                        name: "cursor",
                        type: "string",
                        req: false,
                        desc: "Pagination cursor from previous response next_cursor",
                      },
                    ].map((p) => (
                      <tr key={p.name}>
                        <td>
                          <code className="api-param-name">{p.name}</code>
                        </td>
                        <td>
                          <code className="api-param-type">{p.type}</code>
                        </td>
                        <td>
                          {p.req ? (
                            <span className="api-param-required">Required</span>
                          ) : (
                            <span className="api-param-optional">Optional</span>
                          )}
                        </td>
                        <td>
                          <span className="api-param-desc">{p.desc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Endpoint>

            <Endpoint
              method="POST"
              path="/v1/campaigns"
              desc="Creates a new campaign in draft status. The campaign must be explicitly activated before creators can apply."
            >
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "name",
                        type: "string",
                        req: true,
                        desc: "Display name for the campaign (max 120 chars)",
                      },
                      {
                        name: "budget_cents",
                        type: "integer",
                        req: true,
                        desc: "Total budget in USD cents",
                      },
                      {
                        name: "payout_per_visit_cents",
                        type: "integer",
                        req: true,
                        desc: "Creator payout per attributed visit in USD cents",
                      },
                      {
                        name: "start_date",
                        type: "string",
                        req: false,
                        desc: "ISO 8601 date when campaign becomes active",
                      },
                      {
                        name: "end_date",
                        type: "string",
                        req: false,
                        desc: "ISO 8601 date when campaign closes",
                      },
                      {
                        name: "location",
                        type: "object",
                        req: false,
                        desc: "{ lat, lng, radius_meters } geographic targeting",
                      },
                      {
                        name: "min_creator_tier",
                        type: "string",
                        req: false,
                        desc: "Minimum creator tier: nano | micro | mid | macro | mega | elite",
                      },
                    ].map((p) => (
                      <tr key={p.name}>
                        <td>
                          <code className="api-param-name">{p.name}</code>
                        </td>
                        <td>
                          <code className="api-param-type">{p.type}</code>
                        </td>
                        <td>
                          {p.req ? (
                            <span className="api-param-required">Required</span>
                          ) : (
                            <span className="api-param-optional">Optional</span>
                          )}
                        </td>
                        <td>
                          <span className="api-param-desc">{p.desc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Endpoint>

            <Endpoint
              method="GET"
              path="/v1/campaigns/{id}"
              desc="Retrieves a single campaign by its unique identifier including budget spend to date."
            />

            <Endpoint
              method="PATCH"
              path="/v1/campaigns/{id}"
              desc="Partially updates a campaign. Status transitions: draft → active → paused → completed."
            />

            <Endpoint
              method="DELETE"
              path="/v1/campaigns/{id}"
              desc="Permanently archives a draft campaign. Active and completed campaigns cannot be deleted — use PATCH to set status: archived."
            />
          </section>

          <hr className="api-divider" />

          {/* ── Applications ───────────────────────────────── */}
          <section id="applications" className="api-section">
            <p className="api-section-eyebrow">04</p>
            <h2 className="api-section-title">Applications</h2>
            <p className="api-section-desc">
              Creators submit applications to join your campaigns. Review,
              approve, or reject applications via the API. Approving an
              application triggers QR code generation.
            </p>

            <Endpoint
              method="GET"
              path="/v1/campaigns/{campaign_id}/applications"
              desc="Lists all creator applications for a campaign, ordered by score descending by default."
            >
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "status",
                        type: "string",
                        req: false,
                        desc: "pending | approved | rejected | withdrawn",
                      },
                      {
                        name: "sort",
                        type: "string",
                        req: false,
                        desc: "score_desc (default) | created_at_asc | followers_desc",
                      },
                      {
                        name: "limit",
                        type: "integer",
                        req: false,
                        desc: "1–100. Default: 20",
                      },
                    ].map((p) => (
                      <tr key={p.name}>
                        <td>
                          <code className="api-param-name">{p.name}</code>
                        </td>
                        <td>
                          <code className="api-param-type">{p.type}</code>
                        </td>
                        <td>
                          {p.req ? (
                            <span className="api-param-required">Required</span>
                          ) : (
                            <span className="api-param-optional">Optional</span>
                          )}
                        </td>
                        <td>
                          <span className="api-param-desc">{p.desc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Endpoint>

            <Endpoint
              method="PATCH"
              path="/v1/applications/{id}"
              desc="Updates the status of an application. Approving generates a unique QR code for the creator."
            >
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code className="api-param-name">status</code>
                      </td>
                      <td>
                        <code className="api-param-type">string</code>
                      </td>
                      <td>
                        <span className="api-param-required">Required</span>
                      </td>
                      <td>
                        <span className="api-param-desc">
                          approved | rejected
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code className="api-param-name">rejection_reason</code>
                      </td>
                      <td>
                        <code className="api-param-type">string</code>
                      </td>
                      <td>
                        <span className="api-param-optional">Optional</span>
                      </td>
                      <td>
                        <span className="api-param-desc">
                          Human-readable reason shown to creator when rejected
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Endpoint>
          </section>

          <hr className="api-divider" />

          {/* ── QR Codes ───────────────────────────────────── */}
          <section id="qr-codes" className="api-section">
            <p className="api-section-eyebrow">05</p>
            <h2 className="api-section-title">QR Codes</h2>
            <p className="api-section-desc">
              Each approved creator-campaign pair generates a unique QR code.
              Scans of that code are cryptographically linked to the creator and
              campaign, enabling tamper-resistant attribution.
            </p>

            <Endpoint
              method="GET"
              path="/v1/qr-codes/{id}"
              desc="Retrieves QR code metadata including the SVG asset URL, scan count, and linked creator and campaign IDs."
            />

            <Endpoint
              method="GET"
              path="/v1/applications/{application_id}/qr-code"
              desc="Retrieves the QR code for a specific approved application."
            >
              <div className="api-note api-reveal">
                <p className="api-note-label">Asset delivery</p>
                <p className="api-note-body">
                  The <code className="api-inline-code">svg_url</code> field
                  returns a signed URL valid for 24 hours. The QR code encodes a
                  Push short-link that resolves to your campaign destination URL
                  with attribution parameters appended.
                </p>
              </div>
            </Endpoint>
          </section>

          <hr className="api-divider" />

          {/* ── Attribution ────────────────────────────────── */}
          <section id="attribution" className="api-section">
            <p className="api-section-eyebrow">06</p>
            <h2 className="api-section-title">Attribution</h2>
            <p className="api-section-desc">
              Attribution events are generated when a QR code is scanned and
              validated. Each event carries a confidence score, device
              fingerprint hash, and fraud flags.
            </p>

            <Endpoint
              method="GET"
              path="/v1/attribution/events"
              desc="Returns a time-ordered stream of QR scan attribution events across all campaigns."
            >
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "campaign_id",
                        type: "string",
                        req: false,
                        desc: "Filter events to a single campaign",
                      },
                      {
                        name: "creator_id",
                        type: "string",
                        req: false,
                        desc: "Filter events attributed to a specific creator",
                      },
                      {
                        name: "from",
                        type: "string",
                        req: false,
                        desc: "ISO 8601 start of time range (inclusive)",
                      },
                      {
                        name: "to",
                        type: "string",
                        req: false,
                        desc: "ISO 8601 end of time range (exclusive)",
                      },
                      {
                        name: "flagged",
                        type: "boolean",
                        req: false,
                        desc: "true returns only events flagged as suspicious",
                      },
                      {
                        name: "limit",
                        type: "integer",
                        req: false,
                        desc: "1–500. Default: 100",
                      },
                    ].map((p) => (
                      <tr key={p.name}>
                        <td>
                          <code className="api-param-name">{p.name}</code>
                        </td>
                        <td>
                          <code className="api-param-type">{p.type}</code>
                        </td>
                        <td>
                          {p.req ? (
                            <span className="api-param-required">Required</span>
                          ) : (
                            <span className="api-param-optional">Optional</span>
                          )}
                        </td>
                        <td>
                          <span className="api-param-desc">{p.desc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Endpoint>

            <Endpoint
              method="GET"
              path="/v1/attribution/summary"
              desc="Returns aggregated attribution metrics for a date range: total scans, unique visitors, validated visits, and spend-to-date."
            >
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "campaign_id",
                        type: "string",
                        req: false,
                        desc: "Scope summary to a single campaign",
                      },
                      {
                        name: "from",
                        type: "string",
                        req: true,
                        desc: "ISO 8601 start date",
                      },
                      {
                        name: "to",
                        type: "string",
                        req: true,
                        desc: "ISO 8601 end date",
                      },
                      {
                        name: "granularity",
                        type: "string",
                        req: false,
                        desc: "day | week | month. Default: day",
                      },
                    ].map((p) => (
                      <tr key={p.name}>
                        <td>
                          <code className="api-param-name">{p.name}</code>
                        </td>
                        <td>
                          <code className="api-param-type">{p.type}</code>
                        </td>
                        <td>
                          {p.req ? (
                            <span className="api-param-required">Required</span>
                          ) : (
                            <span className="api-param-optional">Optional</span>
                          )}
                        </td>
                        <td>
                          <span className="api-param-desc">{p.desc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Endpoint>
          </section>

          <hr className="api-divider" />

          {/* ── Webhooks ───────────────────────────────────── */}
          <section id="webhooks" className="api-section">
            <p className="api-section-eyebrow">07</p>
            <h2 className="api-section-title">Webhooks</h2>
            <p className="api-section-desc">
              Push delivers real-time event notifications to your HTTPS
              endpoints. Register up to 10 webhook endpoints per account.
            </p>

            <div className="api-subsection api-reveal">
              <h3 className="api-subsection-title">Event types</h3>
              <ul className="api-event-list">
                {[
                  {
                    name: "campaign.created",
                    desc: "A new campaign was created",
                  },
                  {
                    name: "campaign.activated",
                    desc: "A campaign became active and is accepting applications",
                  },
                  {
                    name: "campaign.paused",
                    desc: "A campaign was paused by the merchant or system",
                  },
                  {
                    name: "campaign.completed",
                    desc: "Budget exhausted or end date reached",
                  },
                  {
                    name: "application.submitted",
                    desc: "A creator applied to your campaign",
                  },
                  {
                    name: "application.approved",
                    desc: "You or auto-approval approved an application",
                  },
                  {
                    name: "application.rejected",
                    desc: "An application was rejected",
                  },
                  {
                    name: "qr.scanned",
                    desc: "A QR code was scanned (raw, not yet validated)",
                  },
                  {
                    name: "attribution.validated",
                    desc: "A scan passed fraud checks and was attributed",
                  },
                  {
                    name: "attribution.flagged",
                    desc: "A scan was flagged as suspicious — payout withheld",
                  },
                  {
                    name: "payout.released",
                    desc: "Creator payout released from escrow",
                  },
                  {
                    name: "budget.low",
                    desc: "Campaign budget below 20% remaining",
                  },
                ].map((ev) => (
                  <li className="api-event-item" key={ev.name}>
                    <code className="api-event-name">{ev.name}</code>
                    <span className="api-event-desc">{ev.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="api-subsection api-reveal">
              <h3 className="api-subsection-title">Signature verification</h3>
              <p className="api-subsection-desc">
                Every webhook request includes a{" "}
                <code className="api-inline-code">Push-Signature</code> header.
                Verify the signature to ensure events originate from Push.
              </p>
              <CodeBlock lang="javascript">
                {`import crypto from `}
                <span className="tok-str">&apos;node:crypto&apos;</span>
                {`;

`}
                <span className="tok-kw">function</span>
                {` `}
                <span className="tok-fn">verifyWebhook</span>
                {`(payload, signature, secret) {
  `}
                <span className="tok-kw">const</span>
                {` expected = crypto
    .`}
                <span className="tok-fn">createHmac</span>
                {`(`}
                <span className="tok-str">&apos;sha256&apos;</span>
                {`, secret)
    .`}
                <span className="tok-fn">update</span>
                {`(payload, `}
                <span className="tok-str">&apos;utf8&apos;</span>
                {`)
    .`}
                <span className="tok-fn">digest</span>
                {`(`}
                <span className="tok-str">&apos;hex&apos;</span>
                {`);

  `}
                <span className="tok-kw">return</span>
                {` crypto.`}
                <span className="tok-fn">timingSafeEqual</span>
                {`(
    Buffer.`}
                <span className="tok-fn">from</span>
                {`(expected),
    Buffer.`}
                <span className="tok-fn">from</span>
                {`(signature)
  );
}`}
              </CodeBlock>
            </div>

            <div className="api-subsection api-reveal">
              <h3 className="api-subsection-title">Retry policy</h3>
              <p className="api-subsection-desc">
                Push retries failed deliveries with exponential back-off. Your
                endpoint must return HTTP 200 within 10 seconds. After 72 hours
                of failures the webhook is disabled.
              </p>
              <div className="api-table-wrap">
                <table className="api-rate-table">
                  <thead>
                    <tr>
                      <th>Attempt</th>
                      <th>Delay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["1 (initial)", "Immediate"],
                      ["2", "5 minutes"],
                      ["3", "30 minutes"],
                      ["4", "2 hours"],
                      ["5", "8 hours"],
                      ["6+", "Every 24 hours"],
                    ].map(([attempt, delay]) => (
                      <tr key={attempt}>
                        <td>{attempt}</td>
                        <td>{delay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Endpoint
              method="POST"
              path="/v1/webhooks"
              desc="Registers a new webhook endpoint. Returns a signing secret — save it immediately."
            />
            <Endpoint
              method="DELETE"
              path="/v1/webhooks/{id}"
              desc="Permanently removes a webhook endpoint and stops event delivery to it."
            />
          </section>

          <hr className="api-divider" />

          {/* ── Errors ─────────────────────────────────────── */}
          <section id="errors" className="api-section">
            <p className="api-section-eyebrow">08</p>
            <h2 className="api-section-title">Error Codes</h2>
            <p className="api-section-desc">
              All errors follow a consistent structure. The{" "}
              <code className="api-inline-code">code</code> field is
              machine-readable; the{" "}
              <code className="api-inline-code">message</code> field is
              human-readable for display.
            </p>

            <CodeBlock lang="json">
              {`{
  `}
              <span className="tok-key">&quot;error&quot;</span>
              {`: {
    `}
              <span className="tok-key">&quot;code&quot;</span>
              {`: `}
              <span className="tok-str">&quot;campaign_not_found&quot;</span>
              {`,
    `}
              <span className="tok-key">&quot;message&quot;</span>
              {`: `}
              <span className="tok-str">
                &quot;No campaign with ID camp_01HX... exists for this
                account.&quot;
              </span>
              {`,
    `}
              <span className="tok-key">&quot;status&quot;</span>
              {`: `}
              <span className="tok-num">404</span>
              {`,
    `}
              <span className="tok-key">&quot;request_id&quot;</span>
              {`: `}
              <span className="tok-str">&quot;req_01HX...&quot;</span>
              {`
  }
}`}
            </CodeBlock>

            <div className="api-table-wrap">
              <table className="api-error-table api-reveal">
                <thead>
                  <tr>
                    <th>Error code</th>
                    <th>HTTP</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["authentication_required", 401, "No API key provided"],
                    [
                      "invalid_api_key",
                      401,
                      "API key format invalid or revoked",
                    ],
                    [
                      "insufficient_scope",
                      403,
                      "Key lacks required permission scope",
                    ],
                    [
                      "campaign_not_found",
                      404,
                      "Campaign ID does not exist on this account",
                    ],
                    ["application_not_found", 404, "Application ID not found"],
                    [
                      "invalid_status_transition",
                      422,
                      "Requested status change is not allowed",
                    ],
                    ["budget_exhausted", 402, "Campaign budget fully spent"],
                    [
                      "duplicate_application",
                      409,
                      "Creator has already applied to this campaign",
                    ],
                    [
                      "qr_already_generated",
                      409,
                      "QR code already exists for this application",
                    ],
                    [
                      "validation_error",
                      400,
                      "Request body failed validation — see errors array",
                    ],
                    [
                      "rate_limit_exceeded",
                      429,
                      "Too many requests — see Retry-After header",
                    ],
                    [
                      "internal_error",
                      500,
                      "Unexpected server error — contact support with request_id",
                    ],
                  ].map(([code, status, desc]) => (
                    <tr key={String(code)}>
                      <td>
                        <code className="api-error-code">{code}</code>
                      </td>
                      <td>
                        <code className="api-http-status">{status}</code>
                      </td>
                      <td>
                        <span className="api-param-desc">{desc as string}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <hr className="api-divider" />

          {/* ── SDKs ───────────────────────────────────────── */}
          <section id="sdks" className="api-section">
            <p className="api-section-eyebrow">09</p>
            <h2 className="api-section-title">SDKs</h2>
            <p className="api-section-desc">
              Official SDKs wrap the REST API with language-native idioms,
              automatic retries, and type definitions. All SDKs are open-source
              under the MIT license.
            </p>

            <div className="api-sdk-grid">
              {[
                {
                  lang: "JavaScript",
                  pkg: "npm install @pushapp/sdk",
                  status: "v0.9 — Public beta",
                  href: "#",
                },
                {
                  lang: "Python",
                  pkg: "pip install pushapp",
                  status: "v0.8 — Public beta",
                  href: "#",
                },
                {
                  lang: "Ruby",
                  pkg: "gem install push-ruby",
                  status: "v0.7 — Public beta",
                  href: "#",
                },
                {
                  lang: "Go",
                  pkg: "go get github.com/pushapp/push-go",
                  status: "Coming Q3 2026",
                  href: "#",
                },
              ].map((sdk) => (
                <a key={sdk.lang} href={sdk.href} className="api-sdk-card">
                  <span className="api-sdk-lang">{sdk.lang}</span>
                  <code className="api-sdk-pkg">{sdk.pkg}</code>
                  <span className="api-sdk-status">{sdk.status}</span>
                </a>
              ))}
            </div>

            <div className="api-note api-reveal">
              <p className="api-note-label">Community SDKs</p>
              <p className="api-note-body">
                Community-maintained SDKs for PHP, Java, and .NET are listed in
                our GitHub Discussions. Push does not provide support for
                community SDKs.
              </p>
            </div>

            {/* Changelog link */}
            <Link href="/changelog?filter=api" className="api-changelog-link">
              View API changelog
              <span className="api-changelog-link-arrow"> →</span>
            </Link>
          </section>

          {/* Bottom padding */}
          <div style={{ height: "var(--space-15)" }} />
        </article>

        {/* Right: Sticky code examples */}
        <ExamplesPanel />
      </div>
    </main>
  );
}
