"use client";

import {
  ClipboardCheck,
  ClipboardList,
  FileSpreadsheet,
  Home,
  IndianRupee,
  LayoutGrid,
  Receipt,
  Settings,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AppIconName } from "@/lib/app-icons";

const appIconMap: Record<AppIconName, LucideIcon> = {
  home: Home,
  users: Users,
  attendance: ClipboardCheck,
  fees: IndianRupee,
  more: LayoutGrid,
  userPlus: UserPlus,
  batches: ClipboardList,
  receipt: Receipt,
  reports: FileSpreadsheet,
  settings: Settings,
};

export function AppIcon({ name, className }: { name: AppIconName; className?: string }) {
  const Icon = appIconMap[name];
  return <Icon className={className} />;
}
