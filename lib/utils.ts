import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconByName(iconName: string) {
  if (!iconName) return LucideIcons.HelpCircle;
  
  // Convert kebab-case to PascalCase (e.g., "folder-open" -> "FolderOpen")
  const pascalCaseName = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return (LucideIcons as any)[pascalCaseName] || LucideIcons.HelpCircle;
}
