const supabase = {
  auth: {
    getSession: async () => {
      // Extract tokens from URL parameters instead
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      return {
        data: {
          session: accessToken
            ? {
                access_token: accessToken,
                refresh_token: refreshToken,
              }
            : null,
        },
      };
    },
    setSession: async (tokens: {
      access_token: string;
      refresh_token: string;
    }) => {
      // Store tokens temporarily for the reset password request
      sessionStorage.setItem("reset_tokens", JSON.stringify(tokens));
      return { error: null };
    },
  },
};

export default supabase;
