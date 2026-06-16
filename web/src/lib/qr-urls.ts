import { siteConfig } from "@/lib/site-config";

export function studentCheckInUrl(slug: string, qrToken: string) {
  return `${siteConfig.appUrl}/a/${slug}/check-in/${qrToken}`;
}

export function batchKioskUrl(slug: string, batchId: string) {
  return `${siteConfig.appUrl}/a/${slug}/kiosk/${batchId}`;
}

export function trialCheckInUrl(slug: string, token: string) {
  return `${siteConfig.appUrl}/a/${slug}/trial/${token}`;
}

export function receiptVerifyUrl(token: string) {
  return `${siteConfig.appUrl}/verify/receipt/${token}`;
}

export function coachAttendanceUrl(batchId: string) {
  return `/attendance?batch=${batchId}`;
}
