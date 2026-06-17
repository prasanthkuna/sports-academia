import type { AcademyPlan } from "@/lib/plans";
import type { UserRole } from "@/types";

export type AppModule =
  | "dashboard"
  | "students"
  | "attendance"
  | "fees"
  | "fee_plans"
  | "renewals"
  | "leads"
  | "batches"
  | "receipts"
  | "reports"
  | "settings"
  | "team"
  | "import"
  | "id_cards"
  | "audit"
  | "reminders"
  | "whatsapp";

/** Owner + legacy admin — full academy configuration. */
const ACADEMY_MANAGER_ROLES: UserRole[] = ["owner", "admin"];

/** Owner, admin, or staff — day-to-day fee and attendance ops. */
const OPS_ROLES: UserRole[] = ["owner", "admin", "staff"];

const ROLE_ACCESS: Record<AppModule, UserRole[]> = {
  dashboard: ["admin", "staff", "coach", "owner"],
  students: ["admin", "staff", "coach", "owner"],
  attendance: ["admin", "staff", "coach", "owner"],
  fees: OPS_ROLES,
  fee_plans: OPS_ROLES,
  renewals: OPS_ROLES,
  leads: OPS_ROLES,
  batches: ["admin", "staff", "coach", "owner"],
  receipts: OPS_ROLES,
  reports: OPS_ROLES,
  settings: ACADEMY_MANAGER_ROLES,
  team: ACADEMY_MANAGER_ROLES,
  import: ACADEMY_MANAGER_ROLES,
  id_cards: OPS_ROLES,
  audit: ACADEMY_MANAGER_ROLES,
  reminders: OPS_ROLES,
  whatsapp: ["admin", "staff", "coach", "owner"],
};

export function canAccess(role: UserRole, module: AppModule) {
  return ROLE_ACCESS[module].includes(role);
}

export function canViewRenewals(role: UserRole) {
  return canAccess(role, "renewals");
}

export function canManageFeePlans(role: UserRole) {
  return OPS_ROLES.includes(role);
}

export function canMutateFees(role: UserRole) {
  return OPS_ROLES.includes(role);
}

/** Settings, team, import, QR regen — owner is the academy principal. */
export function canManageTeam(role: UserRole) {
  return ACADEMY_MANAGER_ROLES.includes(role);
}

export function canViewOwnerDigest(role: UserRole) {
  return ACADEMY_MANAGER_ROLES.includes(role);
}

export function canExport(role: UserRole, plan: AcademyPlan) {
  return ACADEMY_MANAGER_ROLES.includes(role) && plan === "pro";
}

export function navItemsForRole(role: UserRole) {
  const base = [
    { href: "/dashboard", label: "Dashboard", module: "dashboard" as const },
    { href: "/students", label: "Students", module: "students" as const },
    { href: "/attendance", label: "Attendance", module: "attendance" as const },
  ];
  const renewals = { href: "/renewals", label: "Renewals", module: "renewals" as const };
  const fees = { href: "/fees", label: "Fees", module: "fees" as const };
  const more = { href: "/more", label: "More", module: "dashboard" as const };

  if (role === "coach") return [...base, more];
  return [...base, renewals, fees, more];
}
