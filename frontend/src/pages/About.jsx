import { Heart, Github, Code, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-text-primary tracking-tight mb-4">
          Hello from <span className="text-blue-600">OmniRent</span>
        </h1>
        <p className="text-lg text-text-secondary font-medium">
          A peer-to-peer equipment marketplace built with trust at its core.
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-bg-secondary p-8 rounded-[2rem] border border-border-subtle shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Heart size={24} fill="currentColor" />
            <h2 className="text-xl font-black uppercase tracking-widest text-text-primary">Our Mission</h2>
          </div>
          <p className="text-text-secondary leading-relaxed font-medium">
            OmniRent was created to solve a simple problem: how do we share high-value equipment safely? 
            By combining a robust escrow system, mandatory identity verification, and a community-driven 
            review engine, we've built a platform where your gear is as safe as your money.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-secondary p-8 rounded-[2rem] border border-border-subtle">
            <Code className="text-blue-600 mb-4" size={24} />
            <h3 className="text-lg font-black text-text-primary mb-2">Open Source</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              This project is open-source under the MIT License. We believe in transparency 
              and community contribution to improve platform security.
            </p>
          </div>

          <div className="bg-bg-secondary p-8 rounded-[2rem] border border-border-subtle">
            <Shield className="text-blue-600 mb-4" size={24} />
            <h3 className="text-lg font-black text-text-primary mb-2">Security First</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              With 58+ automated tests guarding the escrow engine, we prioritize the 
              mathematical safety of every transaction.
            </p>
          </div>
        </div>

        <section className="text-center py-8">
          <p className="text-text-secondary font-bold mb-6 italic">
            "Developed with care by Islam Pashazade"
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/idkreally001/omnirent-core"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-text-primary text-bg-primary rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all"
            >
              <Github size={16} />
              Support on GitHub
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
