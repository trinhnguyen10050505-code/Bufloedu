export default function TeacherAssignmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Giao bài tập</h1>

      <form className="max-w-xl space-y-4">
        <input className="w-full border rounded-xl p-3" placeholder="Tên bài giao" />
        <select className="w-full border rounded-xl p-3">
          <option>Lớp 9A1</option>
          <option>Lớp 9A2</option>
        </select>
        <textarea
          className="w-full border rounded-xl p-3"
          placeholder="Mô tả bài tập"
          rows={5}
        />
        <button className="px-5 py-3 bg-black text-white rounded-xl">
          Giao bài
        </button>
      </form>
    </div>
  );
}