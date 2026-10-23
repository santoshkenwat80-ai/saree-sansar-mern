import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import toast from "react-hot-toast";
export const AdminLogin = () => {
  const [email, setEmail] = useState("admin@sareesansar.com");
  const [password, setPassword] = useState("Admin@2026");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password, true);
    setIsLoading(false);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid administrative credentials");
    }
  };
  return <div className="min-h-screen bg-[#190409] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#6b1426] text-[#f2ce6e] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Saree Sansar Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Authorized administrative staff and store operators only
          </p>
        </div>

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <Input
    label="Admin Email"
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

          <Input
    label="Security Password"
    type="password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-amber-700" />
            <span>Pre-filled with master administrator demonstration credentials.</span>
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Authenticate &amp; Enter Console
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
    onClick={() => navigate("/")}
    className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
  >
            ← Return to Consumer Storefront
          </button>
        </div>
      </div>
    </div>;
};
