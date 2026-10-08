export function ValidateRequiredText(Value: unknown, FieldLabel: string): string | null {
  if (typeof Value !== "string" || Value.trim().length === 0) {
    return `${FieldLabel} wajib diisi`;
  }
  return null;
}
