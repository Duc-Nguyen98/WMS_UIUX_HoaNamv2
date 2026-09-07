/** Keep the fallback explicit: a failed copy must never report success. */
export async function copyPreviewText(
  text: string,
  write: (text: string) => Promise<void> = (value) =>
    navigator.clipboard.writeText(value),
): Promise<boolean> {
  try {
    await write(text);
    return true;
  } catch {
    return false;
  }
}
