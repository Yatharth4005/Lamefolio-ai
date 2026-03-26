import { User, Bell, Palette, Globe, Lock, CreditCard, LogOut, Sparkles, Crown, Zap, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { useGitHub } from "../context/GitHubContext";
import { updateUserData, createBillingOrder, verifyBillingPayment } from "../lib/api";
import { toast } from "sonner";

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
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          Settings
        </h1>
        <p className="text-foreground/60">
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
          <div className="backdrop-blur-xl bg-muted border border-border rounded-2xl p-4 sticky top-24">
            <nav className="space-y-1">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-foreground border border-purple-500/30"
                      : "text-foreground/60 hover:text-foreground hover:bg-secondary"
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

  const handleSave = async () => {
    try {
      const handle = githubHandle || displayName;
      if (handle) {
        await updateUserData(handle, localName, localBio);
      }
      setDisplayName(localName);
      if (user) {
        setUser({ ...user, bio: localBio });
      }
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-muted border border-border rounded-2xl p-6 md:p-8"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Profile Information</h2>
      
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
              className="px-5 py-2.5 bg-secondary border border-border rounded-xl text-foreground/80 hover:bg-muted transition-all text-sm font-medium mr-3"
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
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              GitHub Handle
            </label>
            <input
              type="text"
              readOnly
              value={githubHandle ? `@${githubHandle}` : "Not connected"}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground/40 cursor-not-allowed italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">
            Bio
          </label>
          <textarea
            rows={4}
            value={localBio}
            onChange={(e) => setLocalBio(e.target.value)}
            placeholder="No bio set on GitHub. Tell us about yourself!"
            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
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
      className="backdrop-blur-xl bg-muted border border-border rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Notification Preferences</h2>
      
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-foreground/50">{item.description}</p>
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
      className="backdrop-blur-xl bg-muted border border-border rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Custom Domain</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">
            Current Domain
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              defaultValue="johndoe.lamefolio.ai"
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground/50"
              disabled
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 bg-muted border border-border rounded-xl text-foreground/80 hover:bg-muted/80 transition-all font-medium"
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
  const { plan, githubHandle, displayName, user } = useGitHub();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    setIsProcessing(true);
    
    try {
      const handle = githubHandle || displayName;
      if (!handle) {
         toast.error("Please sign in to upgrade");
         return;
      }

      const order = await createBillingOrder(handle, planId);
      
      // If we are in mock mode (no keys on backend)
      if (order.mock) {
         await verifyBillingPayment(handle, planId, order.id, 'mock_pay_id', 'mock_sig');
         toast.success("Developer Mode: Mock upgrade successful!");
         window.location.reload();
         return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock", // Should be provided in env
        amount: order.amount,
        currency: order.currency,
        name: "Lamefolio AI",
        description: `${planId.toUpperCase()} Plan Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await verifyBillingPayment(
              handle,
              planId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            toast.success(`Congratulations! You are now a ${planId.toUpperCase()} member! 🚀`, {
              description: "Your unlimited access is now active.",
              duration: 5000,
            });
            
            // Simulate mobile notification
            console.log(`📱 SMS SENT: Hello ${displayName}, welcome to Lamefolio ${planId.toUpperCase()}! Your unlimited AI generations are now active.`);
            console.log(`📧 EMAIL SENT: To ${user?.email || "user@example.com"} - [Payment Successful] Welcome to Lamefolio PRO/Premium!`);
            toast.info("Notifications sent to your mobile and email! ✉️");

            setTimeout(() => window.location.reload(), 2000);
          } catch (err: any) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: displayName,
          email: user?.email || "",
        },
        theme: {
          color: "#8B5CF6",
        },
        modal: {
          onclose: () => setIsProcessing(false)
        }
      };

      const rzp1 = (window as any).Razorpay ? new (window as any).Razorpay(options) : null;
      if (!rzp1) throw new Error("Razorpay script not loaded");
      
      rzp1.on('payment.failed', function (response: any){
          toast.error("Payment failed: " + response.error.description);
          setIsProcessing(false);
      });
      rzp1.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      icon: Sparkles,
      features: ["3 AI Generations", "Notion Integration", "Basic Analytics", "Community Support"],
      isCurrent: plan.toLowerCase() === "free",
      gradient: "from-gray-500/20 to-gray-800/20",
      borderColor: "border-white/10"
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "₹1",
      icon: Zap,
      features: ["Unlimited Generations", "Custom Domain", "Advanced Analytics", "Priority Notion Sync"],
      isCurrent: plan.toLowerCase() === "pro",
      gradient: "from-purple-500/20 to-blue-500/20",
      borderColor: "border-purple-500/30",
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹2",
      icon: Crown,
      features: ["Teams & Collaboration", "White-label Output", "Dedicated Manager", "Beta Feature Access"],
      isCurrent: plan.toLowerCase() === "premium",
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
        {plans.map((p) => (
          <motion.div
            key={p.id}
            whileHover={p.isCurrent ? {} : { y: -8, scale: 1.02 }}
            className={`relative backdrop-blur-3xl bg-gradient-to-br ${p.gradient} border ${p.borderColor} rounded-[2rem] p-8 flex flex-col transition-all group overflow-hidden`}
          >
            {p.popular && (
              <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                p.id === 'pro' ? 'bg-purple-500/20 text-purple-400' : 
                p.id === 'premium' ? 'bg-amber-500/20 text-amber-400' : 
                'bg-white/10 text-white/40'
              }`}>
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">{p.price}</span>
                <span className="text-sm text-foreground/40">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {p.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-foreground/70">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    p.id === 'pro' ? 'bg-purple-500' : 
                    p.id === 'premium' ? 'bg-amber-500' : 
                    'bg-foreground/40'
                  }`} />
                  {feature}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={p.isCurrent ? {} : { scale: 1.02 }}
              whileTap={p.isCurrent ? {} : { scale: 0.98 }}
              disabled={p.isCurrent || isProcessing}
              onClick={() => handleUpgrade(p.id)}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 ${
                p.isCurrent 
                  ? "bg-secondary text-foreground/40 border border-border cursor-default" 
                  : p.id === 'pro'
                    ? "bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-black/5"
                    : "bg-muted text-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              {isProcessing && !p.isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {p.isCurrent ? "Current Plan" : isProcessing ? "Processing..." : "Upgrade Plan"}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Payment History Mockup */}
      <div className="backdrop-blur-xl bg-secondary border border-border rounded-2xl p-6 md:p-8">
        <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest opacity-40">Billing History</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border/50">
            <div>
              <p className="text-sm font-medium text-foreground">Free Plan Enrollment</p>
              <p className="text-xs text-foreground/30">March 22, 2026</p>
            </div>
            <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">Processed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
