import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BadgeCheck, 
  Sparkles, 
  Layout, 
  Download, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Plus, 
  Star, 
  Menu, 
  X,
  FileText
} from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Features list
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: "AI Bullet Writer",
      description: "Transform generic descriptions into high-impact, recruiter-approved achievements with smart keyword suggestions."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: "Real-time ATS Scoring",
      description: "See your ATS optimization score live as you type and get actionable tips to bypass automated screening filters."
    },
    {
      icon: <Layout className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: "Recruiter-Approved Templates",
      description: "Clean, professional, and typography-optimized layouts built strictly around standard industry hiring practices."
    },
    {
      icon: <Download className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: "One-Click Export",
      description: "Download fully formatted, parsed PDF or DOCX files instantly, or share a secure web link directly with hiring managers."
    }
  ];

  // Steps for "How it works"
  const steps = [
    {
      step: "01",
      title: "Select a Template",
      description: "Choose from our curated selection of professional layouts designed to highlight your experience."
    },
    {
      step: "02",
      title: "Add & Polish Content",
      description: "Input your career details and let our AI assist with formatting, power verbs, and ATS keywords."
    },
    {
      step: "03",
      title: "Download & Land Interviews",
      description: "Export high-resolution PDFs or DOCX files ready for your application. Track your ATS pass score."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-200 dark:selection:bg-primary-800 selection:text-primary-900 dark:selection:text-primary-100">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              CRACK <span className="text-primary-600 dark:text-primary-400">IT!</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How It Works</a>
            <a href="#mockup-section" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Interactive Preview</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="btn-ghost px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-xl transition-all">
              Log In
            </Link>
            <Link to="/signup" className="btn-primary text-sm font-semibold px-5 py-2.5 shadow-md shadow-primary-600/20 rounded-xl transition-all">
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 animate-slide-up">
            <div className="px-4 pt-2 pb-6 space-y-4 text-center">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600"
              >
                How It Works
              </a>
              <a 
                href="#mockup-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600"
              >
                Interactive Preview
              </a>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-secondary py-3 justify-center text-sm font-semibold rounded-xl"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-primary py-3 justify-center text-sm font-semibold rounded-xl"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge alert */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-6 border border-primary-100 dark:border-primary-900/30 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Resume Builder V2.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15] text-balance mb-6">
            Build a resume that gets you <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">hired</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            Create professional, ATS-optimized resumes in minutes. Tap into AI suggestions, real-time feedback, and recruiter-approved templates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link to="/signup" className="btn-primary py-3 px-8 text-base font-semibold shadow-lg shadow-primary-500/25 rounded-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/login" className="btn-secondary py-3 px-8 text-base font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              Try Demo Account
            </Link>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Free tier includes 1 full resume, AI suggestions, and PDF export. No credit card required.
          </p>
        </div>

        {/* Hero Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
          <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Interactive-looking Mockup Section */}
      <section id="mockup-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-32">
        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-slide-up">
          
          {/* Mockup Title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-4 font-mono select-none">app.crackit.dev/builder/new-resume</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/50 text-xs font-semibold py-1 px-2.5 rounded-full flex items-center gap-1.5 animate-pulse-slow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ATS Match: 88%
              </span>
            </div>
          </div>

          {/* Mockup Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] bg-slate-50/50 dark:bg-slate-950/50">
            
            {/* Mockup Left Sidebar: Form Builder */}
            <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Work Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Job Title</label>
                      <input 
                        type="text" 
                        value="Senior Software Engineer" 
                        disabled 
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Company</label>
                      <input 
                        type="text" 
                        value="TechCorp Inc." 
                        disabled 
                        className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Description</label>
                      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-950/30 text-[11px] leading-relaxed text-slate-500">
                        Led developers to build backend tools and microservices using Node.js and AWS.
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant panel widget */}
                <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100/60 dark:border-primary-900/20">
                  <div className="flex items-center gap-1.5 text-primary-700 dark:text-primary-400 font-semibold text-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    <span>AI Improvement Suggestion</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mb-3">
                    Add metrics and clarify technologies. For example:
                  </p>
                  <div className="p-2 bg-white dark:bg-slate-900 border border-primary-200 dark:border-primary-800 rounded-lg text-[11px] font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>"Spearheaded a team of 6 engineers to build scalable Node.js microservices on AWS, improving system reliability by 24%."</span>
                  </div>
                  <button className="w-full py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                    Apply Rewritten Bullet
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-2">
                <button className="flex-1 py-2 text-center text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                  Back
                </button>
                <button className="flex-1 py-2 text-center text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg">
                  Next Section
                </button>
              </div>
            </div>

            {/* Mockup Right Panel: Interactive Live Resume Preview */}
            <div className="lg:col-span-8 p-8 flex items-center justify-center overflow-x-auto">
              <div className="w-full max-w-[500px] aspect-[1/1.4] bg-white border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-8 flex flex-col justify-between text-[11px] text-slate-800 font-sans relative">
                
                {/* Paper content simulated */}
                <div>
                  <div className="text-center border-b border-slate-200 pb-3 mb-4">
                    <div className="text-lg font-bold tracking-wide text-slate-900 uppercase">Alex Johnson</div>
                    <div className="text-[9px] text-slate-500 mt-1 flex items-center justify-center gap-2">
                      <span>alex.johnson@email.com</span>
                      <span>•</span>
                      <span>(555) 019-2834</span>
                      <span>•</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-4">
                    <div className="text-[9px] font-bold text-primary-700 tracking-wider uppercase border-b border-slate-100 pb-0.5 mb-1.5">Professional Summary</div>
                    <p className="text-[10px] leading-relaxed text-slate-600">
                      Results-oriented Senior Software Engineer with 6+ years of experience building distributed backend systems. Expert in Node.js, TypeScript, AWS cloud infrastructure, and leading cross-functional engineering squads.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <div className="text-[9px] font-bold text-primary-700 tracking-wider uppercase border-b border-slate-100 pb-0.5 mb-2">Work Experience</div>
                    
                    {/* Item 1 */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between font-semibold text-slate-950">
                        <span>Senior Software Engineer</span>
                        <span className="text-[9px] font-normal text-slate-500">2022 - Present</span>
                      </div>
                      <div className="text-slate-500 font-medium">TechCorp Inc. — San Francisco, CA</div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed text-[10px]">
                        <li className="relative">
                          <span className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 p-0.5 rounded text-[10px] text-slate-900 inline-block font-medium">
                            Spearheaded a team of 6 engineers to build scalable Node.js microservices on AWS, improving system reliability by 24%.
                          </span>
                        </li>
                        <li>Designed and deployed an automated CI/CD pipeline, reducing deployment cycles from 4 days to under 30 minutes.</li>
                        <li>Mentored junior engineers and introduced automated testing standards, increasing test coverage from 45% to 88%.</li>
                      </ul>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold text-slate-950">
                        <span>Software Engineer II</span>
                        <span className="text-[9px] font-normal text-slate-500">2020 - 2022</span>
                      </div>
                      <div className="text-slate-500 font-medium">DevSprint Solutions — Seattle, WA</div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed text-[10px]">
                        <li>Refactored legacy monolith into REST APIs, boosting request throughput and reducing page load times by 40%.</li>
                        <li>Coordinated database migration process for PostgreSQL to MongoDB, handling over 2.5 million user records securely.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="text-[9px] font-bold text-primary-700 tracking-wider uppercase border-b border-slate-100 pb-0.5 mb-1.5">Technical Skills</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600 text-[10px]">
                      <span><strong className="text-slate-700">Languages:</strong> JavaScript, TypeScript, SQL, HTML/CSS, Go</span>
                      <span><strong className="text-slate-700">Frameworks:</strong> Node.js, Express, React, Next.js, Fastify</span>
                      <span><strong className="text-slate-700">Tools:</strong> AWS (S3, EC2, Lambda), Docker, Git, PostgreSQL, MongoDB</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[8px] text-slate-400 mt-4 border-t border-slate-100 pt-2 select-none">
                  Page 1 of 1
                </div>

                {/* Floating Preview Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <span className="badge bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 text-[9px] font-semibold py-1 px-2 rounded flex items-center gap-1 shadow-md">
                    <FileText className="w-3 h-3 text-primary-400" /> Executive Template
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">Core Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Everything you need to craft an outstanding resume.
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Ditch the clunky word processors. Crack IT combines intelligent automated layout structure with advanced AI writing feedback.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex items-center justify-center mb-6 border border-primary-100 dark:border-primary-900/20">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">Simple Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              From blank page to submitted application in minutes.
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              No layouts breaking, no alignment issues, no guessing which keywords matter.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {steps.map((step, i) => (
              <div key={i} className="space-y-4">
                {/* Number */}
                <div className="text-5xl font-black text-primary-500/20 dark:text-primary-400/20 tracking-tight select-none">
                  {step.step}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Build your professional resume today.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Take the frustration out of resume writing. Build a clean, recruiter-approved document that reflects your true impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary py-3 px-8 text-base font-semibold shadow-lg shadow-primary-500/25 rounded-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary py-3 px-8 text-base font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              CRACK IT!
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Crack IT. All rights reserved. Designed for candidates who deliver.
          </p>
        </div>
      </footer>

    </div>
  );
}
