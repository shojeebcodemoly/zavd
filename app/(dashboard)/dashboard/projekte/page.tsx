import Link from "next/link";
import { Heart, UserCheck, Award, Zap, HandHeart } from "lucide-react";

const projects = [
	{
		title: "Patenschaftsprojekt",
		subtitle: "Mentorship Program",
		href: "/dashboard/projekte/patenschaftsprojekt",
		icon: Heart,
	},
	{
		title: "Gemeinsam Aktiv",
		subtitle: "Active Together",
		href: "/dashboard/projekte/gemeinsam-aktiv",
		icon: UserCheck,
	},
	{
		title: "Successful Integration",
		subtitle: "Gut Reinkommen",
		href: "/dashboard/projekte/gut-reinkommen",
		icon: Award,
	},
	{
		title: "GeT AKTIV",
		subtitle: "Get Active Program",
		href: "/dashboard/projekte/get-aktiv",
		icon: Zap,
	},
	{
		title: "Ehrenamt & Engagement",
		subtitle: "Volunteering",
		href: "/dashboard/projekte/ehrenamt-engagement",
		icon: HandHeart,
	},
];

export default function ProjektePage() {
	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">Projekte</h1>
				<p className="text-slate-500 mt-1">Manage all project pages content.</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{projects.map((project) => (
					<Link
						key={project.href}
						href={project.href}
						className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 group"
					>
						<div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
							<project.icon className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="font-semibold text-slate-900 text-sm">{project.title}</p>
							<p className="text-slate-500 text-xs mt-0.5">{project.subtitle}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
