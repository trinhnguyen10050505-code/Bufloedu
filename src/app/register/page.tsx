"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      setMessage("Đăng ký thành công");
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("student");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Đăng ký</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-3"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border rounded-xl p-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Học sinh</option>
          <option value="teacher">Giáo viên</option>
        </select>

        <button className="w-full bg-black text-white rounded-xl p-3">
          Đăng ký
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </main>
  );
}