import { Shield } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-blue-100/50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Shield size={32} />
        </div>
        <h1 className="text-4xl font-black text-text-primary tracking-tight">Terms of Service</h1>
        <p className="text-text-secondary font-medium max-w-lg mx-auto uppercase tracking-widest text-[10px]">Effective Date: April 2026</p>
      </div>

      <div className="bg-bg-secondary rounded-[2.5rem] p-8 md:p-12 border border-border-subtle shadow-2xl shadow-blue-500/5 space-y-8 text-text-primary leading-relaxed transition-colors">
        
        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">1. Acceptance of Terms</h2>
          <p className="text-text-secondary">By accessing or using the OmniRent platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">2. The OmniRent Escrow System</h2>
          <p className="text-text-secondary">OmniRent acts as an intermediary. Funds are held in Escrow from the moment a renter initiates a booking until the transaction successfully concludes.</p>
          <ul className="list-disc pl-5 space-y-2 text-text-secondary">
            <li>Funds are not released to the Owner until both the Handover and Return photo-verification loops are completed.</li>
            <li>In the event of a dispute, Escrow funds are frozen indefinitely until an OmniRent Administrator provides a final resolution.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">3. Finality of the Handshake</h2>
          <p className="text-text-secondary">Upon concluding a rental, clicking "Confirm Receipt" (as the Owner) acts as a legally binding assertion that the item has been returned in satisfactory condition. <strong className="text-red-500">You waive your right to a dispute once the item is confirmed.</strong> Please inspect all equipment thoroughly *before* completing the transaction.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-text-primary">4. Hardware-Level Identity Integrity</h2>
          <p className="text-text-secondary">To use OmniRent, you must provide a valid government-issued Identity Number (TCKN). Our systems enforce cryptographic uniqueness constraints. Any attempt to use duplicate, forged, or stolen identity data will result in immediate permanent suspension and potential referral to law enforcement.</p>
        </section>

        <section className="space-y-4 pt-8 border-t border-border-subtle/50">
          <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">6. Non-Affiliation Notice</h2>
          <p className="text-text-secondary text-xs leading-relaxed italic border-l-2 border-red-600/30 pl-4">
            OmniRent is an independent open-source project. We are NOT affiliated with, endorsed by, or sponsored by any other corporate entity or individual operating under the "Omnirent" or "Omni Rentals" names in any industry. This platform is a standalone technology project developed for the global community.
          </p>
        </section>
        
      </div>
    </div>
  );
}
