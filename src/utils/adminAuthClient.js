import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
//const service_role_key =	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdWZudnJiZXV0aHN3c2RuYm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MzE1NjgxNSwiZXhwIjoxOTg4NzMyODE1fQ.aR55KhPjRFURsWZyfw7ehnooQhKsLft6jiO2KH-OJxA";
const service_role_key = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

//const supabaseUrl = "https://zrhdlsieufyewaxtvbaa.supabase.co";
//const service_role_key =
//	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaGRsc2lldWZ5ZXdheHR2YmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NjI0NDkwNywiZXhwIjoxOTkxODIwOTA3fQ.wA4-ZzUKm73F_AXSfmsHavip9cvehD6M_eOzpiF2Xkw";

const supabase = createClient(supabaseUrl, service_role_key, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

// Access auth admin api
export const adminAuthClient = supabase.auth.admin;
