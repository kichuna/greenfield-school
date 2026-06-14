import type { Metadata } from "next";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Events | Greenfield High School",
  description: "Upcoming events, activities, and important dates at Greenfield High School.",
};

const events = [
  {
    id: 1,
    title: "Annual Science Fair 2025",
    date: "2025-03-15",
    time: "9:00 AM – 4:00 PM",
    venue: "Main Hall, Block A",
    category: "ACADEMIC",
    description:
      "Students from Forms 1–4 present innovative science projects to a panel of judges from local universities and industry.",
    featured: true,
  },
  {
    id: 2,
    title: "Inter-School Athletics Championship",
    date: "2025-03-22",
    time: "8:00 AM – 6:00 PM",
    venue: "Greenfield Sports Complex",
    category: "SPORTS",
    description:
      "Our athletes compete against twelve invited schools in track, field, and cross-country events.",
    featured: true,
  },
  {
    id: 3,
    title: "Parent-Teacher Conference (Term 1)",
    date: "2025-03-28",
    time: "10:00 AM – 3:00 PM",
    venue: "Classrooms & Library",
    category: "COMMUNITY",
    description:
      "An opportunity for parents to meet form teachers, review student progress reports, and discuss academic goals.",
    featured: false,
  },
  {
    id: 4,
    title: "Drama & Music Night",
    date: "2025-04-05",
    time: "6:00 PM – 9:00 PM",
    venue: "School Auditorium",
    category: "ARTS",
    description:
      "An evening celebrating student talent through theatrical performances, choral music, and instrumental solos.",
    featured: false,
  },
  {
    id: 5,
    title: "Open Day & Admissions Expo",
    date: "2025-04-12",
    time: "9:00 AM – 1:00 PM",
    venue: "Entire School Campus",
    category: "ADMISSIONS",
    description:
      "Prospective students and parents are invited to tour the school, meet staff, and learn about the admissions process.",
    featured: true,
  },
  {
    id: 6,
    title: "Environmental Action Day",
    date: "2025-04-22",
    time: "8:00 AM – 12:00 PM",
    venue: "School Grounds & Arboretum",
    category: "COMMUNITY",
    description:
      "Students, staff, and parents join together for a tree-planting exercise and clean-up drive around the school.",
    featured: false,
  },
  {
    id: 7,
    title: "STEM Innovation Summit",
    date: "2025-05-10",
    time: "9:00 AM – 5:00 PM",
    venue: "Computer Lab & Physics Block",
    category: "ACADEMIC",
    description:
      "A day-long summit featuring guest speakers from tech companies, hands-on coding workshops, and robotics demos.",
    featured: false,
  },
  {
    id: 8,
    title: "Annual Prize Giving Day",
    date: "2025-06-20",
    time: "10:00 AM – 1:00 PM",
    venue: "School Auditorium",
    category: "ACADEMIC",
    description:
      "Recognition of academic excellence, co-curricular achievement, and service to the school community.",
    featured: true,
  },
];

const categoryColors: Record<string, string> = {
  ACADEMIC:   "bg-blue-50 text-blue-700",
  SPORTS:     "bg-green-50 text-green-700",
  ARTS:       "bg-purple-50 text-purple-700",
  COMMUNITY:  "bg-amber-50 text-amber-700",
  ADMISSIONS: "bg-rose-50 text-rose-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default function EventsPage() {
  const featured = events.filter((e) => e.featured);
  const regular  = events.filter((e) => !e.featured);

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

        {/* Featured events */}
        {featured.length > 0 && (
          <section className="mb-16">
            <h2 className="section-heading mb-8">Featured Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((event) => (
                <div key={event.id} className="card p-6 border-l-4 border-school-blue">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <span className={`badge ${categoryColors[event.category]} whitespace-nowrap`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <div className="space-y-1.5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-school-blue" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-school-blue" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-school-blue" />
                      <span>{event.venue}</span>
                    </div>
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
            {[...featured, ...regular]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => (
                <div key={event.id} className="card p-5 flex flex-col sm:flex-row gap-5">
                  {/* Date block */}
                  <div className="sm:w-24 flex-shrink-0 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 sm:justify-center bg-blue-50 rounded-xl p-3 text-center">
                    <span className="text-2xl font-bold text-school-blue leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs font-medium text-school-blue uppercase tracking-wide">
                      {new Date(event.date).toLocaleDateString("en-KE", { month: "short" })}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(event.date).getFullYear()}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                      <span className={`badge ${categoryColors[event.category]}`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {event.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.venue}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Add to calendar note */}
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
