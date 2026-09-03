import { useState } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";

import {
  Search,
  Share2,
  PhoneCall,
  BookOpen,
  Scale,
  ShieldCheck,
  HandCoins,
  HeartHandshake,
  Siren,
  Stethoscope,
  Star,
  Filter,
  ExternalLink,
  Bookmark,
  Check,
  ChevronDown,
} from "lucide-react";

/* -----------------------------
   RESOURCE DATA
----------------------------- */

const resources = [
  {
    id: 1,
    title: "Emotional Support & Coping Guide",
    category: "Emotional support",
    language: "English",
    description:
      "A simple guide covering emotional coping, grounding techniques, and ways to seek trusted support.",
    icon: HeartHandshake,
    recommendedFor: ["Medium", "High"],
    type: "Guide",
  },
  {
    id: 2,
    title: "Understanding Your Legal Rights",
    category: "Legal information",
    language: "English",
    description:
      "Information about basic legal rights, documentation, reporting options, and accessing legal assistance.",
    icon: Scale,
    recommendedFor: ["Medium", "High"],
    type: "Information",
  },
  {
    id: 3,
    title: "Safety Planning Resource",
    category: "Protection",
    language: "English",
    description:
      "Practical information for creating a personal safety plan and identifying trusted emergency contacts.",
    icon: ShieldCheck,
    recommendedFor: ["High"],
    type: "Safety guide",
  },
  {
    id: 4,
    title: "Financial Assistance Programs",
    category: "Financial assistance",
    language: "Hindi",
    description:
      "Information about financial assistance, government schemes, and organizations offering recovery support.",
    icon: HandCoins,
    recommendedFor: ["Low", "Medium"],
    type: "Resource list",
  },
  {
    id: 5,
    title: "Rehabilitation & Skill Support",
    category: "Rehabilitation",
    language: "English",
    description:
      "Explore rehabilitation programs, skill development opportunities, and long-term recovery resources.",
    icon: BookOpen,
    recommendedFor: ["Low", "Medium"],
    type: "Program",
  },
  {
    id: 6,
    title: "Talk to a Counsellor",
    category: "Counselling",
    language: "English",
    description:
      "Connect with a trained counsellor for confidential emotional support and guidance.",
    icon: Stethoscope,
    recommendedFor: ["Medium", "High"],
    type: "Human support",
  },
  {
    id: 7,
    title: "Emergency Support Contacts",
    category: "Emergency support",
    language: "Hindi",
    description:
      "Important emergency contacts and guidance for situations where immediate help may be needed.",
    icon: Siren,
    recommendedFor: ["High"],
    type: "Emergency",
  },
  {
    id: 8,
    title: "Counselling Services in Hindi",
    category: "Counselling",
    language: "Hindi",
    description:
      "Find counselling resources and support services available in Hindi.",
    icon: HeartHandshake,
    recommendedFor: ["Medium", "High"],
    type: "Human support",
  },
];

/* -----------------------------
   CATEGORIES & LANGUAGES
----------------------------- */

const categories = [
  "All",
  "Emotional support",
  "Legal information",
  "Rehabilitation",
  "Financial assistance",
  "Protection",
  "Counselling",
  "Emergency support",
];

const languages = ["All", "English", "Hindi"];

/* -----------------------------
   RESOURCE CARD
----------------------------- */

