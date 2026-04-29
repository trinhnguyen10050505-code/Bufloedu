"use client";

import { auth, db, storage } from "@/lib/firebase";

export default function FirebaseCheckPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-green-600">
          Firebase đã nối vào project
        </h1>

        <div className="mt-6 space-y-3 text-slate-700">
          <p>Auth: {auth ? "OK" : "Lỗi"}</p>
          <p>Firestore: {db ? "OK" : "Lỗi"}</p>
          <p>Storage: {storage ? "OK" : "Lỗi"}</p>
        </div>
      </div>
    </div>
  );
}