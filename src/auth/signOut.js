import supabase from "../utils/supabaseClient";

const signOut = async () => {
	let { error } = await supabase.auth.signOut();

	return error;
};

export default signOut;
