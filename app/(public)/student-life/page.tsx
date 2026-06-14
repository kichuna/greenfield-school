import type { Metadata } from "next";
import { Trophy, Users, Star, Shirt, Music, BookOpen, Dumbbell, Globe, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Student Life",
  description: "Explore clubs, sports, houses, leadership, and student achievements at Greenfield High School.",
};

const clubs = [
  { Icon: Cpu,      name: "Coding & Robotics Club",   members: 45, desc: "Build apps, robots, and compete in national hackathons." },
  { Icon: Globe,    name: "Debate & MUN Club",         members: 60, desc: "National debate champions. Represent Kenya at international MUN." },
  { Icon: Music,    name: "Music & Choir",             members: 80, desc: "Two choirs, a jazz band, and a traditional ensemble." },
  { Icon: BookOpen, name: "Creative Writing Club",     members: 35, desc: "Publish the school magazine and short story collections." },
  { Icon: Dumbbell, name: "Fitness & Wellness Club",   members: 50, desc: "Yoga, aerobics, and mental wellness programs." },
  { Icon: Globe,    name: "Environmental Club",        members: 70, desc: "Tree planting, sustainability, and community clean-ups." },
  { Icon: Users,    name: "Young Entrepreneurs",       members: 40, desc: "Business plans, pitching competitions, and mentorship." },
  { Icon: Star,     name: "Drama Society",             members: 55, desc: "Produce and perform plays at the National Drama Festival." },
];

const sports = [
  { name: "Football (Boys)",    achievement: "National Quarter-finalists 2024" },
  { name: "Netball (Girls)",    achievement: "County Champions 2024" },
  { name: "Athletics",          achievement: "15 national medals 2024" },
  { name: "Basketball",         achievement: "Regional runners-up 2024" },
  { name: "Volleyball",         achievement: "County Champions 2024" },
  { name: "Swimming",           achievement: "National school record 2024" },
  { name: "Badminton",          achievement: "National Championship finalists" },
  { name: "Chess",              achievement: "East Africa Champions 2024" },
];

const houses = [
  { name: "Phoenix House",  color: "bg-red-500",    motto: "Rise and Excel" },
  { name: "Falcon House",   color: "bg-blue-600",   motto: "Swift and Fearless" },
  { name: "Titan House",    color: "bg-green-600",  motto: "Strength Through Unity" },
  { name: "Eagle House",    color: "bg-amber-500",  motto: "Soar Above All" },
];

const achievements = [
  "KCSE Mean Score: B+ (2024)",
  "National Drama Festival — Gold Medal 2025",
  "Kenya Music Festival — Gold Medal 2024",
  "National Science Fair — 2nd Place 2024",
  "East Africa Chess Champions 2024",
  "Inter-School Debate — National Champions 2024",
  "Kenya Schools Netball — County Champions 2024",
  "Best Environmental School Award 2024",
];

export default function StudentLifePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-school-blue to-primary-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Beyond the Classroom</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Student Life & Activities</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover your passion through sports, clubs, leadership, and a vibrant school community.
          </p>
        </div>
      </section>

      {/* Clubs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-2">Co-curricular</p>
            <h2 className="section-heading mx-auto">Clubs & Societies</h2>
            <p className="section-subheading mx-auto mt-4 text-center">
              Over 20 clubs covering technology, arts, sports, entrepreneurship, and community service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map(({ Icon, name, members, desc }) => (
              <div key={name} className="card p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-school-blue" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{name}</h3>
                <p className="text-school-gold text-xs mb-2">{members} members</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-2">Athletics</p>
            <h2 className="section-heading mx-auto">Sports Programs</h2>
            <p className="section-subheading mx-auto mt-4 text-center">
              State-of-the-art facilities and dedicated coaches for 10+ sports disciplines.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sports.map(({ name, achievement }) => (
              <div key={name} className="card p-5">
                <div className="w-10 h-10 bg-school-gold/10 rounded-lg flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-school-gold" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{name}</h3>
                <p className="text-green-600 text-xs">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Houses */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-2">House System</p>
            <h2 className="section-heading mx-auto">School Houses</h2>
            <p className="section-subheading mx-auto mt-4 text-center">
              Every student belongs to a house that competes across academics, sports, and arts throughout the year.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {houses.map(({ name, color, motto }) => (
              <div key={name} className="card overflow-hidden">
                <div className={`${color} h-3`} />
                <div className="p-6">
                  <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-4`}>
                    <Shirt className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 mb-1">{name}</h3>
                  <p className="text-gray-500 text-sm italic">"{motto}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Leadership */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-school-gold font-semibold text-sm uppercase tracking-wider mb-3">Leadership</p>
              <h2 className="section-heading">Student Government</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Student Council is the voice of the student body. Elected by peers, student leaders participate in school governance, organize events, and champion student welfare.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Greenfield alumni in leadership positions across Kenya and globally credit their early leadership roles at school as foundational to their success.
              </p>
              <div className="space-y-3">
                {["School Head Prefect & Deputy", "House Captains", "Club Presidents", "Class Representatives"].map((r) => (
                  <div key={r} className="flex items-center gap-3 text-gray-700 text-sm">
                    <Star className="w-4 h-4 text-school-gold shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-school-blue rounded-2xl p-8 text-white">
              <h3 className="font-heading font-bold text-xl mb-6">Student Achievements 2024/25</h3>
              <ul className="space-y-3">
                {achievements.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-blue-100 text-sm">
                    <Trophy className="w-4 h-4 text-school-gold shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
