import { User, Bell, Palette, Globe, Lock, CreditCard, LogOut, Sparkles, Crown, Zap, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Header Hierarchy */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center gap-2 mb-4">
           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Workspace Settings</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.03em]">
          Settings
        </h1>
        <p className="text-base text-foreground/40 font-medium max-w-2xl leading-relaxed">
          Manage your personal workspace, notifications, and subscription parameters.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="sticky top-24 space-y-8">
            <nav className="space-y-1">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                    activeSection === section.id
                      ? "bg-black/[0.03] dark:bg-white/[0.04] text-foreground border border-black/[0.08] dark:border-white/[0.08] shadow-sm"
                      : "text-foreground/40 hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <section.icon className={`w-4.5 h-4.5 ${activeSection === section.id ? "text-primary" : "text-foreground/20 group-hover:text-foreground/40"}`} />
                    <span className={`text-[13px] font-bold tracking-tight ${activeSection === section.id ? "" : "text-foreground/40"}`}>{section.label}</span>
                  </div>
                  {activeSection === section.id && (
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </motion.button>
              ))}
            </nav>

            <div className="pt-8 border-t border-black/[0.05] dark:border-white/[0.05]">
              <motion.button
                onClick={handleSignOut}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all group"
              >
                <LogOut className="w-4.5 h-4.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-[13px] font-bold tracking-tight">Log Out</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === "profile" && <ProfileSettings />}
              {activeSection === "notifications" && <NotificationSettings />}
              {activeSection === "domain" && <DomainSettings />}
              {activeSection === "billing" && <BillingSettings />}
            </motion.div>
          </AnimatePresence>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[2.5rem] p-10 shadow-sm"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      <div className="flex items-center gap-3 mb-12">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Profile Information</h2>
      </div>
      
      <div className="space-y-10">
        {/* Avatar Section - Refined & Sleek */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-8 p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-3xl">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center relative group overflow-hidden shadow-xl shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover relative z-10" alt="avatar" />
            ) : (
              <span className="text-white text-xl font-black relative z-10">
                {localName ? localName.substring(0, 1).toUpperCase() : "U"}
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <User className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-foreground mb-0.5">Identity Image</h4>
            <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest mb-3.5">PNG, JPG • MAX 800KB</p>
            <div className="flex flex-wrap gap-2.5">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/10 transition-all"
              >
                Change
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRemoveAvatar}
                className="px-3.5 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.1] dark:border-white/[0.1] text-foreground/40 hover:text-red-500 hover:border-red-500/30 rounded-lg transition-all text-[9px] font-black uppercase tracking-[0.15em]"
              >
                Remove
              </motion.button>
            </div>
          </div>
        </div>

        {/* Form Fields - Compact Geometry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3">
              Display Name
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-[13px] text-foreground font-bold placeholder:text-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3">
              GitHub Handle
            </label>
            <div className="relative group">
              <input
                type="text"
                readOnly
                value={githubHandle ? `@${githubHandle}` : "Not connected"}
                className="w-full px-4 py-2.5 bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.04] dark:border-white/[0.04] rounded-xl text-[13px] text-foreground/25 font-bold cursor-not-allowed outline-none"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/10 group-hover:text-foreground/20 transition-colors" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-3">
            Professional Bio
          </label>
          <textarea
            rows={4}
            value={localBio}
            onChange={(e) => setLocalBio(e.target.value)}
            placeholder="Tell us about your expertise..."
            className="w-full px-4 py-2.5 bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-[13px] text-foreground font-bold placeholder:text-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="pt-6 flex justify-end items-center gap-6">
          <p className="hidden md:block text-[9px] font-bold text-foreground/20 uppercase tracking-[0.15em] text-right max-w-[180px]">
            Synthesized to cloud.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-6 py-2.5 bg-foreground text-background dark:bg-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all shadow-black/10 dark:shadow-white/5"
          >
            Save Changes
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[2.5rem] p-10 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-12">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Notification Preferences</h2>
      </div>
      
      <div className="space-y-6">
        {notifications.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-6 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0">
            <div>
              <p className="text-[14px] font-bold text-foreground mb-1">{item.title}</p>
              <p className="text-[12px] text-foreground/40 font-medium">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.1] dark:border-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm transition-all"></div>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[2.5rem] p-10 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-12">
        <Globe className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Custom Domain</h2>
      </div>
      
      <div className="space-y-10">
        <div>
          <label className="block text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-4">
            Workspace Hub
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              defaultValue="johndoe.lamefolio.ai"
              className="flex-1 px-4 py-2.5 bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.04] dark:border-white/[0.04] rounded-xl text-[13px] text-foreground/30 font-bold outline-none cursor-default"
              disabled
            />
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.1] dark:border-white/[0.1] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all"
            >
              Copy Link
            </motion.button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.08] dark:border-white/[0.08]">
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5" />
          <div className="relative p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
               <Crown className="w-8 h-8 text-primary shadow-2xl" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[18px] font-bold text-foreground mb-1 leading-tight">Elevate to White-label</h3>
              <p className="text-[14px] text-foreground/40 font-medium mb-0">Connect a domain you own and remove all Lamefolio branding.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all shrink-0"
            >
              Unlock Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



function BillingSettings() {
  const { plan, githubHandle, displayName, user } = useGitHub();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    setProcessingPlanId(planId);
    
    try {
      const handle = githubHandle || displayName;
      if (!handle) {
         toast.error("Please sign in to upgrade");
         return;
      }

      const order = await createBillingOrder(handle, planId);
      
      // If we are in mock mode (no keys on backend)
      if (order.mock) {
         toast.info("Developer Mode: Razorpay keys not detected on backend.", {
           description: "You can use the mock bypass to test the upgrade process.",
           action: {
             label: "Bypass & Upgrade",
             onClick: async () => {
               await verifyBillingPayment(handle, planId, order.id, 'mock_pay_id', 'mock_sig');
               toast.success("Mock upgrade successful!");
               setTimeout(() => window.location.reload(), 1000);
             }
           },
           duration: 10000,
         });
         setProcessingPlanId(null);
         return;
      }

      const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!rzpKey || rzpKey === "rzp_test_mock") {
         toast.error("VITE_RAZORPAY_KEY_ID is missing in frontend env", {
           description: "Please add your Razorpay Live/Test Key to the Vercel Frontend project settings."
         });
         setProcessingPlanId(null);
         return;
      }

      const options = {
        key: rzpKey, 
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
          onclose: () => setProcessingPlanId(null)
        }
      };

      const rzp1 = (window as any).Razorpay ? new (window as any).Razorpay(options) : null;
      if (!rzp1) throw new Error("Razorpay script not loaded");
      
      rzp1.on('payment.failed', function (response: any){
          toast.error("Payment failed: " + response.error.description);
          setProcessingPlanId(null);
      });
      rzp1.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
      setProcessingPlanId(null);
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
              disabled={p.isCurrent || !!processingPlanId}
              onClick={() => handleUpgrade(p.id)}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 ${
                p.isCurrent 
                  ? "bg-secondary text-foreground/40 border border-border cursor-default" 
                  : p.id === 'pro'
                    ? "bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-black/5"
                    : "bg-muted text-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              {processingPlanId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {p.isCurrent ? "Current Plan" : processingPlanId === p.id ? "Processing..." : "Upgrade Plan"}
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
