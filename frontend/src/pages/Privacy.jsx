import { Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">Effective Date: April 2026</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8 text-gray-700 leading-relaxed">
        
        <section className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">1. Information We Collect</h2>
          <p>We collect essential data to maintain a secure and functional escrow marketplace:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity Information:</strong> Valid Government Identity details (TCKN) for compliance.</li>
            <li><strong>Photographic Evidence:</strong> Device state images uploaded during "Pre-Flight" and "Post-Flight" handovers.</li>
            <li><strong>Financial Metadata:</strong> Wallet balances and transaction flow (excluding raw credit card data which is handled by a 3rd party tokenizer).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">2. Photographic Evidence Logging</h2>
          <p>Photos collected via the `ConditionUploadModal` are permanently attached to the specific rental log for the purpose of Trust & Safety Engine resolution. These images are hosted securely on an encrypted AWS/Cloudinary block layer and are not exposed publicly.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">3. Data Retention</h2>
          <p>Due to the financial and physical liabilities of our platform, dispute records, identities, and transactional metadata are archived permanently. If your account is dissolved, public listings are destroyed, while core transactional memory is retained as required by financial auditing laws.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">4. Sharing Your Data</h2>
          <p>We do NOT sell your data to any third party under any circumstances. Rental history, TCKN hashes, and dispute logs are explicitly limited to OmniRent core infrastructure operations, administrators, and when court-mandated by law enforcement officials regarding stolen property.</p>
        </section>
        
      </div>
    </div>
  );
}
