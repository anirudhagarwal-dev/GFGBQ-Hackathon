"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { AlertCircle, CheckCircle2, Upload, Loader2, Menu, X, Lock, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [listeningField, setListeningField] = useState<"title" | "description" | null>(null);

  useEffect(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
      setIsLoggedIn(!!token);
      setUserRole(role);
  }, []);

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setUserRole(null);
      window.location.reload();
  };

  const startListening = (field: "title" | "description") => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = lang === "hi" ? "hi-IN" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setListeningField(field);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (field === "title") {
          setTitle((prev) => (prev ? prev + " " + transcript : transcript));
        } else {
          setDescription((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
        setListeningField(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        setListeningField(null);
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const t = {
    en: {
      title: "CivicPulse",
      subtitle: "AI-Driven Grievance Redressal System. Report issues, track status, and improve your city.",
      reportTitle: "Report a Grievance",
      reportDesc: "Describe the issue you are facing. Our AI will automatically categorize and route it to the right department.",
      fieldLabel: "Title",
      descLabel: "Description",
      submit: "Submit Grievance",
      submitting: "Submitting...",
      success: "Grievance submitted successfully!",
      error: "Failed to submit grievance.",
      adminLink: "Admin Portal",
      fieldLink: "Field Officer Portal",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      features: "Why use CivicPulse?",
      feature1: "AI-Powered Routing",
      feature1Desc: "Automatically sends your report to the right department.",
      feature2: "Real-time Tracking",
      feature2Desc: "Monitor the status of your grievance every step of the way.",
      feature3: "Quick Resolution",
      feature3Desc: "Our streamlined process ensures faster response times."
    },
    hi: {
      title: "CivicPulse (नागरिक पल्स)",
      subtitle: "एआई-संचालित शिकायत निवारण प्रणाली। समस्याओं की रिपोर्ट करें, स्थिति ट्रैक करें और अपने शहर को बेहतर बनाएं।",
      reportTitle: "शिकायत दर्ज करें",
      reportDesc: "जिस समस्या का आप सामना कर रहे हैं उसका वर्णन करें। हमारा एआई इसे स्वचालित रूप से वर्गीकृत करेगा और सही विभाग को भेजेगा।",
      fieldLabel: "शीर्षक",
      descLabel: "विवरण",
      submit: "शिकायत जमा करें",
      submitting: "जमा हो रहा है...",
      success: "शिकायत सफलतापूर्वक जमा की गई!",
      error: "शिकायत जमा करने में विफल।",
      adminLink: "एडमिन पोर्टल",
      fieldLink: "फील्ड अधिकारी पोर्टल",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉग आउट",
      dashboard: "डैशबोर्ड",
      features: "CivicPulse क्यों चुनें?",
      feature1: "एआई-संचालित रूटिंग",
      feature1Desc: "आपकी रिपोर्ट को स्वचालित रूप से सही विभाग में भेजता है।",
      feature2: "रियल-टाइम ट्रैकिंग",
      feature2Desc: "हर कदम पर अपनी शिकायत की स्थिति की निगरानी करें।",
      feature3: "त्वरित समाधान",
      feature3Desc: "हमारी सुव्यवस्थित प्रक्रिया तेजी से प्रतिक्रिया समय सुनिश्चित करती है।"
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await api.post("/grievance/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess("Grievance submitted successfully!");
      setResult(response.data);
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      setError("Failed to submit grievance. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CivicPulse</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={() => setLang(lang === "en" ? "hi" : "en")}>
                {lang === "en" ? "हिंदी" : "English"}
              </Button>
              
              {isLoggedIn ? (
                  <>
                    <Button variant="ghost" asChild>
                        <a href={userRole === "Admin" ? "/admin/dashboard" : userRole === "FieldOfficer" ? "/field-officer/dashboard" : "/my-grievances"}>{t[lang].dashboard}</a>
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                        {t[lang].logout}
                    </Button>
                  </>
              ) : (
                  <>
                    <Button variant="ghost" asChild>
                        <a href="/login">{t[lang].login}</a>
                    </Button>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <a href="/signup">{t[lang].signup}</a>
                    </Button>
                  </>
              )}
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                >
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setLang(lang === "en" ? "hi" : "en")}>
                            {lang === "en" ? "Change to Hindi" : "Change to English"}
                        </Button>
                        
                        {isLoggedIn ? (
                            <>
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <a href={userRole === "Admin" ? "/admin/dashboard" : userRole === "FieldOfficer" ? "/field-officer/dashboard" : "/my-grievances"}>{t[lang].dashboard}</a>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                                    {t[lang].logout}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <a href="/login">{t[lang].login}</a>
                                </Button>
                                <Button className="w-full justify-start" asChild>
                                    <a href="/signup">{t[lang].signup}</a>
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl"
                    >
                        <span className="block xl:inline">{t[lang].title.split(" ")[0]}</span>{' '}
                        <span className="block text-blue-600 xl:inline">for a Better City</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    >
                        {t[lang].subtitle}
                    </motion.p>
                    
                    <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5, delay: 0.2 }}
                         className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
                    >
                        <p className="text-sm font-semibold text-slate-900 tracking-wide uppercase mb-3">
                            TRUSTED BY MUNICIPALITIES ACROSS THE REGION
                        </p>
                        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                             <div className="h-8 w-24 bg-slate-300 rounded"></div>
                             <div className="h-8 w-24 bg-slate-300 rounded"></div>
                             <div className="h-8 w-24 bg-slate-300 rounded"></div>
                        </div>
                    </motion.div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
                >
                    <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-900">{t[lang].reportTitle}</CardTitle>
                                <CardDescription>{t[lang].reportDesc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoggedIn ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="title">{t[lang].fieldLabel}</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startListening("title")}
                                                className={isListening && listeningField === "title" ? "text-red-500 animate-pulse" : "text-slate-500"}
                                            >
                                                <Mic className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Input 
                                            id="title" 
                                            placeholder={lang === "en" ? "e.g., Water leakage in Main St." : "उदाहरण: मुख्य सड़क पर पानी का रिसाव"}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="bg-white/50 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="description">{t[lang].descLabel}</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startListening("description")}
                                                className={isListening && listeningField === "description" ? "text-red-500 animate-pulse" : "text-slate-500"}
                                            >
                                                <Mic className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea 
                                            id="description" 
                                            placeholder={lang === "en" ? "Provide more details..." : "अधिक विवरण प्रदान करें..."}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            className="min-h-[100px] bg-white/50 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Upload Evidence (Optional)</Label>
                                        <Input id="image" type="file" onChange={handleFileChange} className="bg-white/50" />
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all" disabled={loading}>
                                        {!loading && <Upload className="mr-2 h-4 w-4" />}
                                        {loading ? t[lang].submitting : t[lang].submit}
                                    </Button>
                                </form>
                                ) : (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                            <Lock className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Login to Report</h3>
                                            <p className="text-slate-500 mt-1">You need to be logged in to submit a grievance.</p>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-2">
                                            <Button variant="outline" asChild>
                                                <a href="/login">Login</a>
                                            </Button>
                                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                                <a href="/signup">Sign Up</a>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {(success || error) && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4"
            >
                {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-xl flex items-start gap-4 max-w-md w-full">
                    <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <p className="font-semibold text-green-900">{t[lang].success}</p>
                        {result && (
                            <div className="text-sm text-green-800">
                                <p>Grievance ID: <span className="font-mono font-bold bg-green-100 px-1 rounded">{result.id}</span></p>
                                <p className="mt-2">
                                    <a href={`/grievance/${result.id}`} className="inline-flex items-center font-medium hover:underline">
                                    Track Status &rarr;
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900 hover:bg-green-100"><X className="h-4 w-4"/></Button>
                </div>
                )}

                {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-xl flex items-center gap-4 max-w-md w-full">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                         <p className="font-medium text-red-900">{t[lang].error}</p>
                    </div>
                     <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-red-700 hover:text-red-900 hover:bg-red-100"><X className="h-4 w-4"/></Button>
                </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    {t[lang].features}
                </p>
            </div>

            <div className="mt-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { title: t[lang].feature1, desc: t[lang].feature1Desc, icon: "🤖" },
                        { title: t[lang].feature2, desc: t[lang].feature2Desc, icon: "📍" },
                        { title: t[lang].feature3, desc: t[lang].feature3Desc, icon: "⚡" },
                    ].map((feature, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="pt-6"
                        >
                            <div className="flow-root bg-slate-50 rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg text-3xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-slate-900 tracking-tight">{feature.title}</h3>
                                    <p className="mt-5 text-base text-slate-500">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                  <span className="font-bold text-2xl">CivicPulse</span>
                  <p className="text-slate-400 text-sm mt-1">Empowering citizens, enabling change.</p>
              </div>
              <div className="flex gap-6">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              </div>
          </div>
      </footer>
    </div>
  );
}
