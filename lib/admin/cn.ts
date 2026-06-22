export function clsx(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export type ClassValue = string | undefined | null | false;
