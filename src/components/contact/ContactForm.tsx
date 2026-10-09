"use client";

import { useState } from "react";

interface BranchOption {
  area: string;
}

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-xl bg-surface px-4 py-3 text-base text-foreground sm:text-sm ring-1 ring-primary/15 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary";

export default function ContactForm({ branches }: { branches: BranchOption[] }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredBranch, setPreferredBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!fullName.trim()) next.fullName = "Please enter your full name.";
    if (!phone.trim()) next.phone = "Please enter your phone number.";
    if (email.trim() && !EMAIL_RE.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (!subject.trim()) next.subject = "Please enter a subject.";
    if (!message.trim()) next.message = "Please enter your message.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("idle");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          preferredBranch: preferredBranch || undefined,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setFullName("");
      setPhone("");
      setEmail("");
      setPreferredBranch("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-7 sm:p-9">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Send Us a Message
      </h2>

      {status === "success" && (
        <p className="mt-5 rounded-xl bg-surface-alt px-4 py-3 text-sm font-medium text-primary">
          Thank you! Our team will get back to you.
        </p>
      )}
      {status === "error" && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Something went wrong. Please try again or call us on 0743 881 309.
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-foreground">
            Full name <span className="text-primary">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`mt-2 ${inputClass}`}
            disabled={submitting}
          />
          {errors.fullName && <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
            Phone <span className="text-primary">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`mt-2 ${inputClass}`}
            disabled={submitting}
          />
          {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${inputClass}`}
            disabled={submitting}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="preferredBranch" className="block text-sm font-semibold text-foreground">
            Preferred branch
          </label>
          <select
            id="preferredBranch"
            value={preferredBranch}
            onChange={(e) => setPreferredBranch(e.target.value)}
            className={`mt-2 ${inputClass}`}
            disabled={submitting}
          >
            <option value="">No preference</option>
            {branches.map((b) => (
              <option key={b.area} value={b.area}>
                {b.area}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="subject" className="block text-sm font-semibold text-foreground">
            Subject <span className="text-primary">*</span>
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`mt-2 ${inputClass}`}
            disabled={submitting}
          />
          {errors.subject && <p className="mt-1.5 text-xs text-red-600">{errors.subject}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-semibold text-foreground">
            Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`mt-2 ${inputClass}`}
            disabled={submitting}
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary mt-7 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Please do not include sensitive financial information in this form.
      </p>
    </form>
  );
}
