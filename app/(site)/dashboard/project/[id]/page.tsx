"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params && params.id) {
      router.replace(`/dashboard/project/${params.id}/board`);
    }
  }, [params, router]);

  return null;
}
