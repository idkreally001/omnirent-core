import { FileText } from 'lucide-react';

export default function Usage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-orange-100/50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
          <FileText size={32} />
        </div>
        <h1 className="text-4xl font-black text-text-primary tracking-tight">Usage Agreement</h1>
        <p className="text-text-secondary font-medium max-w-lg mx-auto uppercase tracking-widest text-[10px]">Effective Date: April 2026</p>
      </div>

      <div className="bg-bg-secondary rounded-[2.5rem] p-8 md:p-12 border border-border-subtle shadow-2xl shadow-blue-500/5 space-y-8 text-text-primary leading-relaxed transition-colors">
        
        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">1. Acceptable Use of OmniRent</h2>
          <p className="text-text-secondary">The marketplace is reserved strictly for legal, non-hazardous physical equipment. By posting a listing, you certify that you hold legal ownership or authorization to sub-lease the indicated asset.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">2. Dispute Arbitration Rules</h2>
          <p className="text-text-secondary">By engaging in a transaction, both Renter and Owner agree to adhere to OmniRent's internal Dispute Arbitration process:</p>
          <ul className="list-disc pl-5 space-y-2 text-text-secondary">
            <li>Any disputes must be accompanied by textual rationale and "Post-Flight" photographic evidence.</li>
            <li>Once an Administrator rules on a conflict (e.g., granting a refund to a Renter or enforcing a payout to an Owner), the decision is final and irreversible on the platform layer.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">3. System Load and Manipulation</h2>
          <p className="text-text-secondary">Any attempt to deploy automated scraping tools, utilize concurrent racing algorithms to "ghost-rent" items, or artificially bloat our storage infrastructure via rapid payload dumps is strictly prohibited. Users detected bypassing client-side image compression workflows will face IP bans via our internal firewalls.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">4. Community Integrity</h2>
          <p className="text-text-secondary">Users engaging in fraudulent item swapping (returning a fake or damaged iteration of a rented product) will immediately forfeit Escrow funds and may have their cryptographic Identity Hash reported to the relevant authorities for theft.</p>
        </section>
        
      </div>
    </div>
  );
}
