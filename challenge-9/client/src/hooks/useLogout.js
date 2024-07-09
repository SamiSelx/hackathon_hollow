"use client";

import useUser from "./useUser";


export default function useLogout() {
  const {setUser} = useUser()
  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    location.pathname = '/login'
  }
  return logout;
}
