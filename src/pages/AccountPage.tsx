import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UserCircle,
  Mail,
  Phone,
  Calendar,
  Lock,
  Camera,
  Sun,
  Moon,
  Monitor,
  Activity,
  Settings,
} from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

const AccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [testCount, setTestCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("nvx_current_user");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const users = JSON.parse(localStorage.getItem("nvx_users") || "{}");
    setUser(users[currentUser] || null);

    // Load avatar
    const avatars = JSON.parse(localStorage.getItem("nvx_avatars") || "{}");
    setAvatarUrl(avatars[currentUser] || null);

    // Load theme
    const savedTheme = (localStorage.getItem("nvx_theme") as ThemeMode) || "light";
    setTheme(savedTheme);

    // Load test count
    const history = JSON.parse(localStorage.getItem("nvx_test_history") || "[]");
    setTestCount(history.length || 4); // default demo count
  }, [navigate]);

  const applyTheme = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("nvx_theme", mode);
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarUrl(url);
      const currentUser = localStorage.getItem("nvx_current_user") || "";
      const avatars = JSON.parse(localStorage.getItem("nvx_avatars") || "{}");
      avatars[currentUser] = url;
      localStorage.setItem("nvx_avatars", JSON.stringify(avatars));
    };
    reader.readAsDataURL(file);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "—";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 4) return "••••••••••";
    return "••••••" + phone.slice(-4);
  };

  if (!user) return null;

  const infoItems = [
    { icon: UserCircle, label: "Full Name", value: user.fullName },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: maskPhone(user.phone) },
    { icon: Calendar, label: "Age", value: `${calculateAge(user.dob)} years` },
    { icon: Lock, label: "Password", value: "••••••••" },
  ];

  const themeOptions: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
    { mode: "light", icon: Sun, label: "Light" },
    { mode: "dark", icon: Moon, label: "Dark" },
    { mode: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Account</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="h-12 w-12 text-primary" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-4">{user.fullName}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Personal Information</h3>
          <div className="rounded-xl border border-border/50 bg-card divide-y divide-border/50">
            {infoItems.map(({ icon: Icon, label, value }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                className="flex items-center gap-4 px-5 py-4"
              >
                <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => applyTheme(mode)}
                className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                  theme === mode
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:border-border"
                }`}
              >
                <Icon className="h-5 w-5 mx-auto mb-2" />
                <p className="text-sm font-medium">{label}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Statistics</h3>
          <div className="rounded-xl border border-border/50 bg-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{testCount}</p>
              <p className="text-sm text-muted-foreground">Total Tests Taken</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            onClick={() => navigate("/settings")}
            className="w-full p-5 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-all flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Settings className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Settings</p>
              <p className="text-xs text-muted-foreground">Privacy, notifications, data management & more</p>
            </div>
            <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default AccountPage;
