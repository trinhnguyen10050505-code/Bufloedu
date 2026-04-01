"use client";

import { useState } from "react";

export default function FocusRoomPage() {
  const [minutes, setMinutes] = useState(25);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Focus Room</h1>

      <div className="border rounded-2xl p-6 max-w-xl">
        <label className="block mb-3 font-medium">Chọn thời gian học</label>
        <select
          className="w-full border rounded-xl p-3 mb-4"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        >
          <option value={25}>25 phút</option>
          <option value={45}>45 phút</option>
          <option value={60}>60 phút</option>
        </select>

        <div className="text-4xl font-bold mb-4">{minutes}:00</div>

        <button className="px-5 py-3 bg-black text-white rounded-xl">
          Bắt đầu học
        </button>
      </div>
    </div>
  );
}