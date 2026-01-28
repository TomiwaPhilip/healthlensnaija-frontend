// src/pages/Dashboard/SettingsPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axiosInstance from "../../utils/axiosInstance";


const SettingsPage = () => {
  const [expandedSection, setExpandedSection] = useState("profile");
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { isNightMode } = useContext(DashboardContext);
  const { t, i18n } = useTranslation("settings");


  // ✅ Ensure UI language (site language) comes from appLang only
 useEffect(() => {
      const appLang = localStorage.getItem("appLang") || "en";
      if (i18n.language !== appLang) i18n.changeLanguage(appLang);
    }, [i18n]);

  const [firstName, setFirstName] = useState("Alison");
  const [lastName, setLastName] = useState("Eyo");
  const [email, setEmail] = useState("alison@gmail.com");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- Tone maps (backend expects lowercase codes)
  const toneMap = {
    neutral: "Neutral",
    formal: "Formal",
    casual: "Casual",
    inspirational: "Inspirational",
    storytelling: "Storytelling",
  };
  const toneMapReverse = Object.fromEntries(
    Object.entries(toneMap).map(([k, v]) => [v, k])
  );

  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");
  const [tone, setTone] = useState(localStorage.getItem("tone") || "Neutral");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/me");
        const user = res.data.user;

        // Backend already stores language as labels ("Hausa"), so we just take it
        const backendLang = user.language || null;
        const backendTone = user.tone ? toneMap[user.tone] : null;

        const storedLang = localStorage.getItem("language");
        const storedTone = localStorage.getItem("tone");

        const finalLang = storedLang || backendLang || "English";
        const finalTone = storedTone || backendTone || "Neutral";

        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setLanguage(finalLang);
        setTone(finalTone);

        localStorage.setItem("language", finalLang);
        localStorage.setItem("tone", finalTone);

        setProfilePicture(user.profilePicture || "");
        // if (finalLang === "French") i18n.changeLanguage("fr");
        //       else if (finalLang === "English") i18n.changeLanguage("en");
      } catch {
        toast.error(t("toast.fetchFailed"));
      }
    };
    fetchUser();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setUploading(true);
      const response = await axiosInstance.post("/dashboard/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setProfilePicture(response.data.profilePicture);
        toast.success(t("toast.profilePictureUpdated"));
      }
    } catch {
      toast.error(t("toast.uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      await axiosInstance.put("/dashboard/update-profile", {
        firstName,
        lastName,
        email,
      });
      toast.success(t("toast.profileUpdated"));
    } catch {
      toast.error(t("toast.profileUpdateFailed"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setChangingPassword(true);
      const res = await axiosInstance.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || t("toast.passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || t("toast.passwordFailed"));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const newLangLabel = e.target.value; // label (English, Hausa, Yoruba, Igbo)
    setLanguage(newLangLabel);
    localStorage.setItem("language", newLangLabel);

    if (newLangLabel === "French") i18n.changeLanguage("fr");
    if (newLangLabel === "English") i18n.changeLanguage("en");

    try {
      await axiosInstance.put("/dashboard/preferences", { 
        language: newLangLabel,        // ✅ send label to backend
        tone: toneMapReverse[tone]     // ✅ send code (neutral, formal…)
      });
      toast.success(t("toast.languageUpdated"));
    } catch {
      toast.error(t("toast.languageFailed"));
    }
  };

  const handleToneChange = async (e) => {
    const newToneLabel = e.target.value; // label (Neutral, Formal, etc.)
    setTone(newToneLabel);
    localStorage.setItem("tone", newToneLabel);

    try {
      await axiosInstance.put("/dashboard/preferences", { 
        language,                      // ✅ keep current label
        tone: toneMapReverse[newToneLabel] // ✅ send code
      });
      toast.success(t("toast.toneUpdated"));
    } catch {
      toast.error(t("toast.toneFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Card className="p-6 bg-card">
          <h1 className="text-lg font-semibold mb-4">{t("sections.profile.title")}</h1>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{(firstName || "").charAt(0)}</div>
                )}
              </div>
              <label className="inline-flex items-center">
                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                <Button variant="outline" size="sm">{uploading ? t("sections.profile.uploading") : t("sections.profile.changePicture")}</Button>
              </label>
            </div>

            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("sections.profile.firstName")} />
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("sections.profile.lastName")} />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t("sections.profile.email")} />

            <div className="flex justify-end">
              <Button onClick={handleProfileSave} disabled={savingProfile}>{savingProfile ? t("sections.profile.saving") : t("sections.profile.save")}</Button>
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card className="p-6 bg-card mt-6">
          <h2 className="text-lg font-semibold mb-4">{t("sections.password.title")}</h2>
          <div className="space-y-4">
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder={t("sections.password.current")} />
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t("sections.password.new")} />
            <div className="flex justify-end">
              <Button onClick={handlePasswordChange} disabled={changingPassword}>{changingPassword ? t("sections.password.updating") : t("sections.password.save")}</Button>
            </div>
          </div>
        </Card>

        {/* Story Settings */}
        <Card className="p-6 bg-card mt-6">
          <h2 className="text-lg font-semibold mb-4">{t("sections.storySettings.title")}</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">{t("sections.storySettings.language")}</label>
              <select value={language} onChange={handleLanguageChange} className="w-full p-2 border rounded-md bg-background text-sm">
                <option value="English">English</option>
                <option value="Hausa">Hausa</option>
                <option value="Yoruba">Yoruba</option>
                <option value="Igbo">Igbo</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm">{t("sections.storySettings.tone")}</label>
              <select value={tone} onChange={handleToneChange} className="w-full p-2 border rounded-md bg-background text-sm">
                <option value="Neutral">Neutral</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Inspirational">Inspirational</option>
                <option value="Storytelling">Storytelling</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Site Language */}
        <Card className="p-6 bg-card mt-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{t("sections.siteLanguage.title")}</h2>
          <div>
            <label className="block mb-2 text-sm">{t("sections.siteLanguage.label")}</label>
            <select
              value={i18n.language}
              onChange={(e) => {
                const lng = e.target.value;
                i18n.changeLanguage(lng);
                localStorage.setItem("appLang", lng);
                toast.success(t("toast.siteLanguageUpdated"));
              }}
              className="w-full p-2 border rounded-md bg-background text-sm"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
