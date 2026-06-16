import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Events | Greenfield High School",
  description: "Upcoming events, activities, and important dates at Greenfield High School.",
};

export const revalidate = 60;

const categoryColors: Record<string, string> = {
  ACADEMIC: "bg-blue-50 text-blue-700",
  SPORTS:   "bg-green-50 text-green-700",
  CULTURAL: "bg-purple-50 text-purple-700",
  ALUMNI:   "bg-amber-50 text-amber-700",
  GENERAL:  "bg-gray-100 text-gray-700",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-KE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatTime(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where:   { isPublished: true },
    orderBy: { startDate: "asc" },
    select: {
      id:          true,
      title:       true,
      description: true,
      location:    true,
      startDate:   true,
      endDate:     true,
      category:    true,
    },
  }).catch(() => []);

  const featured = events.filter((_, i) => i < 2);
  const upcoming = events;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-school-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Stay connected with all the activities, milestones, and celebrations happening at Greenfield High School.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {events.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-25" />
            <p className="text-xl font-medium">No upcoming events.</p>
            <p className="text-sm mt-2">Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Featured — first two events */}
            {featured.length > 0 && (
              <section className="mb-16">
                <h2 className="section-heading mb-8">Featured Events</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map((event) => (
                    <div key={event.id} className="card p-6 border-l-4 border-school-blue">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <span className={`badge ${categoryColors[event.category] ?? "bg-gray-100 text-gray-700"} whitespace-nowrap`}>
                          {event.category}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                      )}
                      <div className="space-y-1.5 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-school-blue" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-school-blue" />
                          <span>{formatTime(event.startDate, event.endDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-school-blue" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All upcoming events */}
            <section>
              <h2 className="section-heading mb-8">All Upcoming Events</h2>
              <div className="space-y-4">
                {upcoming.map((event) => (
                  <div key={event.id} className="card p-5 flex flex-col sm:flex-row gap-5">
                    {/* Date block */}
                    <div className="sm:w-24 flex-shrink-0 flex sm:flex-col items-center gap-3 sm:gap-0 sm:justify-center bg-blue-50 rounded-xl p-3 text-center">
                      <span className="text-2xl font-bold text-school-blue leading-none">
                        {event.startDate.getDate()}
                      </span>
                      <span className="text-xs font-medium text-school-blue uppercase tracking-wide">
                        {event.startDate.toLocaleDateString("en-KE", { month: "short" })}
                      </span>
                      <span className="text-xs text-gray-400">
                        {event.startDate.getFullYear()}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                        <span className={`badge ${categoryColors[event.category] ?? "bg-gray-100 text-gray-700"}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {event.category}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(event.startDate, event.endDate)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Contact note */}
        <div className="mt-12 bg-school-gold/10 border border-school-gold/30 rounded-xl p-6 text-center">
          <p className="text-gray-700 font-medium">
            Want to stay updated? Contact the school office at{" "}
            <a href="mailto:info@greenfieldhs.ac" className="text-school-blue hover:underline">
              info@greenfieldhs.ac
            </a>{" "}
            to receive event reminders.
          </p>
        </div>
      </div>
    </div>
  );
}
