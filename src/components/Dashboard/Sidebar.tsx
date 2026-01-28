// src/components/Sidebar.tsx
import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; // ADD useLocation
import {
  Home,
  PenTool,
  Shield,
  BarChart,
  Users,
  File,
  Bot,
  MessageCircle,
  List,
  HelpCircle,
  Mail,
  Wrench,
  ChevronLeft,
  Cog,
  Book,
  LogOut,
  Menu,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { DashboardContext } from "../../context/DashboardContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return "U";
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

// ================================
// ADMIN SIDEBAR COMPONENT
// ================================
const AdminSidebar = ({
  collapsed,
  toggleSidebar,
  user = {},
  setShowLogoutModal,
  onMobileLinkClick,
  isMobile,
  isMobileOpen,
}) => {
  const { isNightMode } = useContext(DashboardContext);
  const { t } = useTranslation("sidebar");
  const showExpanded = !collapsed || isMobile;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
        <img src={logo} alt="Nigeria Health Watch" className="w-10 h-10" />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <SidebarItem to="/admin/overview" icon={<BarChart className="w-5 h-5" />} label="Overview" showExpanded={true} />
        <SidebarItem to="/admin/users" icon={<Users className="w-5 h-5" />} label="Users" showExpanded={true} />
        <SidebarItem to="/admin/content" icon={<File className="w-5 h-5" />} label="Content" showExpanded={true} />
        <SidebarItem to="/admin/ai-training" icon={<Bot className="w-5 h-5" />} label="AI Training" showExpanded={true} />
        <SidebarItem to="/admin/chats" icon={<MessageCircle className="w-5 h-5" />} label="Chats" showExpanded={true} />
        <SidebarItem to="/admin/testimonials" icon={<List className="w-5 h-5" />} label="Testimonials" showExpanded={true} />
        <SidebarItem to="/admin/support" icon={<Shield className="w-5 h-5" />} label="Support" showExpanded={true} />
        <SidebarItem to="/admin/faq" icon={<HelpCircle className="w-5 h-5" />} label="FAQs" showExpanded={true} />
        <SidebarItem to="/admin/contact" icon={<Mail className="w-5 h-5" />} label="Contact Messages" showExpanded={true} />
        <SidebarItem to="/admin/tools" icon={<Wrench className="w-5 h-5" />} label="Tools" showExpanded={true} />
      </div>

      {/* Footer sections - pinned to bottom */}
      <div className="mt-auto flex flex-col">
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
          <SidebarItem to="/settings" icon={<Cog className="w-5 h-5" />} label="Settings" showExpanded={true} />
          <SidebarItem to="/help-center" icon={<HelpCircle className="w-5 h-5" />} label="Help Center" showExpanded={true} />
        </div>

        {/* Theme Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <ThemeToggle />
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback className="text-xs">{user?.firstName?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
          </div>
          <button onClick={() => setShowLogoutModal(true)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ================================
// USER SIDEBAR COMPONENT (your existing sidebar)
// ================================
const UserSidebar = ({
  collapsed,
  toggleSidebar,
  user = {},
  setShowLogoutModal,
  onMobileLinkClick,
  isMobile,
  isMobileOpen,
}) => {
  const { isNightMode } = useContext(DashboardContext);
  const { t } = useTranslation("sidebar");

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <SidebarItem to="/dashboard" icon={<Home className="w-5 h-5" />} label="Dashboard" onClick={onMobileLinkClick} showExpanded={true} />
        <SidebarItem to="/resources" icon={<Book className="w-5 h-5" />} label="Resources" onClick={onMobileLinkClick} showExpanded={true} />
        {user?.role === "Admin" && (
          <SidebarItem to="/admin/overview" icon={<Shield className="w-5 h-5" />} label="Admin Panel" onClick={onMobileLinkClick} showExpanded={true} />
        )}
      </div>

      {/* Footer sections - pinned to bottom */}
      <div className="mt-auto flex flex-col">
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
          <SidebarItem to="/settings" icon={<Cog className="w-5 h-5" />} label={t("nav.settings")} onClick={onMobileLinkClick} showExpanded={true} />
          <SidebarItem to="/help-center" icon={<HelpCircle className="w-5 h-5" />} label={t("nav.helpCenter")} onClick={onMobileLinkClick} showExpanded={true} />
        </div>

        {/* Theme Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <ThemeToggle />
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback className="text-xs">{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
          </div>
          <button onClick={() => setShowLogoutModal(true)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ================================
// MAIN SIDEBAR COMPONENT
// ================================
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isNightMode, user, loadingUser } = useContext(DashboardContext);
  const { t } = useTranslation("sidebar");
  
  // ADD THIS: Detect if we're on admin route
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (user === null) return <div className="sidebar-loading"><p>Loading...</p></div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // On mobile, always show expanded content regardless of collapsed state
  const shouldShowExpanded = isMobileOpen || !isMobile;

  // CHOOSE WHICH SIDEBAR TO RENDER
  const SidebarContentComponent = isAdminRoute ? AdminSidebar : UserSidebar;

  return (
    <>
      {/* Animated Mobile Hamburger Toggle */}
      {isMobile && (
        <button 
          className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          onClick={toggleMobileSidebar}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed md:relative left-0 top-0 h-full bg-white dark:bg-gray-950 z-40 md:z-auto transition-all duration-300 ${
          isMobileOpen ? 'w-64' : '-translate-x-full'
        } md:translate-x-0 w-64 md:flex md:flex-col border-r border-gray-200 dark:border-gray-800`}
        onMouseEnter={() => !isMobile && setCollapsed(false)}
        onMouseLeave={() => !isMobile && setCollapsed(true)}
      >
        <SidebarContentComponent
          collapsed={collapsed && !isMobile}
          toggleSidebar={() => !isMobile && setCollapsed((prev) => !prev)}
          user={user}
          setShowLogoutModal={setShowLogoutModal}
          onMobileLinkClick={() => setIsMobileOpen(false)}
          isMobile={isMobile}
          isMobileOpen={isMobileOpen}
        />
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t("logout.title")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t("logout.description")}</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" onClick={() => setShowLogoutModal(false)}>
                {t("logout.cancel")}
              </button>
              <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors" onClick={handleLogout}>
                {t("logout.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// SidebarItem component remains the same
const SidebarItem = ({
  to,
  icon,
  label,
  collapsed,
  onClick,
  showExpanded,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-accent/10 text-accent font-medium'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`
      }
      onClick={onClick}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {showExpanded && <span className="text-sm">{label}</span>}
    </NavLink>
  );
};

export default Sidebar;