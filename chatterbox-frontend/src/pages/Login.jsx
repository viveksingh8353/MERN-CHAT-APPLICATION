import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/chatloginBG.jpg')" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg shadow-2xl p-8 rounded-xl w-full max-w-md animate-slide-up border border-white/20"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-white/20 text-white placeholder-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 rounded bg-white/20 text-white placeholder-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
