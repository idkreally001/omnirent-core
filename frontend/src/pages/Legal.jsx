import { useState } from 'react';
import { Shield, Lock, FileText, Copyright, Scale, Globe, ChevronRight } from 'lucide-react';

export default function Legal() {
  const [activeSection, setActiveSection] = useState('terms');

  const sections = [
    { id: 'terms', title: 'Terms of Service', icon: <Shield size={20} />, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { id: 'privacy', title: 'Privacy Policy', icon: <Lock size={20} />, color: 'text-green-600', bg: 'bg-green-600/10' },
    { id: 'usage', title: 'Usage Agreement', icon: <FileText size={20} />, color: 'text-orange-600', bg: 'bg-orange-600/10' },
    { id: 'copyright', title: 'Copyright & Legal', icon: <Copyright size={20} />, color: 'text-purple-600', bg: 'bg-purple-600/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-12 mb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-text-primary tracking-tight mb-4 uppercase">Legal Center</h1>
        <p className="text-text-secondary font-black tracking-[0.3em] uppercase text-[10px]">Governance, Privacy, and Intellectual Property</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3 sticky top-24">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${activeSection === section.id
                ? 'bg-bg-secondary border-blue-600/50 shadow-lg shadow-blue-500/5'
                : 'bg-bg-primary border-border-subtle hover:border-text-secondary/30'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${section.bg} ${section.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                  {section.icon}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${activeSection === section.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {section.title}
                </span>
              </div>
              <ChevronRight size={16} className={`${activeSection === section.id ? 'text-blue-600 translate-x-1' : 'text-text-secondary opacity-0'} transition-all`} />
            </button>
          ))}

          <div className="mt-8 p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20">
            <Scale size={32} className="mb-4 opacity-50" />
            <h4 className="font-black uppercase tracking-tight text-sm mb-2">Legal Independence</h4>
            <p className="text-[10px] font-bold opacity-80 leading-relaxed uppercase tracking-widest">OmniRent is a standalone open-source technology project.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-bg-secondary border border-border-subtle rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-blue-500/5">
          {activeSection === 'terms' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-text-primary mb-10 uppercase tracking-tight border-b-2 border-border-subtle pb-6 flex items-center gap-4">
                <Shield size={32} className="text-blue-600" /> Terms of Service
              </h2>
              <div className="space-y-10 text-text-secondary leading-relaxed font-medium">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">1. Acceptance of Terms</h3>
                  <p>By accessing or using the OmniRent platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. OmniRent is an open-source engine; its use is subject to the MIT license.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">2. The OmniRent Escrow System</h3>
                  <p>OmniRent acts as an intermediary. Funds are held in Escrow from the moment a renter initiates a booking until the transaction successfully concludes.</p>
                  <ul className="list-disc pl-5 space-y-3">
                    <li>Funds are not released to the Owner until both the Handover and Return photo-verification loops are completed.</li>
                    <li>In the event of a dispute, Escrow funds are frozen indefinitely until an OmniRent Administrator provides a final resolution.</li>
                  </ul>
                </section>
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">3. Finality of the Handshake</h3>
                  <p>Upon concluding a rental, clicking "Confirm Receipt" (as the Owner) acts as a legally binding assertion that the item has been returned in satisfactory condition. <span className="text-red-500 font-bold">You waive your right to a dispute once the item is confirmed.</span></p>
                </section>
                <section className="space-y-4 pt-10 border-t border-border-subtle/50">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight flex items-center gap-2"><Globe size={20} className="text-red-600" /> Non-Affiliation Notice</h3>
                  <p className="text-xs italic border-l-2 border-red-600/30 pl-4">OmniRent is NOT affiliated with, endorsed by, or sponsored by any other corporate entity or individual operating under the "Omnirent" brand.</p>
                </section>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-text-primary mb-10 uppercase tracking-tight border-b-2 border-border-subtle pb-6 flex items-center gap-4">
                <Lock size={32} className="text-green-600" /> Privacy Policy
              </h2>
              <div className="space-y-10 text-text-secondary leading-relaxed font-medium">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">1. Information We Collect</h3>
                  <p>We collect essential data to maintain a secure and functional escrow marketplace:</p>
                  <ul className="list-disc pl-5 space-y-3">
                    <li><strong>Identity Information:</strong> Valid Government Identity details (TCKN) for compliance.</li>
                    <li><strong>Photographic Evidence:</strong> Device state images uploaded during handovers.</li>
                    <li><strong>Financial Metadata:</strong> Wallet balances and transaction flow (3rd party tokenized).</li>
                  </ul>
                </section>
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">2. Data Retention</h3>
                  <p>Due to the financial and physical liabilities of our platform, dispute records, identities, and transactional metadata are archived permanently to ensure the security of the community.</p>
                </section>
              </div>
            </div>
          )}

          {activeSection === 'usage' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-text-primary mb-10 uppercase tracking-tight border-b-2 border-border-subtle pb-6 flex items-center gap-4">
                <FileText size={32} className="text-orange-600" /> Usage Agreement
              </h2>
              <div className="space-y-10 text-text-secondary leading-relaxed font-medium">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">1. Acceptable Use</h3>
                  <p>The marketplace is reserved strictly for legal, non-hazardous physical equipment. By posting a listing, you certify that you hold legal ownership of the asset.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">2. System Integrity</h3>
                  <p>Any attempt to deploy automated scraping tools or bypass image compression workflows will result in permanent IP bans via our internal firewalls.</p>
                </section>
              </div>
            </div>
          )}

          {activeSection === 'copyright' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-text-primary mb-10 uppercase tracking-tight border-b-2 border-border-subtle pb-6 flex items-center gap-4">
                <Copyright size={32} className="text-purple-600" /> Copyright & Legal
              </h2>
              <div className="space-y-10 text-text-secondary leading-relaxed font-medium">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">1. Software Licensing</h3>
                  <p>OmniRent is open-source under the <span className="text-text-primary font-black">MIT License</span>. Attribution is required for all re-distributions.</p>
                </section>
                <section className="space-y-4 text-[13px] bg-red-600/5 p-8 rounded-3xl border border-red-600/10">
                  <h3 className="text-lg font-black text-red-600 uppercase tracking-tight mb-4">Official Disclaimer</h3>
                  <p className="leading-loose font-black uppercase tracking-widest opacity-80">OmniRent is an independent technology project. We are not a representative of any other commercial rental service. Any resemblance to other service names is coincidental and does not imply endorsement or partnership.</p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
