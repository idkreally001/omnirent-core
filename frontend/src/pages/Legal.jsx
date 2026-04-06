import { useState, useMemo } from 'react';
import {
  Shield, Lock, FileText, Copyright,
  Scale, Globe, ChevronRight, Printer, Download
} from 'lucide-react';

// 1. Data-Driven Content Map (Eliminates Redundancy)
const LEGAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-600/10',
    lastUpdated: 'April 2026',
    sections: [
      {
        h3: '1. Acceptance of Terms',
        p: 'By accessing the OmniRent platform, you agree to be bound by these Terms. OmniRent is an open-source engine; its use is subject to the MIT license.'
      },
      {
        h3: '2. The OmniRent Escrow System',
        p: 'OmniRent acts as an intermediary. Funds are held in Escrow until both Handover and Return verification loops are completed. In the event of a dispute, funds are frozen until Administrative resolution.'
      },
      {
        h3: '3. Finality of the Handshake',
        p: 'Confirming receipt as an Owner acts as a binding assertion that the item is in satisfactory condition. You waive dispute rights once confirmed.'
      }
    ],
    footerNotice: {
      type: 'warning',
      icon: Globe,
      text: 'OmniRent is NOT affiliated with, endorsed by, or sponsored by any other corporate entity operating under a similar brand name.'
    }
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Lock,
    color: 'text-green-600',
    bg: 'bg-green-600/10',
    lastUpdated: 'April 2026',
    sections: [
      {
        h3: '1. Information Collection',
        p: 'We collect essential data to maintain a secure marketplace:',
        list: [
          'Identity Information: Valid Government Identity (TCKN) for compliance.',
          'Photographic Evidence: State images uploaded during handovers.',
          'Financial Metadata: Transaction flow and wallet balances.'
        ]
      },
      {
        h3: '2. Data Retention',
        p: 'Due to physical liabilities, dispute records and transactional metadata are archived permanently to ensure community security.'
      }
    ]
  },
  usage: {
    title: 'Usage Agreement',
    icon: FileText,
    color: 'text-orange-600',
    bg: 'bg-orange-600/10',
    lastUpdated: 'April 2026',
    sections: [
      {
        h3: '1. Acceptable Use',
        p: 'The marketplace is reserved for legal, non-hazardous physical equipment. Listings certify legal ownership of the asset.'
      },
      {
        h3: '2. System Integrity',
        p: 'Attempts to deploy automated scraping or bypass workflows result in permanent IP bans via internal firewalls.'
      }
    ]
  },
  copyright: {
    title: 'Copyright & Legal',
    icon: Copyright,
    color: 'text-purple-600',
    bg: 'bg-purple-600/10',
    lastUpdated: 'April 2026',
    sections: [
      {
        h3: '1. Software Licensing',
        p: 'OmniRent is open-source under the MIT License. Attribution is required for all re-distributions.'
      }
    ],
    footerNotice: {
      type: 'critical',
      text: 'OmniRent is an independent technology project. Any resemblance to other service names is coincidental and does not imply endorsement or partnership.'
    }
  }
};

export default function Legal() {
  const [activeId, setActiveId] = useState('terms');

  // Memoize active content for performance
  const activeContent = useMemo(() => LEGAL_CONTENT[activeId], [activeId]);
  const Icon = activeContent.icon;

  return (
    <div className="max-w-7xl mx-auto mt-12 mb-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Refined Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter uppercase leading-none">
            Legal <span className="text-blue-600">Center</span>
          </h1>
          <p className="mt-4 text-text-secondary font-bold tracking-[0.2em] uppercase text-xs opacity-70">
            Platform Governance & Intellectual Property
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-subtle rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-border-subtle transition-colors">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 space-y-2 sticky top-28" aria-label="Legal navigation">
          {Object.entries(LEGAL_CONTENT).map(([id, data]) => (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              aria-current={activeId === id ? 'page' : undefined}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${activeId === id
                ? 'bg-bg-secondary border-blue-600/40 shadow-xl shadow-blue-500/5'
                : 'bg-transparent border-transparent hover:bg-bg-secondary/50'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${data.bg} ${data.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                  <data.icon size={18} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${activeId === id ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {data.title}
                </span>
              </div>
              <ChevronRight size={14} className={`${activeId === id ? 'text-blue-600 translate-x-1 opacity-100' : 'opacity-0'} transition-all`} />
            </button>
          ))}

          <div className="mt-10 p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <Scale size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
            <h4 className="font-black uppercase tracking-tight text-xs mb-2">Legal Autonomy</h4>
            <p className="text-[10px] font-bold opacity-80 leading-relaxed uppercase tracking-widest">
              OmniRent is a standalone open-source technology project.
            </p>
          </div>
        </nav>

        {/* Dynamic Content Area */}
        <article className="lg:col-span-9 bg-bg-secondary border border-border-subtle rounded-[3.5rem] p-10 md:p-20 shadow-inner relative">
          <div key={activeId} className="animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="flex justify-between items-start mb-12 border-b border-border-subtle pb-8">
              <h2 className="text-4xl font-black text-text-primary uppercase tracking-tight flex items-center gap-5">
                <Icon size={40} className={activeContent.color} />
                {activeContent.title}
              </h2>
              <div className="text-right">
                <span className="block text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Effective Date</span>
                <span className="text-xs font-bold text-text-primary uppercase">{activeContent.lastUpdated}</span>
              </div>
            </div>

            <div className="space-y-12 text-text-secondary leading-relaxed font-medium">
              {activeContent.sections.map((section, idx) => (
                <section key={idx} className="group">
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-4 group-hover:text-blue-600 transition-colors">
                    {section.h3}
                  </h3>
                  <p className="text-base leading-loose">{section.p}</p>
                  {section.list && (
                    <ul className="mt-6 space-y-4 border-l-2 border-border-subtle pl-6">
                      {section.list.map((item, i) => (
                        <li key={i} className="text-sm italic">
                          <span className="text-text-primary font-bold mr-2">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {activeContent.footerNotice && (
                <footer className={`mt-16 p-8 rounded-3xl border ${activeContent.footerNotice.type === 'warning'
                  ? 'bg-blue-600/5 border-blue-600/10'
                  : 'bg-red-600/5 border-red-600/10'
                  }`}>
                  <div className="flex gap-4">
                    {activeContent.footerNotice.icon && (
                      <activeContent.footerNotice.icon size={20} className="text-blue-600 shrink-0" />
                    )}
                    <p className={`text-[11px] font-black uppercase tracking-[0.15em] leading-relaxed ${activeContent.footerNotice.type === 'warning' ? 'text-text-secondary' : 'text-red-600'
                      }`}>
                      {activeContent.footerNotice.text}
                    </p>
                  </div>
                </footer>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}