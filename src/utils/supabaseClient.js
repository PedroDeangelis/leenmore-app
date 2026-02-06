import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

//const supabaseUrl = "https://zrhdlsieufyewaxtvbaa.supabase.co";
//const supabaseKey =
//	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaGRsc2lldWZ5ZXdheHR2YmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYyNDQ5MDcsImV4cCI6MTk5MTgyMDkwN30.1s2rWFn9DXw-sZbOfPECqKoBuPPjLg8RcgLkVlhQlh0";

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
