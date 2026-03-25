const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PORT = Number(process.env.PORT) || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
const DEMO_FALLBACK = (process.env.DEMO_FALLBACK || "true").toLowerCase() !== "false";

const SYSTEM_PROMPT = `My Smart Dog.
Rules:
- Always respond in a helpful, clear, and natural way.
- Keep context of the conversation and answer based on previous messages.
- If the user asks a follow-up question, continue the conversation logically.
- If the user asks for code, provide clean and working examples.
- If the user asks for explanation, explain step by step.
- Do NOT repeat previous answers unless necessary.
- Keep responses concise but informative.
- Use markdown formatting when needed.`;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  const filePath = req.url === "/" ? "/public/index.html" : req.url;
  const safePath = path.normalize(filePath).replace(/^(\.\.(\\|\/|$))+/, "");
  const absPath = path.join(__dirname, safePath);

  fs.readFile(absPath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(absPath);
    const types = {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8"
    };

    res.writeHead(200, { "Content-Type": types[ext] || "text/plain; charset=utf-8" });
    res.end(content);
  });
}

async function callGemini(messages) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: SYSTEM_PROMPT
          }]
        },
        contents: messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{
            text: msg.content
          }]
        })),
        generationConfig: {
          temperature: 0.4,
          max_output_tokens: 384
        }
      })
    }
  );

  const detail = await response.text();

  if (!response.ok) {
    const error = new Error(`Gemini error: ${response.status} ${detail}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }

  let data;
  try {
    data = JSON.parse(detail);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function buildFallbackReply(messages, reason) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.trim() || "";

  if (!lastUser) {
    return "I can still help while the cloud model is temporarily unavailable. Ask me anything.";
  }

  if (/^(hi|hello|hey|yo)\b/i.test(lastUser)) {
    return "Hi! I can help right now in local fallback mode while the cloud quota resets.";
  }

  if (/\boop\b|object\s*oriented/i.test(lastUser)) {
    return "OOP (Object-Oriented Programming) organizes code into objects that combine data and behavior. Core ideas are encapsulation, inheritance, polymorphism, and abstraction.";
  }

  return `I am temporarily using local fallback because cloud quota is exhausted (${reason}). Here is your message captured: ${lastUser}`;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Body too large"));
      }
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    let sanitized = [];
    try {
      const payload = await parseBody(req);
      const messages = Array.isArray(payload.messages) ? payload.messages : [];

      sanitized = messages
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({ role: m.role, content: m.content }));

      if (sanitized.length === 0) {
        return sendJson(res, 400, { error: "messages must be a non-empty array" });
      }

      const reply = await callGemini(sanitized);
      return sendJson(res, 200, { reply });
    } catch (error) {
      const message = error.message || "Unknown server error";
      const isQuota = message.includes("RESOURCE_EXHAUSTED") || message.includes("quota") || error.status === 429;

      if (isQuota && DEMO_FALLBACK) {
        const reply = buildFallbackReply(sanitized, "quota exceeded");
        return sendJson(res, 200, {
          reply,
          meta: {
            fallback: true,
            reason: "gemini_quota_exceeded"
          }
        });
      }

      return sendJson(res, error.status || 500, { error: message });
    }
  }

  if (req.method === "GET") {
    return serveStatic(req, res);
  }

  sendJson(res, 405, { error: "Method not allowed" });
});

function startServer(preferredPort, maxRetries = 20) {
  let currentPort = preferredPort;
  let retries = 0;

  const handleError = (error) => {
    if (error.code === "EADDRINUSE" && retries < maxRetries) {
      console.warn(`Port ${currentPort} is in use. Retrying on port ${currentPort + 1}...`);
      currentPort += 1;
      retries += 1;
      setTimeout(attemptListen, 100);
      return;
    }

    console.error("Server failed to start:", error.message || error);
    process.exit(1);
  };

  const attemptListen = () => {
    server.removeAllListeners("listening");
    server.once("error", handleError);
    server.listen(currentPort, () => {
      console.log(`Server running at http://localhost:${currentPort}`);
    });
  };

  attemptListen();
}

startServer(PORT);
