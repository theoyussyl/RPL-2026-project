import assert from "node:assert";
import { ValidateRequiredText } from "../src/lib/validation";

console.log("=== Verifikasi Fitur 1: Validasi CRUD Kebun & Tanaman ===");

assert.strictEqual(ValidateRequiredText("", "Nama kebun"), "Nama kebun wajib diisi");
console.log("[PASS] Nilai kosong ditolak dengan pesan yang benar");

assert.strictEqual(ValidateRequiredText("   ", "Nama tanaman"), "Nama tanaman wajib diisi");
console.log("[PASS] Nilai hanya spasi ditolak dengan pesan yang benar");

assert.strictEqual(ValidateRequiredText(undefined, "Nama kebun"), "Nama kebun wajib diisi");
console.log("[PASS] Nilai undefined ditolak dengan pesan yang benar");

assert.strictEqual(ValidateRequiredText("Kebun Belakang Rumah", "Nama kebun"), null);
console.log("[PASS] Nilai valid diterima (return null, tidak ada error)");

console.log("=== Semua assertion LULUS (4/4) ===");