function ResourceCard({ resource, saved, onSave }) {
  const Icon = resource.icon;

  return (
    <Card className="flex flex-col justify-between bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-200">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <Badge className="text-xs font-medium text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
              {resource.category}
            </Badge>
          </div>

          <button
            onClick={() => onSave(resource.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
            title="Save resource"
          >
            {saved ? (
              <Bookmark className="w-5 h-5 text-teal-400 fill-teal-400" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Content */}
        <h2 className="text-lg font-semibold text-white mt-5">
          {resource.title}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mt-2">
          {resource.description}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/50">
            {resource.language}
          </span>
          <span className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/50">
            {resource.type}
          </span>
        </div>
      </div>

      {/* Buttons Footer */}
      <div className="flex gap-3 mt-6 pt-2">
        <Button className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Resource
        </Button>

        <Button
          className="px-3.5 bg-slate-700/80 hover:bg-slate-700 text-white transition"
          title="Share resource"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

/* -----------------------------
   RECOMMENDED CARD
----------------------------- */

function RecommendedCard({ resource, onSave, saved }) {
  const Icon = resource.icon;

  return (
    <Card className="bg-gradient-to-br from-teal-950/60 via-slate-800/80 to-slate-900/80 border border-teal-500/30 rounded-2xl p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wide uppercase">
        <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
        Recommended for you
      </div>

      <div className="flex items-start justify-between mt-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{resource.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{resource.category}</p>
          </div>
        </div>

        <button
          onClick={() => onSave(resource.id)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
        >
          {saved ? (
            <Bookmark className="w-5 h-5 text-teal-400 fill-teal-400" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mt-4">
        {resource.description}
      </p>

      <div className="mt-4 p-3.5 rounded-xl bg-slate-950/50 border border-teal-500/20">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-teal-400 font-medium">
            Why this is recommended:
          </span>{" "}
          Your current support signal indicates that this type of resource may
          be useful right now.
        </p>
      </div>

      <Button className="w-full mt-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-2.5 transition">
        Explore Resource
      </Button>
    </Card>
  );
}

/* -----------------------------
   MAIN PAGE COMPONENT
----------------------------- */

function Library() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("All");
  const [savedResources, setSavedResources] = useState([]);

  const currentSupportSignal = "Medium";

  const handleSave = (id) => {
    setSavedResources((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || resource.category === category;

    const matchesLanguage =
      language === "All" || resource.language === language;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const recommendedResource = resources.find((resource) =>
    resource.recommendedFor.includes(currentSupportSignal)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Container wrapper for uniform alignment */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="w-full">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-teal-400 tracking-tight">
                Resource Library
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Trusted resources for emotional, legal, financial,
                rehabilitation, counselling, and safety support.
              </p>
            </div>
          </div>
        </header>

        {/* EXPLAINABILITY NOTICE */}
        <Card className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Support, not diagnosis
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Resources are offered to help you explore available support.
                Recommendations are based on a mock support signal and should
                not be interpreted as a medical diagnosis or professional
                assessment.
              </p>
            </div>
          </div>
        </Card>

        {/* RECOMMENDED RESOURCE */}
        {recommendedResource && (
          <section>
            <RecommendedCard
              resource={recommendedResource}
              onSave={handleSave}
              saved={savedResources.includes(recommendedResource.id)}
            />
          </section>
        )}

        {/* SEARCH & FILTERS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-semibold text-white">Find a resource</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition pr-10"
              >
                {categories.map((item) => (
                  <option key={item} value={item} className="bg-slate-800 text-white">
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition pr-10"
              >
                {languages.map((item) => (
                  <option key={item} value={item} className="bg-slate-800 text-white">
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* RESOURCE GRID */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">All resources</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {filteredResources.length} resources available
              </p>
            </div>

            {savedResources.length > 0 && (
              <Badge className="bg-teal-500/10 text-teal-300 border border-teal-500/20 px-3 py-1 rounded-full text-xs">
                {savedResources.length} saved
              </Badge>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  saved={savedResources.includes(resource.id)}
                  onSave={handleSave}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-12 text-center">
              <Search className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-lg font-semibold text-white mt-4">
                No resources found
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Try adjusting your search query or filters.
              </p>
            </Card>
          )}
        </section>

        {/* HUMAN CONTACT CTA */}
        <Card className="bg-gradient-to-r from-indigo-950/60 via-slate-800/70 to-teal-950/40 border border-indigo-500/30 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-white">
                  Need help finding the right resource?
                </h3>
              </div>
              <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
                You can contact a trained support person who can help you
                understand your options. You don't need an AI assessment or
                diagnosis to ask for help.
              </p>
            </div>

            <Button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-6 py-2.5 transition whitespace-nowrap">
              <PhoneCall className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </Card>

        {/* FOOTER NOTICE */}
        <footer className="pt-4 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            If you are in immediate danger, contact your local emergency
            service or a trusted person who can help you reach safety.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Library;