import { Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-green-100/50 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock size={32} />
        </div>
        <h1 className="text-4xl font-black text-text-primary tracking-tight">Privacy Policy</h1>
        <p className="text-text-secondary font-medium max-w-lg mx-auto uppercase tracking-widest text-[10px]">Effective Date: April 2026</p>
      </div>

      <div className="bg-bg-secondary rounded-[2.5rem] p-8 md:p-12 border border-border-subtle shadow-2xl shadow-blue-500/5 space-y-8 text-text-primary leading-relaxed transition-colors">
        
        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">1. Information We Collect</h2>
          <p className="text-text-secondary">We collect essential data to maintain a secure and functional escrow marketplace:</p>
          <ul className="list-disc pl-5 space-y-2 text-text-secondary">
            <li><strong>Identity Information:</strong> Valid Government Identity details (TCKN) for compliance.</li>
            <li><strong>Photographic Evidence:</strong> Device state images uploaded during "Pre-Flight" and "Post-Flight" handovers.</li>
            <li><strong>Financial Metadata:</strong> Wallet balances and transaction flow (excluding raw credit card data which is handled by a 3rd party tokenizer).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">2. Photographic Evidence Logging</h2>
          <p className="text-text-secondary">Photos collected via the `ConditionUploadModal` are permanently attached to the specific rental log for the purpose of Trust & Safety Engine resolution. These images are hosted securely on an encrypted AWS/Cloudinary block layer and are not exposed publicly.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">3. Data Retention</h2>
          <p className="text-text-secondary">Due to the financial and physical liabilities of our platform, dispute records, identities, and transactional metadata are archived permanently. If your account is dissolved, public listings are destroyed, while core transactional memory is retained as required by financial auditing laws.</p>
        </section>

        <section className="space-y-4 pt-8 border-t border-border-subtle/50">
          <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">5. Non-Affiliation Disclaimer</h2>
          <p className="text-text-secondary text-xs leading-relaxed italic border-l-2 border-red-600/30 pl-4">
            OmniRent maintains strict operational independence. This project has no legal or corporate connection to any other entity using the "Omnirent" brand. Our data infrastructure is exclusively dedicated to the OmniRent open-source platform.
          </p>
        </section>
        
      </div>
    </div>
  );
}
