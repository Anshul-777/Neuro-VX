import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  LogOut,
  Shield,
  Bell,
  HelpCircle,
  FileText,
  Trash2,
  Globe,
  Lock,
  Fingerprint,
  Info,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { reset } = useAnalysis();
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("nvx_current_user");
    reset();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    const currentUser = localStorage.getItem("nvx_current_user");
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("nvx_users") || "{}");
    delete users[currentUser];
    localStorage.setItem("nvx_users", JSON.stringify(users));

    // Clean up related data
    const keysToClean = ["nvx_credentials", "nvx_face_profiles", "nvx_bio_methods", "nvx_avatars"];
    keysToClean.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      delete data[currentUser];
      localStorage.setItem(key, JSON.stringify(data));
    });

    localStorage.removeItem("nvx_current_user");
    localStorage.removeItem("nvx_test_history");
    reset();
    navigate("/");
  };

  const sections = [
    {
      title: "General",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Receive alerts for analysis results and health updates",
          action: (
            <button onClick={() => setNotifications(!notifications)} className="text-primary">
              {notifications ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
            </button>
          ),
        },
        {
          icon: Globe,
          label: "Language",
          description: "English (US)",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: Shield,
          label: "Data Privacy",
          description: "Manage how your health data is stored and processed",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
        {
          icon: Lock,
          label: "Change Password",
          description: "Update your account password",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
        {
          icon: Fingerprint,
          label: "Biometric Settings",
          description: "Manage fingerprint and face scan enrollment",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
        {
          icon: ToggleLeft,
          label: "Data Sharing",
          description: "Share anonymized data for research improvements",
          action: (
            <button onClick={() => setDataSharing(!dataSharing)} className="text-primary">
              {dataSharing ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
            </button>
          ),
        },
      ],
    },
    {
      title: "Data Management",
      items: [
        {
          icon: FileText,
          label: "Export Data",
          description: "Download all your health analysis data as a file",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
        {
          icon: Trash2,
          label: "Clear History",
          description: "Remove all past test records and analysis data",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
          onClick: () => {
            localStorage.removeItem("nvx_test_history");
            window.location.reload();
          },
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & FAQ",
          description: "Common questions and troubleshooting guides",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
        {
          icon: Info,
          label: "About Neuro-Vitals",
          description: "Version 1.0.0 — AI-powered biometric health platform",
          action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/account")}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {sections.map((section, sIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sIdx * 0.1 }}
            className="mb-8"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="rounded-xl border border-border/50 bg-card divide-y divide-border/50">
              {section.items.map((item, iIdx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: sIdx * 0.1 + iIdx * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={(item as any).onClick}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  {item.action}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider mb-3">
            Danger Zone
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full p-4 rounded-xl border border-border/50 bg-card hover:border-destructive/30 hover:bg-destructive/5 transition-all flex items-center gap-4"
            >
              <LogOut className="h-5 w-5 text-destructive" />
              <div className="text-left">
                <p className="text-sm font-semibold text-destructive">Log Out</p>
                <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
              </div>
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full p-4 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-all flex items-center gap-4"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data</p>
                </div>
              </button>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 rounded-xl border border-destructive/50 bg-destructive/10"
              >
                <p className="text-sm text-destructive font-medium mb-4">
                  Are you sure? This action cannot be undone. All your data including test history, biometric profiles, and account information will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
                  >
                    Delete Forever
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
