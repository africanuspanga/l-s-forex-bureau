import { saveContactMessage } from "@/lib/messages";
import type { ContactMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 2000;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const fullName = asTrimmedString(data.fullName);
  const phone = asTrimmedString(data.phone);
  const email = asTrimmedString(data.email);
  const preferredBranch = asTrimmedString(data.preferredBranch);
  const subject = asTrimmedString(data.subject);
  const message = asTrimmedString(data.message);

  if (!fullName || !phone || !subject || !message) {
    return Response.json(
      { ok: false, error: "Name, phone, subject and message are required." },
      { status: 400 }
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }
  if (
    [fullName, phone, email, preferredBranch, subject, message].some(
      (v) => v.length > MAX_FIELD_LENGTH
    )
  ) {
    return Response.json(
      { ok: false, error: "One or more fields are too long." },
      { status: 400 }
    );
  }

  const contactMessage: ContactMessage = {
    fullName,
    phone,
    ...(email ? { email } : {}),
    ...(preferredBranch ? { preferredBranch } : {}),
    subject,
    message,
  };

  try {
    await saveContactMessage(contactMessage);
  } catch {
    return Response.json(
      { ok: false, error: "Unable to save your message right now. Please call us instead." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
