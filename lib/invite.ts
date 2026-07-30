export type JoinInviteResult =
  | { ok: true }
  | { ok: false; detail: string };

export async function joinWorkspaceInvite(
  code: string,
  accessToken: string,
): Promise<JoinInviteResult> {
  try {
    const res = await fetch(`/api/invite/join/${encodeURIComponent(code)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        ok: false,
        detail: data?.detail || "This invite link is invalid or has expired.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      detail: "Could not reach the server. Please try again.",
    };
  }
}
