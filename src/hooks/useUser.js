import supabase from "../utils/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { adminAuthClient } from "../utils/adminAuthClient";

//Login
const isUserLoggedIn = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
};

export const useUserisLoggendIn = () => {
    return useQuery(["isUserLoggedIn"], isUserLoggedIn);
};

//Sign IN
const userLoginWithEmail = async ({ email, password }) => {
    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    return data.user;
};

export const useUserLogin = (email, password) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (email, password) => {
            return await userLoginWithEmail(email, password);
        },
        {
            onSuccess: (data) => {
                if (data?.id) {
                    queryClient.invalidateQueries("isUserLoggedIn");
                    queryClient.invalidateQueries("getUserMeta");
                }
                return data;
            },
        },
    );
};

//Get all users
const getAllUsers = async () => {
    let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("first_name", { ascending: true });

    return profiles;
};

export const useUserList = () => {
    return useQuery(["UserList"], getAllUsers);
};

//Get USer By id

const getUserByID = async ({ queryKey }) => {
    const id = queryKey[1];

    let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);

    return data[0];
};

export const useUser = (id) => {
    return useQuery(["user", id], getUserByID);
};

//Create new USer
const createNewUSer = async ({
    email,
    first_name,
    role,
    email_receiver,
    password,
    phone_number,
}) => {
    // Check if user already exists in profiles
    const { data: existingProfiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .limit(1);

    const existing = existingProfiles?.[0];

    if (existing) {
        if (existing.status === "deactivated") {
            // Reactivate existing user
            await adminAuthClient.updateUserById(existing.id, {
                password,
                user_metadata: { first_name, role },
            });

            const { data: user } = await supabase
                .from("profiles")
                .update({
                    first_name: first_name,
                    role: role,
                    phone_number: phone_number,
                    email_receiver: email_receiver,
                    email: email,
                    status: "active",
                })
                .eq("id", existing.id)
                .select();

            return user?.[0];
        }

        return existing;
    }

    // Create fresh user
    const { data, error } = await adminAuthClient.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { first_name: first_name, role: role },
    });

    const { data: user, error: userError } = await supabase
        .from("profiles")
        .update({
            first_name: first_name,
            role: role,
            phone_number: phone_number,
            email: email,
            email_receiver: email_receiver,
            status: "active",
        })
        .eq("id", data.user.id)
        .select();

    return user?.[0];
};

export const useUserNew = (
    email,
    first_name,
    role,
    email_receiver,
    password,
) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (email, first_name, role, email_receiver, password) => {
            return await createNewUSer(
                email,
                first_name,
                role,
                email_receiver,
                password,
            );
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("UserList");
                return data;
            },
        },
    );
};

//Update USer Password
const updateUserPassword = async ({ id, password }) => {
    const { data, error } = await adminAuthClient.updateUserById(id, {
        password: password,
    });

    return data;
};

export const useUserPasswordUpdate = (id, password) => {
    return useMutation(
        async (id, password) => {
            return await updateUserPassword(id, password);
        },
        {
            onSuccess: (data) => {
                return data;
            },
        },
    );
};

//Update user profile
const updateUserProfile = async ({
    id,
    first_name,
    role,
    phone_number,
    email_receiver,
}) => {
    if (first_name !== undefined || role !== undefined) {
        const userMetadata = {};

        if (first_name !== undefined) {
            userMetadata.first_name = first_name;
        }

        if (role !== undefined) {
            userMetadata.role = role;
        }

        const { error: authError } = await adminAuthClient.updateUserById(id, {
            user_metadata: userMetadata,
        });

        if (authError) {
            throw authError;
        }
    }

    const profileUpdates = {};

    if (first_name !== undefined) {
        profileUpdates.first_name = first_name;
    }

    if (phone_number !== undefined) {
        profileUpdates.phone_number = phone_number;
    }

    if (email_receiver !== undefined) {
        profileUpdates.email_receiver = email_receiver;
    }

    if (!Object.keys(profileUpdates).length) {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", id)
        .select();

    if (error) {
        throw error;
    }

    return data?.[0];
};

export const useUserProfileUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation(updateUserProfile, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries("UserList");
            queryClient.invalidateQueries(["user", variables.id]);
            return data;
        },
    });
};

//Update profile status
const updateUserStatus = async ({ id, status }) => {
    const { data, error } = await supabase
        .from("profiles")
        .update({ status: status })
        .eq("id", id);

    return data;
};

export const useUserStatusUpdate = (id, status) => {
    const queryClient = useQueryClient();
    return useMutation(
        async (id, status) => {
            return await updateUserStatus(id, status);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("UserList");
                queryClient.invalidateQueries("user");
                return data;
            },
        },
    );
};
