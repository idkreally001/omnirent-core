import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  FileText,
  Copyright,
  ChevronRight,
  AlertCircle,
  Scale
} from 'lucide-react';

/* =========================
   1. CONFIG (UI-agnostic)
========================= */
const legalConfig = {
  terms: {
    title: "Terms of Service",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    lastUpdated: "April 2026",
    sections: [
      {
        head: "01. Acceptance of Service",
        body: "By using OmniRent, you agree to follow our payment and verification rules. This platform allows people to rent items from each other."
      },
      {
        head: "02. Payment Protection (Escrow)",
        body: "Payments are held securely until the rental is completed. Funds are released only after required pre- and post-check confirmations."
      },
      {
        head: "03. Condition & Liability",
        body: "OmniRent provides the platform only. Users are responsible for checking item condition and safety before completing a transaction."
      }
    ]
  },

  privacy: {
    title: "Privacy Policy",
    icon: Lock,
    color: "text-green-600",
    bg: "bg-green-600/10",
    lastUpdated: "April 2026",
    sections: [
      {
        head: "01. Identity Verification",
        body: "We collect identification data (e.g., TCKN) to reduce fraud. This data is securely hashed and cannot be reused."
      },
      {
        head: "02. Rental Evidence",
        body: "Photos taken during transactions are securely stored and only used in case of disputes."
      }
    ]
  },

  usage: {
    title: "Usage Agreement",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-600/10",
    lastUpdated: "April 2026",
    sections: [
      {
        head: "01. Ownership Rules",
        body: "Users must own or have permission to rent listed items. Illegal or dangerous items are not allowed."
      },
      {
        head: "02. Dispute Resolution",
        body: "Disputes are reviewed using platform data. Final decisions are binding within the platform."
      }
    ]
  },

  license: {
    title: "License",
    icon: Copyright,
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    lastUpdated: "April 2026",
    sections: [
      {
        head: "MIT License",
        body: "Copyright (c) 2026 Islam Pashazade. Provided as-is without warranty."
      }
    ]
  }
};

const sectionKeys = Object.keys(legalConfig);

/* =========================
   2. COMPONENT
========================= */
export default function Legal() {
  const [activeSection, setActiveSection] = useState('terms');

  /* =========================
     3. HASH SYNC (LOAD + BACK)
  ========================= */
  useEffect(() => {
    const setFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (legalConfig[hash]) {
        setActiveSection(hash);
      } else {
        setActiveSection('terms');
      }
    };

    setFromHash();
    window.addEventListener('hashchange', setFromHash);

    return () => window.removeEventListener('hashchange', setFromHash);
  }, []);

  /* =========================
     4. HANDLERS
  ========================= */
  const handleSectionChange = (id) => {
    setActiveSection(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyNav = (e) => {
    const index = sectionKeys.indexOf(activeSection);

    if (e.key === 'ArrowDown') {
      const next = sectionKeys[(index + 1) % sectionKeys.length];
      handleSectionChange(next);
    }

    if (e.key === 'ArrowUp') {
      const prev = sectionKeys[(index - 1 + sectionKeys.length) % sectionKeys.length];
      handleSectionChange(prev);
    }
  };

  /* =========================
     5. UI
  ========================= */
  return (
    <div className="max-w-6xl mx-auto mt-12 mb-20 px-4 print:mt-0">

      {/* HEADER */}
      <header className="text-center mb-16 print:hidden">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
          Legal Center
        </h1>
        <p className="text-xs uppercase tracking-widest opacity-60">
          Governance • Privacy • Licensing
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SIDEBAR */}
        <nav
          role="tablist"
          aria-label="Legal Sections"
          className="lg:col-span-3 space-y-2 sticky top-24 print:hidden"
        >
          {sectionKeys.map((id) => {
            const config = legalConfig[id];
            const Icon = config.icon;

            return (
              <button
                key={id}
                role="tab"
                aria-selected={activeSection === id}
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
                tabIndex={activeSection === id ? 0 : -1}
                onClick={() => handleSectionChange(id)}
                onKeyDown={handleKeyNav}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${activeSection === id
                    ? 'bg-bg-secondary border-blue-600/40 shadow-lg'
                    : 'bg-bg-primary border-border-subtle hover:border-text-secondary/20'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${config.bg} ${config.color} p-2 rounded-lg`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {config.title}
                  </span>
                </div>

                <ChevronRight
                  size={14}
                  className={`transition ${activeSection === id ? 'text-blue-600 translate-x-1' : 'opacity-0'
                    }`}
                />
              </button>
            );
          })}

          {/* NOTE */}
          <div className="mt-8 p-6 bg-blue-600 text-white rounded-2xl shadow-xl">
            <Scale size={24} className="mb-3 opacity-40" />
            <p className="text-xs uppercase tracking-widest">
              Independent open-source project by Islam Pashazade
            </p>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="lg:col-span-9 bg-bg-secondary border border-border-subtle rounded-3xl p-8 md:p-14 shadow-xl print:border-none print:shadow-none print:p-0">

          {sectionKeys.map((id) => {
            const config = legalConfig[id];
            const isActive = activeSection === id;

            return (
              <div
                key={id}
                role="tabpanel"
                id={`panel-${id}`}
                aria-labelledby={`tab-${id}`}
                className={`${isActive ? 'block' : 'hidden'} print:block`}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-10 border-b pb-6">
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    {config.title}
                  </h2>

                  <span className="text-xs font-bold text-blue-600 bg-blue-600/5 px-3 py-1 rounded-full">
                    Last Updated: {config.lastUpdated}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="space-y-10">
                  {config.sections.map((section, i) => (
                    <section key={i} className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={14} className="text-blue-600" />
                        {section.head}
                      </h3>

                      <p className="text-base leading-relaxed text-text-secondary">
                        {section.body}
                      </p>
                    </section>
                  ))}

                  {/* LICENSE DISCLAIMER */}
                  {id === 'license' && (
                    <div className="p-6 bg-red-600/5 border border-red-600/10 rounded-2xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                        Disclaimer: OmniRent is not affiliated with any external rental companies.
                        Provided as-is without warranty.
                      </p>
                    </div>
                  )}
                </div>

                {/* PRINT BUTTON */}
                <button
                  onClick={() => window.print()}
                  className="mt-12 text-xs font-bold uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 print:hidden"
                >
                  <FileText size={14} />
                  Print Document
                </button>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}