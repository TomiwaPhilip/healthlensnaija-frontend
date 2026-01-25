// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAdmin from "./locales/en/admin.json";
import frAdmin from "./locales/fr/admin.json";
import enChat from "./locales/en/chat.json";
import frChat from "./locales/fr/chat.json";
import enStory from "./locales/en/story.json";
import frStory from "./locales/fr/story.json";
import enHelp from "./locales/en/help.json";
import frHelp from "./locales/fr/help.json";
import enResources from "./locales/en/resources.json";
import frResources from "./locales/fr/resources.json";
import enSettings from "./locales/en/settings.json";
import frSettings from "./locales/fr/settings.json";
import enAnalytics from "./locales/en/analytics.json";
import frAnalytics from "./locales/fr/analytics.json";
import enSidebar from "./locales/en/sidebar.json";
import frSidebar from "./locales/fr/sidebar.json"; // ✅ corrected import name
import enAITraining from "./locales/en/aiTrainingPage.json";
import frAITraining from "./locales/fr/aiTrainingPage.json";


i18n.use(initReactI18next).init({
  resources: {
    en: {
      admin: enAdmin,
      chat: enChat,
      story: enStory,
      help: enHelp,
      resources: enResources,
      settings: enSettings,
      analytics: enAnalytics,
      sidebar: enSidebar,
      aiTrainingPage: enAITraining, 
    },
    fr: {
      admin: frAdmin,
      chat: frChat,
      story: frStory,
      help: frHelp,
      resources: frResources,
      settings: frSettings,
      analytics: frAnalytics,
      sidebar: frSidebar, // ✅ matches corrected import
      aiTrainingPage: frAITraining, 
    },
  },
  lng: localStorage.getItem("appLang") || "en",
  fallbackLng: "en",
  ns: [
    "admin",
    "chat",
    "story",
    "help",
    "resources",
    "settings",
    "analytics",
    "sidebar",
    "aiTrainingPage",
  ],
  defaultNS: "admin",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
