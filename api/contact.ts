// Vercel serverless function: emails contact form submissions to the company inbox via Resend.
// Requires the RESEND_API_KEY environment variable to be set in the Vercel project settings.

const TO_EMAIL = "info@edgepointinsights.com";
const FROM_EMAIL = "Edge Point Website <onboarding@resend.dev>";

interface ContactRequest {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  timezone?: unknown;
  language?: unknown;
  pageUrl?: unknown;
  referrer?: unknown;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const asString = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const decodeHeader = (value: string | null) => {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const countryName = (code: string) => {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top;"><strong>${label}</strong></td><td style="padding:4px 0;">${
    value ? escapeHtml(value) : '<span style="color:#999;">Unknown</span>'
  }</td></tr>`;

export async function POST(request: Request): Promise<Response> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return json({ error: "Email service is not configured" }, 500);
  }

  let body: ContactRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const name = asString(body.name, 100);
  const email = asString(body.email, 255);
  const message = asString(body.message, 1000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Name, a valid email and a message are required" }, 400);
  }

  // Vercel adds these geolocation headers to every request
  const country = countryName(request.headers.get("x-vercel-ip-country") ?? "");
  const region = decodeHeader(request.headers.get("x-vercel-ip-country-region"));
  const city = decodeHeader(request.headers.get("x-vercel-ip-city"));
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const location = [city, region, country].filter(Boolean).join(", ");

  const submittedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Nairobi",
    dateStyle: "full",
    timeStyle: "short",
  });

  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `New Contact Form Submission from ${name}${country ? ` (${country})` : ""}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;">
          ${detailRow("Name", name)}
          <tr><td style="padding:4px 12px 4px 0;color:#666;"><strong>Email</strong></td><td style="padding:4px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
          ${detailRow("Submitted", `${submittedAt} (EAT)`)}
        </table>
        <h3>Message</h3>
        <p>${safeMessage}</p>
        <h3>Visitor details</h3>
        <table style="border-collapse:collapse;">
          ${detailRow("Location", location)}
          ${detailRow("Country", country)}
          ${detailRow("Region", region)}
          ${detailRow("City", city)}
          ${detailRow("Timezone", asString(body.timezone, 100))}
          ${detailRow("Language", asString(body.language, 50))}
          ${detailRow("IP address", ip)}
          ${detailRow("Page", asString(body.pageUrl, 500))}
          ${detailRow("Referrer", asString(body.referrer, 500))}
          ${detailRow("Browser", userAgent)}
        </table>
        <p style="color:#999;font-size:12px;">Location is estimated from the visitor's IP address and may be approximate (VPNs and mobile networks can affect accuracy).</p>
      `,
    }),
  });

  if (!resendResponse.ok) {
    console.error("Resend API error:", resendResponse.status, await resendResponse.text());
    return json({ error: "Failed to send email" }, 502);
  }

  return json({ success: true });
}
