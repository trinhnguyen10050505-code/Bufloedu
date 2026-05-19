"use client";

import { auth, db, storage } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function DebugFirebasePage() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    setInfo({
      apiKeyHead: auth.app.options.apiKey?.slice(0, 8),
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
      storageBucket: auth.app.options.storageBucket,
      appId: auth.app.options.appId,
      authReady: !!auth,
      firestoreReady: !!db,
      storageReady: !!storage,
    });
  }, []);

  return (
    <pre className="m-10 rounded-[24px] sm:rounded-3xl bg-white p-6 text-sm text-slate-800 shadow">
      {JSON.stringify(info, null, 2)}
    </pre>
  );
}