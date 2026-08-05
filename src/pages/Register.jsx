import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { Label, Input, Select } from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { MANDALS } from "../data/geography";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mandalId, setMandalId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    const result = await register({ name: name.trim(), phone: phone.trim(), password, mandalId: mandalId || null });
    if (!result.ok) return setError(result.error);
    navigate("/dashboard", { replace: true });
  };

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Register as a resident to report issues and get involved."
      footer={
        <>
          <span className="text-neutral-500">Already have an account? </span>
          <Link to="/login" className="font-semibold text-brand-red hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" required>Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="rphone" required>Phone Number</Label>
          <Input
            id="rphone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="mandal">Mandal (optional)</Label>
          <Select id="mandal" value={mandalId} onChange={(e) => setMandalId(e.target.value)}>
            <option value="">Select your Mandal</option>
            {MANDALS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="rpassword" required>Password</Label>
          <div className="relative">
            <Input
              id="rpassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-brand-red" role="alert">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-red py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red-dark"
        >
          Register
        </button>
      </form>
    </AuthShell>
  );
}
