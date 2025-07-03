// app/perps/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Perps } from "../components/perps";
import Loader from "../components/Loader";

export default function PerpsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Loader />;
  }

  if (!session?.user) {
    router.push("/");
    return null;
  }

  return <Perps />;
}
