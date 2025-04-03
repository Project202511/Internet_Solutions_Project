import { useState } from "react";
import axios from "axios";
//hello

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/${mode}`;
    try {
      const res = await axios.post(url, { username, password });
      alert(res.data.message || "Success");
      onLogin(username); // pass username to parent
    } catch (err) {
      alert(err.response.data.error || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => setMode("register")}
              className="text-blue-500 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already registered?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-blue-500 underline"
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
