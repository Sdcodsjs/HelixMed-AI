// Presidio Local Protected Health Information (PHI) De-identification & Scrubbing Utility

export function scrubPHI(text) {
  if (!text || typeof text !== "string") return text;

  // Regex patterns for local PHI scrubbing (SSN, Phone, Email, MRN, Names)
  let scrubbed = text
    .replace(/\b\d{3}\-\d{2}\-\d{4}\b/g, "[REDACTED_SSN]")
    .replace(/\b\d{3}[\-\.\s]?\d{3}[\-\.\s]?\d{4}\b/g, "[REDACTED_PHONE]")
    .replace(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g, "[REDACTED_EMAIL]")
    .replace(/\bMRN[\-:\s]?\d{6,10}\b/gi, "[REDACTED_MRN]");

  return scrubbed;
}

export function detectPHIFields(text) {
  if (!text || typeof text !== "string") return [];
  const detected = [];
  if (/\b\d{3}\-\d{2}\-\d{4}\b/.test(text)) detected.push("Social Security Number (SSN)");
  if (/\b\d{3}[\-\.\s]?\d{3}[\-\.\s]?\d{4}\b/.test(text)) detected.push("Phone Number");
  if (/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/.test(text)) detected.push("Email Address");
  if (/\bMRN[\-:\s]?\d{6,10}\b/i.test(text)) detected.push("Medical Record Number (MRN)");
  return detected;
}
