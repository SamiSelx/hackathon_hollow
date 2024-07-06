import { useState } from "react";
import useRegister from "../../../hooks/useRegister";

export default function Register() {
  const [userRegistration, setUserRegistration] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { loading, error, register } = useRegister();

  const handleRegistre = (e) => {
    setUserRegistration({
      ...userRegistration,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    // if(!userRegistration.username || !userRegistration.email || !userRegistration.password) return
    register(userRegistration);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <input
          type="text"
          name="username"
          placeholder="Username..."
          value={userRegistration.username}
          onChange={handleRegistre}
          className="px-4 py-2 rounded-md border focus:ring outline-none border-blue-500"
        />
        <input
          type="text"
          name="email"
          placeholder="Email..."
          value={userRegistration.email}
          onChange={handleRegistre}
          className="px-4 py-2 rounded-md border focus:ring outline-none border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password..."
          value={userRegistration.password}
          onChange={handleRegistre}
          className="px-4 py-2 rounded-md border focus:ring outline-none border-blue-500"
        />
        <input
          type="submit"
          value={loading ? "sending" : "send"}
          disabled={loading}
          className="bg-blue-500 py-2 text-white font-semibold text-xl rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-500 uppercase"
        />
      </form>
      {error && (
        <div className="text-red-500 text-2xl font-semibold">{error}</div>
      )}
    </div>
  );
}
