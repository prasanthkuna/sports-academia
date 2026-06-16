/** Serializable icon keys — safe to pass from Server to Client Components. */
export type AppIconName =
  | "home"
  | "users"
  | "attendance"
  | "fees"
  | "more"
  | "userPlus"
  | "batches"
  | "receipt"
  | "reports"
  | "settings";

export type AppLinkItem = {
  href: string;
  label: string;
  icon: AppIconName;
};
