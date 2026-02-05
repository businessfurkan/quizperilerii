import { writeFile, mkdir } from "fs/promises";
import path from "path";

export interface UploadResult {
  url: string;
  originalName: string;
}

export interface StorageProvider {
  uploadFile(file: File): Promise<UploadResult>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
  }

  async uploadFile(file: File): Promise<UploadResult> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Sanitize filename
    const filename = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = path.join(this.uploadDir, filename);

    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${filename}`,
      originalName: file.name,
    };
  }
}

// Singleton instance for now, but easy to swap later
export const storageProvider: StorageProvider = new LocalStorageProvider();
