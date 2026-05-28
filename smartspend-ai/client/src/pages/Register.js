import { useState } from "react";
import { FiArrowRight, FiCreditCard } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="glass-card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
          <FiCreditCard className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-cyan-300">Start your workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-white light:text-slate-950">Create account</h1>
        <p className="mb-6 mt-2 text-sm text-slate-400">Your transactions, insights, and budgets stay tied to your secure profile.</p>

        {error && <p className="mb-4 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}

        <div className="space-y-3">
          <input className="form-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="form-input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="form-input" placeholder="Password" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button className="btn-primary mt-5 w-full" disabled={loading}>
          {loading ? "Creating" : "Create account"}
          <FiArrowRight />
        </button>
        <p className="mt-5 text-center text-sm text-slate-400">
          Already registered? <Link className="font-medium text-cyan-300" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
