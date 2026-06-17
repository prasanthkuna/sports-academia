import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { buildAuthRoutingState, resolvePostAuthPath } from "@/lib/auth-routing";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuth = !!user;
  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith("/login");
  const isSignup = path.startsWith("/signup");
  const isAuthPage = isLogin || isSignup;
  const isOnboarding = path.startsWith("/onboarding");
  const isUpgrade = path.startsWith("/upgrade");
  const isPublic =
    path === "/" ||
    path.startsWith("/a/") ||
    path.startsWith("/verify/") ||
    path.startsWith("/api/import-template") ||
    path.startsWith("/api/razorpay/webhook");

  if (!isAuth && !isLogin && !isSignup && !isPublic && !isOnboarding && !isUpgrade) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!isAuth) {
    return supabaseResponse;
  }

  await supabase.rpc("expire_overdue_trials");

  const { data: academyUser } = await supabase
    .from("academy_users")
    .select(
      "academy_id, academies(subscription_status, trial_ends_at, onboarding_completed_at)",
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const routing = buildAuthRoutingState(
    academyUser as {
      academies: {
        subscription_status: "trial" | "active" | "expired";
        trial_ends_at: string | null;
        onboarding_completed_at: string | null;
      } | null;
    } | null,
  );

  if (isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = resolvePostAuthPath(routing);
    return NextResponse.redirect(url);
  }

  if (!routing.hasAcademy && !isOnboarding) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (routing.hasAcademy && routing.subscriptionExpired && !isUpgrade) {
    const url = request.nextUrl.clone();
    url.pathname = "/upgrade";
    return NextResponse.redirect(url);
  }

  if (routing.hasAcademy && !routing.onboardingComplete && !isOnboarding && !isUpgrade) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (isOnboarding && routing.hasAcademy && routing.onboardingComplete && !routing.subscriptionExpired) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isUpgrade && routing.hasAcademy && !routing.subscriptionExpired) {
    const url = request.nextUrl.clone();
    url.pathname = path.startsWith("/upgrade/success") ? path : "/dashboard";
    if (!path.startsWith("/upgrade/success")) {
      return NextResponse.redirect(url);
    }
  }

  if (path === "/" && isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = resolvePostAuthPath(routing);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
