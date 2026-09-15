import Link from "next/link";
import Image from "next/image";
import { Briefcase, Wrench, Clapperboard, HelpCircle, Images, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { counts, latestProjects, latestVideos } = await getDashboardStats();

  const cards = [
    { label: "Total Projects", value: counts.projects, icon: Briefcase, href: "/admin/projects" },
    { label: "Total Services", value: counts.services, icon: Wrench, href: "/admin/services" },
    { label: "Total Videos", value: counts.videos, icon: Clapperboard, href: "/admin/videos" },
    { label: "Total FAQs", value: counts.faqs, icon: HelpCircle, href: "/admin/faqs" },
    { label: "Hero Slides", value: counts.heroSlides, icon: Images, href: "/admin/hero-slides" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl text-brown-900">Dashboard</h1>
      <p className="font-body text-warm-grey mt-1">An overview of your ALDATA content.</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="border border-brown-200 bg-cream p-5 hover:border-brown-500 transition-colors focus-ring"
          >
            <Icon className="h-5 w-5 text-brown-500 mb-3" />
            <p className="font-display text-3xl text-brown-900">{value}</p>
            <p className="font-body text-xs text-warm-grey mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="border border-brown-200 bg-cream p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-brown-900">Latest Projects</h2>
            <Link href="/admin/projects" className="text-xs font-body text-brown-600 flex items-center gap-1 focus-ring">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestProjects.length === 0 ? (
            <p className="font-body text-sm text-warm-grey">No projects yet.</p>
          ) : (
            <ul className="space-y-4">
              {latestProjects.map((p: any) => (
                <li key={p._id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 bg-brown-100 shrink-0 overflow-hidden">
                    {(p.featuredImage?.secure_url || p.images?.[0]?.secure_url) && (
                      <Image src={p.featuredImage?.secure_url || p.images[0].secure_url} alt={p.name} fill sizes="48px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm text-brown-900 truncate">{p.name}</p>
                    <p className="font-body text-xs text-warm-grey">{formatDate(p.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-brown-200 bg-cream p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-brown-900">Latest Videos</h2>
            <Link href="/admin/videos" className="text-xs font-body text-brown-600 flex items-center gap-1 focus-ring">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestVideos.length === 0 ? (
            <p className="font-body text-sm text-warm-grey">No videos yet.</p>
          ) : (
            <ul className="space-y-4">
              {latestVideos.map((v: any) => (
                <li key={v._id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 bg-brown-100 shrink-0 overflow-hidden">
                    {v.thumbnail?.secure_url && (
                      <Image src={v.thumbnail.secure_url} alt={v.name} fill sizes="48px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm text-brown-900 truncate">{v.name}</p>
                    <p className="font-body text-xs text-warm-grey">{formatDate(v.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
