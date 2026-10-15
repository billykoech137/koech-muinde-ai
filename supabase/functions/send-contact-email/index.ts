import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
  timezone?: string;
  language?: string;
  pageUrl?: string;
  referrer?: string;
}

interface GeoInfo {
  city?: string;
  region?: string;
  country?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// The first address in x-forwarded-for is the original client
const getClientIp = (req: Request): string | null => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip");
};

// Best-effort IP geolocation; never blocks the email from being sent
const lookupGeo = async (ip: string | null): Promise<GeoInfo> => {
  if (!ip) return {};
  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return {};
    const data = await res.json();
    if (data.error) return {};
    return {
      city: data.city || undefined,
      region: data.region || undefined,
      country: data.country_name || undefined,
    };
  } catch (error) {
    console.error("Geolocation lookup failed:", error);
    return {};
  }
};

const detailRow = (label: string, value?: string | null) =>
  `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top;"><strong>${label}</strong></td><td style="padding:4px 0;">${
    value ? escapeHtml(value) : '<span style="color:#999;">Unknown</span>'
  }</td></tr>`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, timezone, language, pageUrl, referrer }: ContactEmailRequest =
      await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    console.log("Sending contact form email for:", email);

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const ip = getClientIp(req);
    const geo = await lookupGeo(ip);
    const userAgent = req.headers.get("user-agent");
    const submittedAt = new Date().toLocaleString("en-GB", {
      timeZone: "Africa/Nairobi",
      dateStyle: "full",
      timeStyle: "short",
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const locationSummary = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");

    // Send notification email to company
    const notificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "AI Analytics <onboarding@resend.dev>",
        to: ["info@edgepointinsights.com"],
        reply_to: email,
        subject: `New Contact Form Submission from ${name}${geo.country ? ` (${geo.country})` : ""}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse:collapse;">
            ${detailRow("Name", name)}
            <tr><td style="padding:4px 12px 4px 0;color:#666;"><strong>Email</strong></td><td style="padding:4px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            ${detailRow("Submitted", `${submittedAt} (EAT)`)}
          </table>
          <h3>Message</h3>
          <p style="white-space:normal;">${safeMessage}</p>
          <h3>Visitor details</h3>
          <table style="border-collapse:collapse;">
            ${detailRow("Location", locationSummary)}
            ${detailRow("Country", geo.country)}
            ${detailRow("Region", geo.region)}
            ${detailRow("City", geo.city)}
            ${detailRow("Timezone", timezone)}
            ${detailRow("Language", language)}
            ${detailRow("IP address", ip)}
            ${detailRow("Page", pageUrl)}
            ${detailRow("Referrer", referrer)}
            ${detailRow("Browser", userAgent)}
          </table>
          <p style="color:#999;font-size:12px;">Location is estimated from the visitor's IP address and may be approximate (VPNs and mobile networks can affect accuracy).</p>
        `,
      }),
    });

    if (!notificationResponse.ok) {
      const error = await notificationResponse.text();
      console.error("Failed to send notification email:", error);
      throw new Error("Failed to send company notification email");
    }

    // Send confirmation email to user (best effort; the company email already went out)
    const confirmationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "AI Analytics <onboarding@resend.dev>",
        to: [email],
        subject: "We received your message!",
        html: `
          <h1>Thank you for contacting us, ${safeName}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p>${safeMessage}</p>
          <br>
          <p>Best regards,<br>The AI Analytics Team</p>
        `,
      }),
    });

    if (!confirmationResponse.ok) {
      const error = await confirmationResponse.text();
      console.error("Failed to send confirmation email:", error);
    } else {
      console.log("Emails sent successfully");
    }

    return new Response(
      JSON.stringify({
        success: true,
        confirmationSent: confirmationResponse.ok,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
