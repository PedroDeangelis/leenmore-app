import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const service_role_key = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, service_role_key, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

// Access auth admin api
export const adminAuthClient = supabase.auth.admin;
