import supabase from "../utils/supabase";

export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to sign up: ${error.message}`);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to sign in: ${error.message}`);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to sign out: ${error.message}`);
  }

  return error;
}

export async function forgotPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to reset password: ${error.message}`);
  }

  return data;
}
