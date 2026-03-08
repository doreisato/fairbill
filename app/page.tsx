"use client";

import { useState } from "react";
import { Search, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Procedure {
  cpt_code: string;
  description: string;
  medicare_rate: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Procedure | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data, error: dbError } = await supabase
        .from('fairbill_procedures')
        .select('*')
        .or(`cpt_code.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(1)
        .single();

      if (dbError || !data) {
        setError("Procedure not found. Try a different CPT code or keyword.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrice = result ? (result.medicare_rate * 1.2).toFixed(2) : "0.00";

  const negotiationScript = result
    ? `Hello,

I recently received a bill for ${result.description} (CPT ${result.cpt_code}). According to the Medicare Physician Fee Schedule, the allowable amount for this procedure is $${result.medicare_rate.toFixed(2)}.

I would like to request a reduction of my bill to $${suggestedPrice}, which is 120% of the Medicare rate. This is a fair and reasonable adjustment based on federal benchmarks.

Please let me know if you can adjust my bill to this amount, or provide a comparable discount. I'm happy to discuss payment arrangements if needed.

Thank you for your time.`
    : "";

  const copyScript = () => {
    navigator.clipboard.writeText(negotiationScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-3">FairBill</h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Find Medicare-benchmarked fair prices for medical procedures and get a ready-to-use negotiation script.
          </p>
        </header>

        <section className="mb-10 border border-neutral-900 rounded-lg p-4 bg-neutral-950">
          <h2 className="text-sm uppercase tracking-[0.18em] text-neutral-500 mb-3">How it works</h2>
          <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
            <li>Search by CPT code or procedure name.</li>
            <li>See the Medicare benchmark and a negotiation target.</li>
            <li>Copy the script and send it to your provider billing office.</li>
          </ol>
        </section>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter CPT code or procedure name (e.g., MRI, 82947)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-4 pr-12 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8">
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">{result.description}</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">CPT Code</p>
                  <p className="text-2xl font-semibold">{result.cpt_code}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Medicare Rate</p>
                  <p className="text-2xl font-semibold">${result.medicare_rate.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Suggested Negotiation Amount</p>
                <p className="text-3xl font-semibold text-white">${suggestedPrice}</p>
                <p className="text-xs text-neutral-600 mt-2">120% of Medicare allowable rate</p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Negotiation Script</h3>
                <button
                  onClick={copyScript}
                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 rounded text-sm transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed font-sans">
                {negotiationScript}
              </pre>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-900 py-6 px-6">
        <p className="text-xs text-neutral-600 max-w-3xl mx-auto mb-4 leading-relaxed">
          Reference only. Not financial or medical advice. Medicare rates vary by location and provider. Consult a medical billing advocate for personalized guidance.
        </p>
        <p className="text-center text-xs text-neutral-600">
          Built by{" "}
          <a href="https://infinite-machines-production.up.railway.app" className="text-neutral-500 hover:text-white transition-colors">
            Infinite Machines
          </a>
        </p>
      </footer>
    </main>
  );
}