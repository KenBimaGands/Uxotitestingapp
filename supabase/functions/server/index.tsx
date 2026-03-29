import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase clients
// Service role client for admin operations and token verification
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

console.log("=== SERVER INITIALIZATION ===");
console.log("Supabase URL:", Deno.env.get('SUPABASE_URL')?.substring(0, 30) + "...");
console.log("Service Role Key present:", !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-aba765bd/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug endpoint to check environment variables
app.get("/make-server-aba765bd/debug-env", (c) => {
  return c.json({
    hasServiceRole: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    hasAnonKey: !!Deno.env.get('SUPABASE_ANON_KEY'),
    hasUrl: !!Deno.env.get('SUPABASE_URL'),
    serverVersion: "2024-03-29-admin-auth-fix",
    timestamp: new Date().toISOString(),
  });
});

// Signup endpoint
app.post("/make-server-aba765bd/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      }
    });
  } catch (error) {
    console.log(`Signup exception: ${error}`);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Login endpoint (handled by Supabase client-side)
app.post("/make-server-aba765bd/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Login error: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "User",
      },
      access_token: data.session.access_token,
    });
  } catch (error) {
    console.log(`Login exception: ${error}`);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  
  console.log("=== SERVER AUTH MIDDLEWARE ===#");
  console.log("Path:", c.req.path);
  console.log("Method:", c.req.method);
  console.log("Auth header present:", !!authHeader);
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth error: No token provided or wrong format");
    return c.json({ code: 401, message: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received (first 50 chars):", token.substring(0, 50));
  console.log("Token length:", token.length);
  
  try {
    console.log("Attempting to verify token with admin client...");
    
    // Use admin client with explicit token - this is the recommended pattern for Edge Functions
    // The service role key is automatically injected by Supabase, no need for SUPABASE_ANON_KEY
    // See: https://supabase.com/docs/guides/functions/auth
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      console.log("=== SERVER AUTH FAILED ===");
      console.log("Error message:", error.message);
      console.log("Error name:", error.name);
      console.log("Error status:", error.status);
      return c.json({ code: 401, message: `Invalid JWT: ${error.message}` }, 401);
    }
    
    if (!data.user) {
      console.log("Auth error: No user found for token");
      return c.json({ code: 401, message: "Unauthorized - User not found" }, 401);
    }

    // Store user info in context
    c.set("userId", data.user.id);
    c.set("user", data.user);
    
    console.log("=== SERVER AUTH SUCCESS ===");
    console.log("User:", data.user.email);
    console.log("User ID:", data.user.id);
    
    await next();
  } catch (error) {
    console.log("=== SERVER AUTH EXCEPTION ===");
    console.log("Exception:", error);
    console.log("Exception type:", error.constructor.name);
    return c.json({ code: 401, message: "Unauthorized - Authentication failed" }, 401);
  }
};

// Get user's projects
app.get("/make-server-aba765bd/projects", requireAuth, async (c) => {
  try {
    const userId = c.get("userId");
    const projectsKey = `user:${userId}:projects`;
    
    const projects = await kv.get(projectsKey);
    
    return c.json({ projects: projects || [] });
  } catch (error) {
    console.log(`Get projects error: ${error}`);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Save user's projects
app.post("/make-server-aba765bd/projects", requireAuth, async (c) => {
  try {
    const userId = c.get("userId");
    const { projects } = await c.req.json();
    
    if (!Array.isArray(projects)) {
      return c.json({ error: "Projects must be an array" }, 400);
    }

    const projectsKey = `user:${userId}:projects`;
    await kv.set(projectsKey, projects);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Save projects error: ${error}`);
    return c.json({ error: "Failed to save projects" }, 500);
  }
});

// Get current user info
app.get("/make-server-aba765bd/me", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    
    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "User",
      }
    });
  } catch (error) {
    console.log(`Get user info error: ${error}`);
    return c.json({ error: "Failed to fetch user info" }, 500);
  }
});

Deno.serve(app.fetch);