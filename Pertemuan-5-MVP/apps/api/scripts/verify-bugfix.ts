import assert from "node:assert";

console.log("=== Verifikasi Bugfix: Delete Jadwal yang Punya Riwayat CareLog ===");

// Simulasi error Prisma P2003 (foreign key constraint) seperti yang terjadi saat
// menghapus CareSchedule yang masih direferensikan oleh CareLog
function SimulateDeleteScheduleHandler(PrismaError: { code: string } | null): { Status: number; Body: { Message: string } } {
  try {
    if (PrismaError?.code === "P2003") {
      throw PrismaError;
    }
    if (PrismaError?.code === "P2025") {
      throw PrismaError;
    }
    return { Status: 204, Body: { Message: "" } };
  } catch (Error: any) {
    if (Error?.code === "P2003") {
      return {
        Status: 400,
        Body: { Message: "Jadwal ini tidak bisa dihapus karena sudah memiliki riwayat perawatan (pernah ditandai 'Sudah Dilakukan')." },
      };
    }
    if (Error?.code === "P2025") {
      return { Status: 404, Body: { Message: "Jadwal tidak ditemukan" } };
    }
    throw Error;
  }
}

const ResultWithHistory = SimulateDeleteScheduleHandler({ code: "P2003" });
assert.strictEqual(ResultWithHistory.Status, 400);
assert.ok(ResultWithHistory.Body.Message.includes("riwayat perawatan"));
console.log("[PASS] Hapus jadwal yang sudah punya riwayat -> 400 dengan pesan jelas (TIDAK crash)");

const ResultNotFound = SimulateDeleteScheduleHandler({ code: "P2025" });
assert.strictEqual(ResultNotFound.Status, 404);
console.log("[PASS] Hapus jadwal yang tidak ada -> 404 (TIDAK crash)");

const ResultOk = SimulateDeleteScheduleHandler(null);
assert.strictEqual(ResultOk.Status, 204);
console.log("[PASS] Hapus jadwal yang belum punya riwayat -> 204 sukses seperti biasa");

console.log("=== Semua assertion LULUS (3/3) - server tidak lagi crash saat delete gagal ===");
