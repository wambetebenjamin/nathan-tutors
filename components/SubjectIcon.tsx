import {
  BookMarked,
  Briefcase,
  Calculator,
  Code2,
  FlaskConical,
  Globe2,
  GraduationCap,
  Languages,
  Pencil,
  Target,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  calculator: Calculator,
  flask: FlaskConical,
  languages: Languages,
  bookmark: BookMarked,
  globe: Globe2,
  briefcase: Briefcase,
  code: Code2,
  pencil: Pencil,
  target: Target,
  graduation: GraduationCap,
};

export function SubjectIcon({
  name,
  size = 30,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[name] ?? BookMarked;
  return <Icon size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
}
