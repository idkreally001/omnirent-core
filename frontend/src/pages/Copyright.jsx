import { ShieldCheck, Scale, Globe, Copyright as CopyrightIcon } from 'lucide-react';

export default function Copyright() {
  return (
    <div className="max-w-4xl mx-auto mt-12 mb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <div className="bg-blue-600/10 text-blue-600 border border-blue-600/20 p-4 rounded-3xl inline-block mb-6">
          <CopyrightIcon size={40} />
        </div>
        <h1 className="text-5xl font-black text-text-primary tracking-tight mb-4 uppercase">Copyright & Legal</h1>
        <p className="text-text-secondary font-black tracking-[0.3em] uppercase text-[10px]">Attribution, Intellectual Property, and Affiliation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-bg-secondary p-8 rounded-[2.5rem] border border-border-subtle hover:border-blue-600/30 transition-all duration-300">
          <div className="w-12 h-12 bg-bg-primary border border-border-subtle rounded-2xl flex items-center justify-center text-blue-600 mb-6 font-black shadow-inner">
            <Scale size={24} />
          </div>
          <h3 className="text-xl font-black text-text-primary mb-3 uppercase tracking-tighter">Software License</h3>
          <p className="text-text-secondary text-sm leading-relaxed font-medium">
            OmniRent is open-source software licensed under the <span className="text-text-primary font-bold">MIT License</span>. You are free to use, copy, modify, and distribute the software, provided the original copyright notice and this permission notice are included in all copies.
          </p>
        </div>

        <div className="bg-bg-secondary p-8 rounded-[2.5rem] border border-border-subtle hover:border-blue-600/30 transition-all duration-300">
          <div className="w-12 h-12 bg-bg-primary border border-border-subtle rounded-2xl flex items-center justify-center text-blue-600 mb-6 font-black shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-black text-text-primary mb-3 uppercase tracking-tighter">Brand Identity</h3>
          <p className="text-text-secondary text-sm leading-relaxed font-medium">
            The code is MIT, but the <span className="text-text-primary font-bold">OmniRent Name, Logo, and Brand Assets</span> are the intellectual property of the project maintainers. These assets are NOT licensed for commercial use or branding by third parties without explicit consent.
          </p>
        </div>
      </div>

      <div className="bg-bg-secondary p-10 rounded-[3rem] border border-border-subtle relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-red-600/10 text-red-600 border border-red-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                <Globe size={28} />
            </div>
            <div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Non-Affiliation Disclaimer</h3>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">Official Legal Notice</p>
            </div>
        </div>

        <div className="space-y-6 text-text-secondary text-sm leading-relaxed font-medium border-l-2 border-border-subtle pl-8 ml-2">
          <p>
            <span className="text-text-primary font-black uppercase tracking-widest text-[11px] block mb-2 underline decoration-red-600/50 underline-offset-4">To whom it may concern:</span>
            OmniRent is an independent, community-driven open-source project. This project is <span className="text-text-primary font-bold">NOT affiliated with, endorsed by, or sponsored by</span> any other corporate entity or individual operating under the "Omnirent" or "Omni Rentals" name in the construction, real estate, or automotive industries.
          </p>
          <p>
             Any brand names, logos, or trademarks referenced within the platform belonging to third-party providers (such as Google, Stripe, or Cloudinary) remain the property of their respective owners and are used here for identification and integration purposes only.
          </p>
        </div>
      </div>

      <div className="mt-12 p-8 bg-blue-600 rounded-[2.5rem] text-center text-white shadow-2xl shadow-blue-500/20 group hover:scale-[1.01] transition-all duration-500">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Project Custodian</p>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Developed by Islam Pashazade</h2>
        <p className="text-blue-100 text-xs font-bold opacity-80 uppercase tracking-widest">Est. 2026 • Built for the Global Community</p>
      </div>
    </div>
  );
}
