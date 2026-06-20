import { supabase } from "@/integrations/supabase/client";
import { generateShortCode, isValidAlias, normalizeUrl } from "./short-code";
import { getDeviceId } from "./device-id";

export type LinkRow = {
  id: string;
  short_code: string;
  original_url: string;
  custom_alias: boolean;
  clicks: number;
  created_at: string;
  expires_at: string | null;
  device_id: string;
};

export type ExpiryDays = 7 | 30 | 90 | null;

export async function isAliasAvailable(alias: string): Promise<boolean> {
  if (!isValidAlias(alias)) return false;
  const { data, error } = await supabase
    .from("links")
    .select("id")
    .eq("short_code", alias)
    .maybeSingle();
  if (error) return false;
  return !data;
}

export async function createLink(opts: {
  url: string;
  alias?: string;
  expiresInDays?: ExpiryDays;
}): Promise<LinkRow> {
  const normalized = normalizeUrl(opts.url);
  if (!normalized) throw new Error("Please enter a valid URL");

  let code = opts.alias?.trim() || "";
  const custom = !!code;
  if (custom) {
    if (!isValidAlias(code)) throw new Error("Alias must be 3-32 letters, numbers, _ or -");
    const free = await isAliasAvailable(code);
    if (!free) throw new Error("That alias is already taken");
  } else {
    // generate unique
    for (let i = 0; i < 5; i++) {
      const candidate = generateShortCode(6);
      // eslint-disable-next-line no-await-in-loop
      const free = await isAliasAvailable(candidate);
      if (free) {
        code = candidate;
        break;
      }
    }
    if (!code) throw new Error("Could not generate a unique code, try again");
  }

  const expires_at = opts.expiresInDays
    ? new Date(Date.now() + opts.expiresInDays * 86400_000).toISOString()
    : null;

  const { data, error } = await supabase
    .from("links")
    .insert({
      short_code: code,
      original_url: normalized,
      custom_alias: custom,
      expires_at,
      device_id: getDeviceId(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as LinkRow;
}

export async function listMyLinks(): Promise<LinkRow[]> {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("device_id", getDeviceId())
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as LinkRow[]) ?? [];
}

export async function deleteLink(id: string) {
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("device_id", getDeviceId());
  if (error) throw new Error(error.message);
}

export async function deleteAllMyLinks() {
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("device_id", getDeviceId());
  if (error) throw new Error(error.message);
}

export async function getLinkByCode(code: string): Promise<LinkRow | null> {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("short_code", code)
    .maybeSingle();
  if (error) return null;
  return (data as LinkRow) ?? null;
}

export async function incrementClick(id: string, currentClicks: number) {
  // Best-effort optimistic increment; not transactional but acceptable for free tool.
  await supabase.from("links").update({ clicks: currentClicks + 1 }).eq("id", id);
}

export async function getTotalLinkCount(): Promise<number> {
  const { count } = await supabase.from("links").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export function isExpired(link: LinkRow): boolean {
  return !!link.expires_at && new Date(link.expires_at).getTime() < Date.now();
}
