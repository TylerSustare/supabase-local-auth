import React, { useState } from "react";
import { supabase } from "./supabase";

enum Intent {
  None,
  SignIn,
  SignUp,
}

export default Auth;
export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const handleLogin = async (type: string, email: string, password: string) => {
    debugger;
    setLoading(type);
    const { error, user } =
      type === "LOGIN"
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (!error && !user) alert("Check your email for the login link!");
    if (error) alert(error.message);
    if (!user) setLoading("");
  };

  return (
    <div className={"App"}>
      <div style={styles.verticallySpaced}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </div>
      <div style={styles.verticallySpaced}>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </div>
      <div style={styles.verticallySpaced}>
        <button
          title="Sign in"
          disabled={!!loading.length}
          onClick={async () => await handleLogin("LOGIN", email, password)}
        >
          Sign In
        </button>
      </div>
      <div style={styles.verticallySpaced}>
        <button
          title="Sign up"
          disabled={!!loading.length}
          onClick={async () => await handleLogin("SIGNUP", email, password)}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 40,
    padding: 40,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
};
