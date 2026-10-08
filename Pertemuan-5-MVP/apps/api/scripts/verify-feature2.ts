import assert from "node:assert";
import { CalculateNextDueAt, DetermineCareStatus } from "../src/lib/careLogic";

console.log("=== Verifikasi Fitur 2: Jadwal Perawatan & Status Perawatan ===");

const From = new Date("2026-01-01T00:00:00Z");
const NextDue = CalculateNextDueAt(3, From);
assert.strictEqual(NextDue.toISOString().slice(0, 10), "2026-01-04");
console.log("[PASS] AC1 - NextDueAt dihitung otomatis (From + FrequencyDays): 2026-01-01 + 3 hari = 2026-01-04");

const Now = new Date("2026-01-10T00:00:00Z");

assert.strictEqual(DetermineCareStatus(null, Now), "NO_SCHEDULE");
console.log("[PASS] AC3 - Tanaman tanpa jadwal -> status NO_SCHEDULE");

assert.strictEqual(DetermineCareStatus(new Date("2026-01-09T00:00:00Z"), Now), "OVERDUE");
console.log("[PASS] AC3 - Jadwal yang sudah lewat (H-1) -> status OVERDUE");

assert.strictEqual(DetermineCareStatus(new Date("2026-01-11T00:00:00Z"), Now), "DUE_SOON");
console.log("[PASS] AC3 - Jadwal besok (dalam 2 hari) -> status DUE_SOON");

assert.strictEqual(DetermineCareStatus(new Date("2026-01-20T00:00:00Z"), Now), "OK");
console.log("[PASS] AC3 - Jadwal 10 hari lagi -> status OK");

console.log("=== Simulasi AC2: Tandai Sudah Dilakukan ===");
const DoneAt = new Date("2026-01-10T08:00:00Z");
const FrequencyDays = 3;
const RecalculatedNextDueAt = CalculateNextDueAt(FrequencyDays, DoneAt);
assert.strictEqual(RecalculatedNextDueAt.toISOString().slice(0, 10), "2026-01-13");
console.log("[PASS] AC2 - Setelah 'Tandai Sudah Dilakukan', NextDueAt dihitung ulang dari DoneAt + FrequencyDays");

console.log("=== Semua assertion LULUS (6/6) ===");
