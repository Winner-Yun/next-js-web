import { InviteAcceptPage } from "@/components/invite-page/invite-accept-page";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return <InviteAcceptPage code={code} />;
}
