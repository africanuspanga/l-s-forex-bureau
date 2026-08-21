import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { ContactMessage } from "./types";

const MESSAGES_PATH = path.join(process.cwd(), "data", "contact-messages.json");

export interface StoredContactMessage extends ContactMessage {
  submittedAt: string; // ISO timestamp
}

let writeQueue: Promise<void> = Promise.resolve();

async function readMessages(): Promise<StoredContactMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredContactMessage[]) : [];
  } catch {
    // Missing or unreadable file is treated as an empty list
    return [];
  }
}

/**
 * Append a validated contact message to data/contact-messages.json,
 * stamping it with the current ISO timestamp. Creates the file with an
 * empty array first if it does not exist yet.
 */
export function saveContactMessage(
  message: ContactMessage
): Promise<StoredContactMessage> {
  const entry: StoredContactMessage = {
    ...message,
    submittedAt: new Date().toISOString(),
  };
  writeQueue = writeQueue.then(
    async () => {
      const messages = await readMessages();
      messages.push(entry);
      await fs.mkdir(path.dirname(MESSAGES_PATH), { recursive: true });
      await fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
    },
    async () => {
      // previous write failed — retry this one on a fresh queue
      writeQueue = Promise.resolve();
      await saveContactMessage(message);
    }
  );
  return writeQueue.then(() => entry);
}

export async function getContactMessages(): Promise<StoredContactMessage[]> {
  return readMessages();
}
