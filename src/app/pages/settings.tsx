import { User, Bell, Palette, Globe, Lock, CreditCard, LogOut, Sparkles, Crown, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { useGitHub } from "../context/GitHubContext";

export function SettingsPage() {
  const { displayName, user, githubHandle, signOut } = useGitHub();
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

  const handleSignOut = () => {
    signOut();
    navigate("/");
    window.location.reload();
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "domain", label: "Custom Domain", icon: Globe },
    { id: "billing", label: "Billing", icon: CreditCard },
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
                  onClick={handleSignOut}
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
          {activeSection === "domain" && <DomainSettings />}
          {activeSection === "billing" && <BillingSettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { displayName, user, githubHandle, setUser, setDisplayName } = useGitHub();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localName, setLocalName] = useState(displayName);
  const [localBio, setLocalBio] = useState(user?.bio || "");
  
  const handleRemoveAvatar = () => {
    if (user) {
      setUser({ ...user, avatar: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setDisplayName(localName);
    if (user) {
      setUser({ ...user, bio: localBio });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Profile Information</h2>
      
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative group overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover relative z-10" alt="avatar" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <span className="text-white text-3xl font-semibold relative z-10">
                  {localName ? localName.substring(0, 1).toUpperCase() : "U"}
                </span>
              </>
            )}
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all text-sm font-medium mr-3"
            >
              Change Avatar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveAvatar}
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
              Display Name
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              GitHub Handle
            </label>
            <input
              type="text"
              readOnly
              value={githubHandle ? `@${githubHandle}` : "Not connected"}
              className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.05] rounded-xl text-white/40 cursor-not-allowed italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Bio
          </label>
          <textarea
            rows={4}
            value={localBio}
            onChange={(e) => setLocalBio(e.target.value)}
            placeholder="No bio set on GitHub. Tell us about yourself!"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="pt-6 border-t border-white/[0.08]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-bold text-sm tracking-tight relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative z-10">Save Profile Changes</span>
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
              defaultValue="johndoe.lamefolio.ai"
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



function BillingSettings() {
  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "$0",
      icon: Sparkles,
      features: ["3 AI Generations", "Notion Integration", "Basic Analytics", "Community Support"],
      isCurrent: true,
      gradient: "from-gray-500/20 to-gray-800/20",
      borderColor: "border-white/10"
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "$19",
      icon: Zap,
      features: ["Unlimited Generations", "Custom Domain", "Advanced Analytics", "Priority Notion Sync"],
      isCurrent: false,
      gradient: "from-purple-500/20 to-blue-500/20",
      borderColor: "border-purple-500/30",
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49",
      icon: Crown,
      features: ["Teams & Collaboration", "White-label Output", "Dedicated Manager", "Beta Feature Access"],
      isCurrent: false,
      gradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative backdrop-blur-3xl bg-gradient-to-br ${plan.gradient} border ${plan.borderColor} rounded-[2rem] p-8 flex flex-col transition-all group overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                plan.id === 'pro' ? 'bg-purple-500/20 text-purple-400' : 
                plan.id === 'premium' ? 'bg-amber-500/20 text-amber-400' : 
                'bg-white/10 text-white/40'
              }`}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-sm text-white/40">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    plan.id === 'pro' ? 'bg-purple-500' : 
                    plan.id === 'premium' ? 'bg-amber-500' : 
                    'bg-white/40'
                  }`} />
                  {feature}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-tight transition-all ${
                plan.isCurrent 
                  ? "bg-white/5 text-white/40 border border-white/10 cursor-default" 
                  : plan.id === 'pro'
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
            >
              {plan.isCurrent ? "Current Plan" : "Upgrade Plan"}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Payment History Mockup */}
      <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 md:p-8">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest text-white/40">Billing History</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-white/[0.03]">
            <div>
              <p className="text-sm font-medium text-white">Free Plan Enrollment</p>
              <p className="text-xs text-white/30">March 22, 2026</p>
            </div>
            <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">Processed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
