import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

const demoCredentials = {
  victim: { email: "user@demo.com", password: "demo1234" },
  staff: { email: "counsellor@demo.com", password: "demo1234" },
};

export default function Login({ onLogin }) {
  const [role, setRole] = useState("victim");
  const [email, setEmail] = useState(demoCredentials.victim.email);
  const [password, setPassword] = useState(demoCredentials.victim.password);
  const [error, setError] = useState("");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEmail(demoCredentials[newRole].email);
    setPassword(demoCredentials[newRole].password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-teal-400 mb-1">Manorakshak</h1>
        <p className="text-slate-400 text-xs mb-4">Welcome back</p>
                <p className="text-slate-400 text-sm mb-6">Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-300 block mb-1">I am a</label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
            >
              <option value="victim">user</option>
              <option value="staff">Counsellor / Authority</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" className="w-full">Login</Button>
        </form>

        <p className="text-slate-500 text-xs mt-4 text-center">
          Demo only — any email/password combination works.
        </p>
      </Card>
    </div>
  );
}