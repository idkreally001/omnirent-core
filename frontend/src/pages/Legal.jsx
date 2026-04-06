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
   LEGAL CONTENT
========================= */

const sections = [
  {
    id: "terms",
    title: "Terms of Service",
    icon: Shield,
    content: [
      {
        head: "01. Acceptance of Service",
        body: "By using OmniRent, you agree to follow the rules and processes defined on this platform."
      },
      {
        head: "02. Escrow & Payments",
        body: "All payments are held securely and released only after required verification steps are completed by both parties."
      },
      {
        head: "03. Platform Role",
        body: "OmniRent provides the infrastructure for transactions and does not guarantee or certify listed items."
      },
      {
        head: "04. User Responsibility",
        body: "Users are responsible for verifying item condition, ownership, and suitability before completing any transaction."
      },
      {
        head: "05. Governing Law & Jurisdiction",
        body: "This agreement is governed by the laws of the Republic of Türkiye. Disputes shall be resolved exclusively in the Courts and Execution Offices of Ankara."
      },
      {
        head: "06. Force Majeure & Service Limits",
        body: "OmniRent is not liable for service interruptions caused by factors outside its control, including infrastructure failures, network outages, or natural disasters. No guarantee of uninterrupted service is provided."
      }
    ]
  },

  {
    id: "privacy",
    title: "Privacy Policy",
    icon: Lock,
    content: [
      {
        head: "01. Data Controller & KVKK Compliance",
        body: "In accordance with KVKK No. 6698, the platform operator acts as the Data Controller. Personal data is processed strictly for identity verification, fraud prevention, and transaction security."
      },
      {
        head: "02. Data Collection",
        body: "Identification data (such as TCKN) may be collected to enforce platform integrity and prevent duplicate or fraudulent accounts."
      },
      {
        head: "03. Data Storage",
        body: "Sensitive data is stored securely using encryption and hashing techniques."
      },
      {
        head: "04. Rental Evidence",
        body: "Photos and transaction records are stored securely and used only for dispute resolution and audit purposes."
      },
      {
        head: "05. Data Usage & Sharing",
        body: "User data is not sold or shared with third parties for advertising. Data may only be processed where legally required."
      },
      {
        head: "06. Your Data Rights",
        body: "Under Article 11 of KVKK, users may request access, correction, or deletion of their data, unless retention is required for disputes or legal obligations."
      }
    ]
  },

  {
    id: "usage",
    title: "Usage Agreement",
    icon: FileText,
    content: [
      {
        head: "01. Listing Rules",
        body: "Users must have legal rights to list items. Illegal, stolen, or hazardous items are strictly prohibited."
      },
      {
        head: "02. Platform Conduct",
        body: "Users must not attempt to exploit, disrupt, or misuse the platform or its services."
      },
      {
        head: "03. Dispute Handling",
        body: "Disputes are resolved based on available platform data. Decisions made within the platform are final for internal transactions."
      },
      {
        head: "04. Severability Clause",
        body: "If any provision of these terms is found unenforceable, the remaining provisions shall remain valid and enforceable."
      },
      {
        head: "05. Prohibited Manipulation",
        body: "Automated scraping, bypassing system protections, or interfering with platform workflows is strictly prohibited and may result in immediate access revocation."
      }
    ]
  },

  {
    id: "license",
    title: "License",
    icon: Copyright,
    content: [
      {
        head: "MIT License",
        body: "This software is provided under the MIT License and is distributed without warranty of any kind."
      }
    ]
  }
];

/* =========================
   GLOBAL DISCLAIMER
========================= */

const disclaimer = `
OmniRent is a software platform that facilitates peer-to-peer transactions. 
It does not guarantee the condition, legality, or safety of listed items. 
All risks related to physical goods and real-world interactions are assumed by the users.
`;

/* =========================
   COMPONENT
========================= */

export default function Legal() {
  const [active, setActive] = useState("terms");

  const ids = sections.map(s => s.id);

  /* HASH SUPPORT */
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

  /* =========================
     UI
  ========================= */

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 mb-16">

      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase mb-3">
          Legal Center
        </h1>
        <p className="text-xs uppercase tracking-widest text-gray-500">
          Terms • Privacy • Usage • License
        </p>
      </header>

      {/* MOBILE TABS */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => changeSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
                active === s.id
                  ? "bg-blue-600 text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <Icon size={14} />
              {s.title}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* DESKTOP SIDEBAR */}
        <nav className="hidden lg:block lg:col-span-3 space-y-2 sticky top-24">
          {sections.map((s) => {
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => changeSection(s.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                  active === s.id
                    ? "bg-gray-50 border-blue-500 shadow"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
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
        <main className="lg:col-span-9 bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">

          {/* DISCLAIMER */}
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-red-600 text-sm font-bold uppercase">
              <AlertTriangle size={16} />
              General Disclaimer
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {disclaimer}
            </p>
          </div>

          {/* SECTIONS */}
          {sections.map((s) => {
            const isActive = active === s.id;

            return (
              <div key={s.id} className={isActive ? "block" : "hidden"}>
                <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase">
                  {s.title}
                </h2>

                <div className="space-y-6">
                  {s.content.map((c, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-sm uppercase mb-1">
                        {c.head}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-gray-700">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => window.print()}
                  className="mt-8 text-xs font-bold uppercase text-gray-500 hover:text-blue-600"
                >
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