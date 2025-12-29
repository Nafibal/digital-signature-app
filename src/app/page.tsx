import React from "react";
import Link from "next/link";
import {
  FileSignature,
  Eye,
  MousePointerClick,
  History,
  ArrowRight,
  CheckCircle2,
  Shield,
  Scale,
  Zap,
  BookOpen,
  FileText,
  Link2,
} from "lucide-react";
import NavigationBar from "@/components/navigation/NavigationBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-950 antialiased selection:bg-neutral-900 selection:text-white">
      {/* --- NAVBAR --- */}
      <NavigationBar session={session} />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm font-medium text-neutral-600 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-neutral-950 mr-2"></span>
              Enterprise Ready (Next.js 15)
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-neutral-950 mb-6 max-w-4xl mx-auto">
              Secure & Structured <br className="hidden md:block" />
              <span className="text-neutral-500">Document Workflows.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A digital signature platform combining document integrity,
              real-time PDF previews, and drag-and-drop simplicity for
              professional teams and official agencies.
            </p>

            <Link href="/dashboard">
              <button className="h-12 px-8 rounded-md bg-neutral-950 text-white font-medium hover:bg-neutral-900 transition-all shadow-lg shadow-neutral-500/20">
                Create Document
              </button>
            </Link>
          </div>

          {/* Geometric pattern background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Large circle */}
            <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-neutral-200/40 blur-3xl"></div>
            {/* Medium circle */}
            <div className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full bg-neutral-300/30 blur-3xl"></div>
            {/* Small circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neutral-100/50 blur-2xl"></div>
            {/* Geometric shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-neutral-200/20 rotate-45 blur-xl"></div>
            <div className="absolute bottom-32 right-20 w-40 h-40 bg-neutral-300/20 rotate-12 blur-xl"></div>
            <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-neutral-100/30 rotate-45 blur-lg"></div>
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.2)_1px,transparent_0)] bg-size-[32px_32px]"></div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section
          id="features"
          className="py-24 bg-neutral-50/50 border-y border-neutral-100"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="group space-y-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <Eye className="h-6 w-6 text-neutral-700" />
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Live PDF Preview
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  See documents exactly as the final output. No guessing
                  signature positions; the view updates in real-time using
                  PDF.js.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group space-y-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <MousePointerClick className="h-6 w-6 text-neutral-700" />
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Drag & Drop Signing
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Place your digital signature with precision. Simply drag and
                  drop elements to the desired position without technical
                  complexity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group space-y-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <History className="h-6 w-6 text-neutral-700" />
                </div>
                <h3 className="text-xl font-bold text-neutral-950">
                  Complete Audit Trail
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Every step is tracked. From draft creation and review to final
                  signing, ensuring integrity for audit requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WORKFLOW SECTION --- */}
        <section id="workflow" className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 tracking-tight">
                  Designed for <br />
                  <span className="text-neutral-500">
                    Structured Processes.
                  </span>
                </h2>
                <p className="text-lg text-neutral-600">
                  Unlike generic e-sign tools, this application guides you
                  through clear stages to reduce errors and manual
                  back-and-forth revisions.
                </p>

                <ul className="space-y-4">
                  {[
                    "Preparation & PDF Upload",
                    "Signature Positioning (Drafting)",
                    "Tiered Review & Approval",
                    "Finalization & Secure Storage",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-neutral-800 font-medium"
                    >
                      <CheckCircle2 className="h-5 w-5 text-neutral-950" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Representation of Workflow (Mockup) */}
              <div className="flex-1 w-full relative">
                <div className="relative aspect-video rounded-xl bg-neutral-100 border border-neutral-200 p-4 shadow-xl overflow-hidden">
                  {/* Mock UI Elements */}
                  <div className="absolute top-4 left-4 right-4 h-8 bg-white rounded border border-neutral-200 flex items-center px-3 gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-400"></div>
                    <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="absolute top-16 left-4 right-4 bottom-4 bg-white border border-neutral-200 rounded shadow-sm flex">
                    <div className="w-1/3 border-r border-neutral-100 p-4 space-y-2">
                      <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                      <div className="h-2 w-3/4 bg-neutral-100 rounded"></div>
                      <div className="h-2 w-2/3 bg-neutral-100 rounded"></div>
                      <div className="mt-4 h-8 w-full bg-neutral-950 rounded"></div>
                    </div>
                    <div className="w-2/3 p-4 flex items-center justify-center bg-neutral-50/50">
                      <div className="h-32 w-24 bg-white shadow border border-neutral-200 flex items-center justify-center">
                        <span className="text-[10px] text-neutral-300">
                          PDF Preview
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg shadow-lg">
                    Status: Signed & Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE US / BENEFITS --- */}
        <section className="py-20 bg-neutral-950 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose DigiSign?
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                Experience the difference with a platform designed for security,
                speed, and simplicity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:bg-neutral-800 group-hover:border-neutral-600 transition-all">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  End-to-end encryption and secure storage protocols protect
                  your sensitive documents at every step.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:bg-neutral-800 group-hover:border-neutral-600 transition-all">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Legal Compliance</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Fully compliant with eIDAS, ESIGN, and UETA standards for
                  legally binding electronic signatures.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:bg-neutral-800 group-hover:border-neutral-600 transition-all">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Process documents in seconds, not hours. Streamlined workflows
                  save time for your entire team.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:bg-neutral-800 group-hover:border-neutral-600 transition-all">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Zero Learning Curve</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Intuitive interface designed for everyone. No training
                  required—start signing documents immediately.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:bg-neutral-800 group-hover:border-neutral-600 transition-all">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Audit Ready</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Complete document history and compliance reports make audits
                  simple and stress-free.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 group-hover:bg-neutral-800 group-hover:border-neutral-600 transition-all">
                  <Link2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Works with your existing tools and workflows. Easy API access
                  for custom integrations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 bg-white border-t border-neutral-200">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-6 tracking-tight">
              Ready to digitize your documents?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
              Improve internal team efficiency and document management with a
              secure and tested system.
            </p>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-8 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900 transition-colors"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg text-neutral-900">
            <FileSignature className="h-5 w-5" />
            <span>DigiSign.</span>
          </div>
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Digital Signature App. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link href="#" className="hover:text-neutral-950">
              Privacy
            </Link>
            <Link href="#" className="hover:text-neutral-950">
              Terms
            </Link>
            <Link href="#" className="hover:text-neutral-950">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
