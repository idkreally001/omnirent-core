import { useState, useEffect } from 'react';
import {
  Shield, Lock, FileText, Copyright,
  ChevronRight, AlertTriangle, Printer
} from 'lucide-react';

/* =========================
   CONFIG
========================= */
const legalConfig = {
  terms: {
    title: "Terms of Service",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    lastUpdated: "April 2026",
    sections: [
      { head: "Acceptance of Service", body: "By using OmniRent, you agree to follow the rules and processes defined on this platform." },
      { head: "Escrow & Payments", body: "All payments are held securely and released only after required verification steps are completed by both parties." },
      { head: "Governing Law", body: "This agreement is governed by the laws of the Republic of Türkiye. Disputes shall be resolved exclusively in the Courts and Execution Offices of Ankara." },
      { head: "Force Majeure", body: "OmniRent is not liable for service interruptions caused by factors outside its control, including infrastructure failures or natural disasters." }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    icon: Lock,
    color: "text-green-600",
    bg: "bg-green-600/10",
    lastUpdated: "April 2026",
    sections: [
      { head: "Data Controller (KVKK)", body: "In accordance with KVKK No. 6698, the platform operator acts as the Data Controller. Data is processed strictly for security." },
      { head: "Your Data Rights", body: "Under Article 11 of KVKK, users may request access, correction, or deletion of their data, subject to legal auditing requirements." },
      { head: "Rental Evidence", body: "Photos taken during transactions are securely stored and used only for dispute resolution." }
    ]
  },
  usage: {
    title: "Usage Agreement",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-600/10",
    lastUpdated: "April 2026",
    sections: [
      { head: "Listing Rules", body: "Users must have legal rights to list items. Illegal, stolen, or hazardous items are strictly prohibited." },
      { head: "Severability", body: "If any provision of these terms is found unenforceable, the remaining provisions shall remain valid and enforceable." },
      { head: "Manipulation", body: "Automated scraping or bypassing system protections is strictly prohibited and results in access revocation." }
    ]
  },
  license: {
    title: "License",
    icon: Copyright,
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    lastUpdated: "April 2026",
    sections: [
      { head: "MIT License", body: "This software is provided under the MIT License and is distributed without warranty of any kind." }
    ]
  }
};

const sectionKeys = Object.keys(legalConfig);

/* =========================
   COMPONENT
========================= */
export default function Legal() {
  const [active, setActive] = useState('terms');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (legalConfig[hash]) setActive(hash);
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

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-16 px-4">

      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black mb-3">
          Legal Center
        </h1>
        <p className="text-xs tracking-widest text-text-secondary">
          Terms • Privacy • Usage • License
        </p>
      </header>

      {/* MOBILE TABS */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden">
        {sectionKeys.map((id) => {
          const config = legalConfig[id];
          const Icon = config.icon;

          return (
            <button
              key={id}
              onClick={() => changeSection(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
                active === id
                  ? "bg-blue-600 text-white"
                  : "bg-card-bg border-border-subtle text-text-primary"
              }`}
            >
              <Icon size={14} />
              {config.title}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SIDEBAR (DESKTOP ONLY) */}
        <nav className="hidden lg:block lg:col-span-3 space-y-2 sticky top-24">
          {sectionKeys.map((id) => {
            const config = legalConfig[id];
            const Icon = config.icon;
            const isActive = active === id;

            return (
              <button
                key={id}
                onClick={() => changeSection(id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                  isActive
                    ? 'bg-bg-primary border-blue-500 shadow'
                    : 'bg-card-bg border-border-subtle hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-xs font-bold tracking-widest">
                    {config.title}
                  </span>
                </div>
                <ChevronRight size={14} className={isActive ? "text-blue-600" : "opacity-0"} />
              </button>
            );
          })}
        </nav>

        {/* CONTENT */}
        <main className="lg:col-span-9 bg-card-bg border border-border-subtle rounded-2xl p-6 md:p-10 shadow-sm">

          {/* DISCLAIMER */}
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-red-500 text-sm font-bold">
              <AlertTriangle size={16} />
              General Disclaimer
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              OmniRent facilitates peer-to-peer transactions and does not guarantee the safety, legality, or condition of listed items. All real-world risks are assumed by users.
            </p>
          </div>

          {sectionKeys.map((id) => {
            const config = legalConfig[id];
            const isActive = active === id;

            return (
              <div key={id} className={isActive ? 'block' : 'hidden'}>
                <div className="flex justify-between items-center mb-8 border-b border-border-subtle pb-4">
                  <h2 className="text-2xl md:text-3xl font-black">
                    {config.title}
                  </h2>
                  <span className="text-xs text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full font-bold tracking-widest uppercase">
                    {config.lastUpdated}
                  </span>
                </div>

                <div className="space-y-6">
                  {config.sections.map((c, i) => (
                    <section key={i}>
                      <h3 className="font-semibold text-sm mb-1">
                        {c.head}
                      </h3>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        {c.body}
                      </p>
                    </section>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="mt-8 flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-blue-500 transition-colors"
                >
                  <Printer size={14} />
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