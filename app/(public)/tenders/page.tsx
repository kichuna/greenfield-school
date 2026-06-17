"use client";

import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Clock, CalendarCheck, CalendarX, FileDown, Tag, Timer } from "lucide-react";

type Tender = {
  id:              string;
  title:           string;
  description:     string;
  referenceNumber: string;
  category:        string;
  openDate:        string;
  closingDate:     string;
  documentUrl:     string | null;
  isPublished:     boolean;
};

function tenderStatus(openDate: string, closingDate: string) {
  const now   = Date.now();
  const open  = new Date(openDate).getTime();
  const close = new Date(closingDate).getTime();
  if (now < open)  return "upcoming" as const;
  if (now > close) return "closed"   as const;
  return "open" as const;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

function useCountdown(targetIso: string | null) {
  const [tick, setTick] = useState("");

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();

    function calc() {
      const diff = target - Date.now();
      if (diff <= 0) { setTick("Deadline passed"); return; }
      const d  = Math.floor(diff / 86400000);
      const h  = Math.floor((diff % 86400000) / 3600000);
      const m  = Math.floor((diff % 3600000)  / 60000);
      const s  = Math.floor((diff % 60000)    / 1000);
      setTick(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`);
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return tick;
}

const catLabels: Record<string, string> = {
  GOODS: "Goods", SERVICES: "Services", WORKS: "Works",
  CONSULTANCY: "Consultancy", OTHER: "Other",
};
const catColors: Record<string, string> = {
  GOODS:       "bg-blue-50   text-blue-700   border-blue-200",
  SERVICES:    "bg-purple-50 text-purple-700 border-purple-200",
  WORKS:       "bg-amber-50  text-amber-700  border-amber-200",
  CONSULTANCY: "bg-green-50  text-green-700  border-green-200",
  OTHER:       "bg-gray-50   text-gray-700   border-gray-200",
};

function CountdownBadge({ closingDate }: { closingDate: string }) {
  const tick = useCountdown(closingDate);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full">
      <Timer className="w-3 h-3" />
      Closes in {tick}
    </span>
  );
}

function TenderCard({ t }: { t: Tender }) {
  const status = tenderStatus(t.openDate, t.closingDate);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 ${
      status === "closed" ? "opacity-70" : ""
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-mono text-gray-400 mb-1">{t.referenceNumber}</p>
          <h3 className="text-base font-semibold text-gray-900 leading-snug">{t.title}</h3>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium border px-2.5 py-1 rounded-full ${catColors[t.category] ?? catColors.OTHER}`}>
          <Tag className="w-3 h-3" />
          {catLabels[t.category] ?? t.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{t.description}</p>

      {/* Dates */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <CalendarCheck className="w-3.5 h-3.5 text-green-500" />
          Opens {fmtDate(t.openDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarX className="w-3.5 h-3.5 text-red-400" />
          Closes {fmtDate(t.closingDate)}
        </span>
      </div>

      {/* Countdown (only for open tenders) */}
      {status === "open" && <CountdownBadge closingDate={t.closingDate} />}

      {/* Upcoming opens-in countdown */}
      {status === "upcoming" && (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full w-fit">
          <Clock className="w-3 h-3" />
          Opens {fmtDate(t.openDate)}
        </span>
      )}

      {/* Download */}
      {t.documentUrl && (
        <a
          href={t.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-school-blue hover:underline"
        >
          <FileDown className="w-4 h-4" />
          Download Tender Document
        </a>
      )}
    </div>
  );
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tenders")
      .then((r) => r.json())
      .then((d) => { setTenders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const open     = tenders.filter((t) => tenderStatus(t.openDate, t.closingDate) === "open");
  const upcoming = tenders.filter((t) => tenderStatus(t.openDate, t.closingDate) === "upcoming");
  const closed   = tenders.filter((t) => tenderStatus(t.openDate, t.closingDate) === "closed");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-school-blue to-blue-800 text-white pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-100 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <ClipboardList className="w-3.5 h-3.5" />
            Procurement & Tenders
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Open Tenders</h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            Greenfield High School invites qualified suppliers and service providers to bid on the tenders listed below.
            All procurement is conducted in accordance with public procurement guidelines.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-14">
        {loading ? (
          <div className="text-center py-24 text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
            <p>Loading tenders…</p>
          </div>
        ) : tenders.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600">No active tenders at this time.</p>
            <p className="text-sm mt-1">Please check back later or contact the school for information.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {open.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-xl font-heading font-bold text-gray-900">Open Tenders</h2>
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full font-medium">{open.length}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {open.map((t) => <TenderCard key={t.id} t={t} />)}
                </div>
              </section>
            )}

            {upcoming.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <h2 className="text-xl font-heading font-bold text-gray-900">Upcoming Tenders</h2>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">{upcoming.length}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {upcoming.map((t) => <TenderCard key={t.id} t={t} />)}
                </div>
              </section>
            )}

            {closed.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-400" />
                  <h2 className="text-xl font-heading font-bold text-gray-900">Closed Tenders</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full font-medium">{closed.length}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {closed.map((t) => <TenderCard key={t.id} t={t} />)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Notice */}
        <div className="mt-16 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <strong className="font-semibold">Procurement Notice:</strong> All tenders must be submitted by the stated closing date and time.
          Late submissions will not be accepted. For clarifications, contact the Procurement Office at{" "}
          <a href="mailto:procurement@greenfieldhs.ac" className="underline">procurement@greenfieldhs.ac</a>.
        </div>
      </main>
    </>
  );
}
