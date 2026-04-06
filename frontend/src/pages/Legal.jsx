import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  FileText,
  Copyright,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

/* =========================
   LEGAL CONTENT STRUCTURE
========================= */

const sections = [
  {
    id: "terms",
    title: "Terms of Service",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    content: [
      {
        head: "Acceptance of Service",
        body: "By using OmniRent, you agree to follow the rules and processes defined on this platform."
      },
      {
        head: "Escrow & Payments",
        body: "All payments are held securely and released only after required verification steps are completed by both parties."
      },
      {
        head: "Platform Role",
        body: "OmniRent provides the infrastructure for transactions. It does not inspect, guarantee, or certify listed items."
      },
      {
        head: "User Responsibility",
        body: "Users are responsible for verifying item condition, ownership, and suitability before completing any transaction."
      }
    ]
  },

  {
    id: "privacy",
    title: "Privacy Policy",
    icon: Lock,
    color: "text-green-600",
    bg: "bg-green-600/10",
    content: [
      {
        head: "Data Collection",
        body: "Identification data (such as TCKN) may be collected to prevent fraud and enforce platform integrity."
      },
      {
        head: "Data Storage",
        body: "Sensitive data is stored securely using encryption and hashing techniques."
      },
      {
        head: "Usage of Data",
        body: "Collected data is used only for verification, security, and dispute resolution."
      },
      {
        head: "Data Sharing",
        body: "User data is not sold or shared with third parties for advertising purposes."
      }
    ]
  },

  {
    id: "usage",
    title: "Usage Agreement",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-600/10",
    content: [
      {
        head: "Listing Rules",
        body: "Users must have legal rights to list any item. Illegal, stolen, or hazardous items are prohibited."
      },
      {
        head: "Platform Conduct",
        body: "Users must not attempt to exploit, disrupt, or misuse the platform."
      },
      {
        head: "Dispute Handling",
        body: "Disputes are resolved using available platform evidence. Decisions made by the platform are final within its scope."
      }
    ]
  },

  {
    id: "license",
    title: "License",
    icon: Copyright,
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    content: [
      {
        head: "MIT License",
        body: "This software is provided under the MIT License. It is distributed without warranty of any kind."
      }
    ]
  }
];

/* =========================
   GLOBAL DISCLAIMER (ONCE)
========================= */

const globalDisclaimer = `
OmniRent is an independent software platform. It acts solely as a facilitator for peer-to-peer transactions.
The platform does not guarantee the condition, legality, or safety of listed items.
All risks related to physical goods and transactions are assumed by the users.
`;

/* =========================
   COMPONENT
========================= */

export default function Legal() {
  const [active, setActive] = useState("terms");

  const ids = sections.map(s => s.id);

  /* HASH SYNC */
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (ids.includes(hash)) setActive(hash);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const changeSection = (id) => {
    setActive(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKey = (e) => {
    const i = ids.indexOf(active);
    if (e.key === "ArrowDown") changeSection(ids[(i + 1) % ids.length]);
    if (e.key === "ArrowUp") changeSection(ids[(i - 1 + ids.length) % ids.length]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-12 mb-20">

      {/* HEADER */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-4">
          Legal Center
        </h1>
        <p className="text-xs uppercase tracking-widest opacity-60">
          Terms • Privacy • Usage • License
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SIDEBAR */}
        <nav className="lg:col-span-3 space-y-2 sticky top-24">
          {sections.map((s) => {
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => changeSection(s.id)}
                onKeyDown={handleKey}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${active === s.id
                    ? "bg-bg-secondary border-blue-600/40 shadow"
                    : "bg-bg-primary border-border-subtle hover:border-text-secondary/20"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${s.bg} ${s.color} p-2 rounded-lg`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {s.title}
                  </span>
                </div>

                <ChevronRight
                  size={14}
                  className={active === s.id ? "text-blue-600 translate-x-1" : "opacity-0"}
                />
              </button>
            );
          })}
        </nav>

        {/* CONTENT */}
        <main className="lg:col-span-9 bg-bg-secondary border border-border-subtle rounded-3xl p-8 md:p-14 shadow-xl">

          {/* GLOBAL DISCLAIMER */}
          <div className="mb-12 p-6 bg-red-600/5 border border-red-600/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-red-600 font-bold text-sm uppercase tracking-widest">
              <AlertTriangle size={16} />
              General Disclaimer
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              {globalDisclaimer}
            </p>
          </div>

          {sections.map((s) => {
            const isActive = active === s.id;

            return (
              <div
                key={s.id}
                className={`${isActive ? "block" : "hidden"} print:block`}
              >
                <div className="mb-10 border-b pb-6">
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    {s.title}
                  </h2>
                </div>

                <div className="space-y-10">
                  {s.content.map((c, i) => (
                    <section key={i} className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-widest">
                        {c.head}
                      </h3>
                      <p className="text-base leading-relaxed text-text-secondary">
                        {c.body}
                      </p>
                    </section>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="mt-12 text-xs font-bold uppercase tracking-widest hover:text-blue-600 flex items-center gap-2"
                >
                  <FileText size={14} />
                  Print
                </button>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}