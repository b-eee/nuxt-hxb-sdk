import { createClient } from "@hexabase/hexabase-js";
import { useUser } from "~/store/user";
import {useRoute, useRouter} from "nuxt/app";

export const userService = {
  login,
  logout,
  register,
};

async function login(baseUrl: string, email: string, password: string) {
  let user = {} as any;
  const hexabase = await createClient({
    url: baseUrl,
    token: "",
    email,
    password,
  });

  const { token, error } = await hexabase.auth.login({ email, password });
  if (token && !error) {
    const { userInfo, error } = await hexabase.users.get(token);
    if (userInfo && !error) {
      user = userInfo;
      user.token = token;
    }
    localStorage.setItem("user", JSON.stringify(user));
  }
  return token;
}

async function logout() {
  localStorage.removeItem("user");
  useUser().removeAuth();
}

function register() {
  return { user: "nguyen" };
}
