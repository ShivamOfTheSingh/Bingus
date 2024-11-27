"use server"
import Heartbeat from '@/components/Heartbeat';
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

export default async function HeartbeatWrapper() {
  const userId = await getCurrentSessionUserId();

  return <Heartbeat userId={userId} />;
}
