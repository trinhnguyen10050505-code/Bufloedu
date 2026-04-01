import StatCard from "../../../components/StatCard";

export default function TeacherDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard giáo viên</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Số lớp" value="3" />
        <StatCard label="Số học sinh" value="95" />
        <StatCard label="Bài đã giao" value="12" />
        <StatCard label="Tỷ lệ hoàn thành" value="81%" />
      </div>
    </div>
  );
}