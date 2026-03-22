import { User, Bell, Palette, Globe, Lock, CreditCard, Shield, LogOut, Sparkles, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";

export function SettingsPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(tab || "profile");

  useEffect(() => {
    if (tab) {
      setActiveSection(tab);
    }
  }, [tab]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    navigate(`/settings/${sectionId}`);
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "domain", label: "Custom Domain", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          Settings
        </h1>
        <p className="text-white/60">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sticky top-24">
            <nav className="space-y-1">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
                      : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.label}</span>
                </motion.button>
              ))}
              <div className="pt-4 border-t border-white/[0.08] mt-4">
                <motion.button
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Log Out</span>
                </motion.button>
              </div>
            </nav>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeSection === "profile" && <ProfileSettings />}
          {activeSection === "notifications" && <NotificationSettings />}
          {activeSection === "appearance" && <AppearanceSettings />}
          {activeSection === "domain" && <DomainSettings />}
          {activeSection === "privacy" && <PrivacySettings />}
          {activeSection === "billing" && <BillingSettings />}
          {activeSection === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Profile Information</h2>
      
      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="text-white text-3xl font-semibold relative z-10">JD</span>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all text-sm font-medium mr-3"
            >
              Change Avatar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium border border-red-500/20"
            >
              Remove
            </motion.button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="john@example.com"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Bio
          </label>
          <textarea
            rows={4}
            defaultValue="Full-stack developer passionate about creating beautiful and functional web applications."
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Location
          </label>
          <input
            type="text"
            defaultValue="San Francisco, CA"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white transition-all font-semibold relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative z-10">Save Changes</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationSettings() {
  const notifications = [
    { title: "Email Notifications", description: "Receive email updates about your portfolio" },
    { title: "Portfolio Views", description: "Get notified when someone views your portfolio" },
    { title: "GitHub Sync", description: "Notifications about GitHub repository syncs" },
    { title: "Weekly Reports", description: "Receive weekly analytics reports" },
    { title: "Marketing Emails", description: "Receive tips, news, and updates" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Notification Preferences</h2>
      
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-4 border-b border-white/[0.05] last:border-0">
            <div>
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-sm text-white/50">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-white/[0.1] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500"></div>
            </label>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AppearanceSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Appearance</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-4">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Dark", active: true },
              { name: "Light", active: false },
              { name: "Auto", active: false }
            ].map((theme) => (
              <motion.button
                key={theme.name}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl transition-all ${
                  theme.active
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50"
                    : "bg-white/[0.03] border-2 border-white/[0.08] hover:border-white/[0.15]"
                }`}
              >
                <div className={`w-full h-20 rounded-lg mb-3 ${
                  theme.name === "Dark" ? "bg-gradient-to-br from-gray-900 to-gray-800" :
                  theme.name === "Light" ? "bg-gradient-to-br from-gray-100 to-gray-200" :
                  "bg-gradient-to-br from-gray-700 to-gray-300"
                }`}></div>
                <p className="text-sm font-medium text-white">{theme.name}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-4">
            Accent Color
          </label>
          <div className="flex gap-3">
            {[
              { color: "purple", gradient: "from-purple-500 to-pink-500" },
              { color: "blue", gradient: "from-blue-500 to-cyan-500" },
              { color: "green", gradient: "from-green-500 to-emerald-500" },
              { color: "orange", gradient: "from-orange-500 to-pink-500" },
              { color: "red", gradient: "from-red-500 to-pink-500" }
            ].map(({ color, gradient }) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} relative group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DomainSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Custom Domain</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Current Domain
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              defaultValue="johndoe.portfolioai.com"
              className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/50"
              disabled
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all font-medium"
            >
              Copy Link
            </motion.button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90" />
          <div className="relative p-6">
            <div className="flex items-start gap-3 mb-3">
              <Crown className="w-6 h-6 text-white" />
              <div>
                <p className="text-base font-semibold text-white mb-1">Upgrade to Pro</p>
                <p className="text-sm text-white/80">Connect your custom domain with our Pro plan</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/95 transition-all"
            >
              Upgrade Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PrivacySettings() {
  const privacyOptions = [
    { title: "Public Portfolio", description: "Make your portfolio visible to everyone" },
    { title: "Show GitHub Contributions", description: "Display your GitHub activity" },
    { title: "Show Contact Form", description: "Allow visitors to contact you" },
    { title: "Analytics Tracking", description: "Track portfolio views and interactions" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Privacy Settings</h2>
      
      <div className="space-y-4">
        {privacyOptions.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-4 border-b border-white/[0.05] last:border-0">
            <div>
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-sm text-white/50">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-white/[0.1] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500"></div>
            </label>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function BillingSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Current Plan</h2>
        
        <div className="relative overflow-hidden rounded-2xl mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90" />
          <div className="relative p-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white" />
              <p className="text-sm text-white/90 font-semibold uppercase tracking-wider">Free Plan</p>
            </div>
            <p className="text-4xl font-bold text-white mb-6">$0<span className="text-xl text-white/80">/month</span></p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/95 transition-all shadow-lg"
            >
              Upgrade to Pro
            </motion.button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
            <span className="text-sm text-white/60">AI Generations</span>
            <span className="text-sm font-medium text-white">10/month</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
            <span className="text-sm text-white/60">Custom Domain</span>
            <span className="text-sm font-medium text-white/40">Not available</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-white/60">Analytics</span>
            <span className="text-sm font-medium text-white">Basic</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SecuritySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Security</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Change Password
          </label>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white transition-all font-semibold relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative z-10">Update Password</span>
          </motion.button>
        </div>

        <div className="pt-6 border-t border-white/[0.08]">
          <h3 className="font-semibold text-white mb-2 tracking-tight">Two-Factor Authentication</h3>
          <p className="text-sm text-white/60 mb-4">
            Add an extra layer of security to your account
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all font-medium"
          >
            Enable 2FA
          </motion.button>
        </div>

        <div className="pt-6 border-t border-white/[0.08]">
          <h3 className="font-semibold text-white mb-4 tracking-tight">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl">
              <div>
                <p className="text-sm font-medium text-white">Current Session</p>
                <p className="text-xs text-white/50 font-mono">San Francisco, CA • Chrome</p>
              </div>
              <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
