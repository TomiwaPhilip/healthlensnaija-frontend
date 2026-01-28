// src/pages/Dashboard/SettingsPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { FaChevronRight, FaChevronDown, FaUser } from "react-icons/fa";
import { DashboardContext } from "../../context/DashboardContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getInitials } from "../../utils/helpers";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next"; 

const SettingsPage = () => {
  const [isUserManagementVisible, setIsUserManagementVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
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

  const profileCompletion = 85;

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

  const toggleUserManagement = () => {
    setIsUserManagementVisible((prev) => !prev);
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
    <div className={`min-h-screen ${isNightMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="text-sm mb-6 px-6 mt-5">
      <span className="font-semibold text-gray-500">{t("breadcrumb.overview")}</span> &gt;{" "}
<span className="font-semibold text-gray-500">{t("breadcrumb.account")}</span> &gt;{" "}
<span className="text-black">{t("breadcrumb.settings")}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-14 px-6">
        {/* Profile Completion Section */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          <div
            className={`${isNightMode ? "bg-gray-700" : "bg-green-800"} text-white p-6 rounded-lg shadow-md`}
            style={{ height: "170px" }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="w-28 h-28 mr-6">
                <CircularProgressbar
                  value={profileCompletion}
                  text={`${profileCompletion}%`}
                  strokeWidth={5}
                  styles={buildStyles({
                    textColor: "#ffffff",
                    pathColor: "#4ade80",
                    trailColor: "#2d3748",
                  })}
                />
              </div>
              <div className="flex flex-col">
              <p className="text-lg font-medium mb-2">{t("profileCompletion.title")}</p>
               <p className="text-sm mb-4">{t("profileCompletion.subtitle")}</p>
                <button
                  className={`py-2 px-4 rounded-lg font-semibold ${
                    isNightMode ? "bg-gray-300 text-gray-900" : "bg-white text-green-800"
                  } hover:bg-gray-100`}
                >
                 {t("profileCompletion.button")}
                </button>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-md cursor-pointer hover:bg-green-100"
            onClick={toggleUserManagement}
          >
            <div className="flex items-center space-x-3">
              <FaUser className="text-green-600" />
              <span className="font-medium">{t("userManagement.title")}</span>
            </div>
            {isUserManagementVisible ? <FaChevronDown className="text-green-600" /> : <FaChevronRight className="text-green-600" />}
          </div>
        </div>

        {/* User Management Section */}
        {isUserManagementVisible && (
          <div className={`lg:w-2/3 p-6 rounded-lg shadow-md ${isNightMode ? "bg-gray-800" : "bg-green-50"}`}>
            <h2 className="text-lg font-bold mb-5">User Management</h2>
            <ul className="space-y-4">
              {/* Profile Section */}
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-3"
                  onClick={() => toggleSection("profile")}
                >
                  <div>
                  <p className="font-semibold">{t("sections.profile.title")}</p>
                   <p className="text-sm">{t("sections.profile.subtitle")}</p>
                  </div>
                  {expandedSection === "profile" ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                {expandedSection === "profile" && (
                  <div className="mt-4 space-y-4 text-black">
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative w-28 h-28 flex items-center justify-center bg-gray-200 rounded-full border mb-4">
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-lg font-semibold">{getInitials(firstName, lastName)}</span>
                        )}
                      </div>
                      <label className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 cursor-pointer">
                      {uploading ? t("sections.profile.uploading") : t("sections.profile.changePicture")}

                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder={t("sections.profile.firstName")}
                      className="w-full p-3 border rounded-lg"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder={t("sections.profile.lastName")}
                      className="w-full p-3 border rounded-lg"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder={t("sections.profile.email")}
                      className="w-full p-3 border rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      onClick={handleProfileSave}
                      className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
                      disabled={savingProfile}
                    >
                     {savingProfile ? t("sections.profile.saving") : t("sections.profile.save")}
                    </button>
                  </div>
                )}
              </li>

              {/* Password Section */}
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-3"
                  onClick={() => toggleSection("password")}
                >
                  <div>
                  <p className="font-semibold">{t("sections.password.title")}</p>
                  <p className="text-sm">{t("sections.password.subtitle")}</p>
                  </div>
                  {expandedSection === "password" ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                {expandedSection === "password" && (
                  <div className="mt-4 space-y-4">
                    <input
                      type="password"
                      placeholder={t("sections.password.current")}
                      className="w-full p-3 border rounded-lg"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder={t("sections.password.new")}
                      className="w-full p-3 border rounded-lg"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      onClick={handlePasswordChange}
                      className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
                      disabled={changingPassword}
                    >
                      {changingPassword ? t("sections.password.updating") : t("sections.password.save")}

                    </button>
                  </div>
                )}
              </li>

              {/* Language & Tone */}
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-3"
                  onClick={() => toggleSection("settings")}
                >
                  <div>
                  <p className="font-semibold">{t("sections.storySettings.title")}</p>
                  <p className="text-sm">{t("sections.storySettings.subtitle")}</p>
                  </div>
                  {expandedSection === "settings" ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                {expandedSection === "settings" && (
                  <div className="mt-4 space-y-4">
                    <div>
                    <label>{t("sections.storySettings.language")}:</label>
                      <select value={language} onChange={handleLanguageChange} className="w-full p-3 border rounded-lg">
  <option value="English">English</option>
  <option value="Hausa">Hausa</option>
  <option value="Yoruba">Yoruba</option>
  <option value="Igbo">Igbo</option>
  <option value="French">French</option>
  <option value="Spanish">Spanish</option>
</select>

                    </div>
                    <div>
                    <label>{t("sections.storySettings.tone")}:</label>
                      <select value={tone} onChange={handleToneChange} className="w-full p-3 border rounded-lg">
                        <option value="Neutral">Neutral</option>
                        <option value="Formal">Formal</option>
                        <option value="Casual">Casual</option>
                        <option value="Inspirational">Inspirational</option>
                        <option value="Storytelling">Storytelling</option>
                      </select>
                    </div>
                  </div>
                )}
              </li>

              
             {/* 🌍 Site Language Switch */}
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer border-b pb-3"
                  onClick={() => toggleSection("siteLanguage")}
                >
                  <div>
                  <p className="font-semibold">{t("sections.siteLanguage.title")}</p>
                  <p className="text-sm">{t("sections.siteLanguage.subtitle")}</p>
                  </div>
                  {expandedSection === "siteLanguage" ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                {expandedSection === "siteLanguage" && (
                  <div className="mt-4 space-y-4">
                  <label>{t("sections.siteLanguage.label")}:</label>
                    <select
                      value={i18n.language}
                      onChange={(e) => {
                        const lng = e.target.value;
                        i18n.changeLanguage(lng);
                        localStorage.setItem("appLang", lng);
                        toast.success(t("toast.siteLanguageUpdated"));
                      }}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
