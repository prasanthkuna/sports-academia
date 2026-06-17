"use server";

import { revalidatePath } from "next/cache";
import { isValidAcademySlug } from "@/lib/academy-slug";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function signUpAndProvisionAcademy(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ownerName = String(formData.get("owner_name") ?? "").trim();
  const academyName = String(formData.get("academy_name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const sportName = String(formData.get("sport_name") ?? "Cricket").trim();

  if (!email || !password) throw new Error("Email and password are required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  if (!academyName || academyName.length < 2) throw new Error("Academy name is required");
  if (!isValidAcademySlug(slug)) {
    throw new Error("Academy URL must be at least 3 characters (letters, numbers, hyphens)");
  }

  const supabase = await createClient();

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: ownerName ? { data: { display_name: ownerName } } : undefined,
  });

  if (signUpError) throw new Error(signUpError.message);
  if (!authData.user) throw new Error("Sign up failed");

  let sessionUser = authData.user;
  const {
    data: { user: verifiedUser },
  } = await supabase.auth.getUser();

  if (verifiedUser) {
    sessionUser = verifiedUser;
  } else {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      throw new Error(
        "Account may already exist. Try signing in, or confirm your email if verification is required.",
      );
    }
    const {
      data: { user: signedInUser },
    } = await supabase.auth.getUser();
    if (!signedInUser) throw new Error("Could not start session after sign up");
    sessionUser = signedInUser;
  }

  const { data: academyId, error } = await supabase.rpc("provision_academy", {
    p_user_id: sessionUser.id,
    p_owner_name: ownerName,
    p_academy_name: academyName,
    p_slug: slug,
    p_sport_name: sportName || "Cricket",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  return { academyId: academyId as string };
}

export async function provisionAcademy(formData: FormData) {
  const user = await getSessionUser();
  if (!user) throw new Error("Not signed in");

  const ownerName = String(formData.get("owner_name") ?? "").trim();
  const academyName = String(formData.get("academy_name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const sportName = String(formData.get("sport_name") ?? "Cricket").trim();

  if (!academyName || academyName.length < 2) {
    throw new Error("Academy name is required");
  }
  if (!isValidAcademySlug(slug)) {
    throw new Error("Academy URL must be at least 3 characters (letters, numbers, hyphens)");
  }

  const supabase = await createClient();
  const { data: academyId, error } = await supabase.rpc("provision_academy", {
    p_user_id: user.id,
    p_owner_name: ownerName,
    p_academy_name: academyName,
    p_slug: slug,
    p_sport_name: sportName || "Cricket",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  return { academyId: academyId as string };
}

export async function completeOnboarding() {
  const user = await getSessionUser();
  if (!user) throw new Error("Not signed in");

  const supabase = await createClient();
  const { data: academyUser } = await supabase
    .from("academy_users")
    .select("academy_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!academyUser) throw new Error("No academy found");

  const { error } = await supabase.rpc("complete_academy_onboarding", {
    p_academy_id: academyUser.academy_id,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function checkSlugAvailable(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!isValidAcademySlug(normalized)) {
    return { available: false, reason: "invalid" as const };
  }

  const supabase = await createClient();
  const { data: available, error } = await supabase.rpc("check_slug_available", {
    p_slug: normalized,
  });
  if (error) throw error;

  return { available: !!available, reason: available ? null : ("taken" as const) };
}
