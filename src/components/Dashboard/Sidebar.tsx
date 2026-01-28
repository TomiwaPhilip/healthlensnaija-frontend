// src/components/Sidebar.jsx
import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; // ADD useLocation
import {
  FaHome,
  FaPen,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBook,
  FaUserShield,
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaRobot,
  FaComments,
  FaTools,
  FaArrowLeft,
  FaListAlt,
  FaEnvelope
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { DashboardContext } from "../../context/DashboardContext";
import "../../styles/sidebar.css";
import { useTranslation } from "react-i18next";

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
    <>
      {/* Header with white background for logo */}
      <div className="sidebar-header">
        <div className={`sidebar-header-content ${collapsed && !isMobile ? "collapsed" : ""}`}>
          {showExpanded && (
            <div className="sidebar-logo-container">
              <img
                src={logo}
                alt="Nigeria Health Watch"
                className="sidebar-logo"
              />
            </div>
          )}
          
          {/* Desktop Toggle Button - Hide on mobile */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle-btn"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="hamburger-icon">
                <span className="hamburger-line line-1"></span>
                <span className="hamburger-line line-2"></span>
                <span className="hamburger-line line-3"></span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links - ADMIN VERSION */}
      <div className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <SidebarItem
            to="/admin/overview"
            icon={<FaChartBar />}
            label="Overview"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/users"
            icon={<FaUsers />}
            label="Users"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/content"
            icon={<FaFileAlt />}
            label="Content"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/ai-training"
            icon={<FaRobot />}
            label="AI Training"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/chats"
            icon={<FaComments />}
            label="Chats"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/testimonials"
            icon={<FaListAlt />}
            label="Testimonials"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/support"
            icon={<FaUserShield />}
            label="Support"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/faq"
            icon={<FaQuestionCircle />}
            label="FAQs"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/contact"
            icon={<FaEnvelope />}
            label="Contact Messages"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/admin/tools"
            icon={<FaTools />}
            label="Tools"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />

          {/* Back to User Dashboard */}
          <SidebarItem
            to="/dashboard"
            icon={<FaArrowLeft />}
            label="Back to Dashboard"
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
        </ul>
      </div>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <ul className="sidebar-footer-list">
          <SidebarItem
            to="/settings"
            icon={<FaCog />}
            label={t("nav.settings")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/help-center"
            icon={<FaQuestionCircle />}
            label={t("nav.helpCenter")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
        </ul>

        {/* User Profile Section */}
        <div className={`sidebar-user ${collapsed && !isMobile ? "collapsed" : ""}`}>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="User"
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-initials">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
          {showExpanded && (
            <>
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">
                  {`${user.firstName} ${user.lastName}`}
                </p>
                <p className="sidebar-user-role">
                  {user.role || "Member"}
                </p>
              </div>
              <button
                className="sidebar-logout-btn"
                onClick={() => setShowLogoutModal(true)}
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </button>
            </>
          )}
        </div>
      </div>
    </>
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

  // On mobile, always show expanded content
  const showExpanded = !collapsed || isMobile;

  return (
    <>
      {/* Header with white background for logo */}
      <div className="sidebar-header">
        <div className={`sidebar-header-content ${collapsed && !isMobile ? "collapsed" : ""}`}>
          {showExpanded && (
            <div className="sidebar-logo-container">
              <img
                src={logo}
                alt="Nigeria Health Watch"
                className="sidebar-logo"
              />
            </div>
          )}
          
          {/* Desktop Toggle Button - Hide on mobile */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle-btn"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className="hamburger-icon">
                <span className="hamburger-line line-1"></span>
                <span className="hamburger-line line-2"></span>
                <span className="hamburger-line line-3"></span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <SidebarItem
            to="/dashboard"
            icon={<FaHome />}
            label={t("nav.dashboard")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/generate-story"
            icon={<FaPen />}
            label={t("nav.startWriting")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/resources"
            icon={<FaBook />}
            label={t("nav.resources")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />

          {/* Admin-only link */}
          {user?.role === "Admin" && (
            <SidebarItem
              to="/admin/overview"  // CHANGED FROM /admin to /admin/overview
              icon={<FaUserShield />}
              label={t("nav.admin")}
              collapsed={collapsed && !isMobile}
              onClick={onMobileLinkClick}
              showExpanded={showExpanded}
            />
          )}
        </ul>
      </div>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <ul className="sidebar-footer-list">
          <SidebarItem
            to="/settings"
            icon={<FaCog />}
            label={t("nav.settings")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
          <SidebarItem
            to="/help-center"
            icon={<FaQuestionCircle />}
            label={t("nav.helpCenter")}
            collapsed={collapsed && !isMobile}
            onClick={onMobileLinkClick}
            showExpanded={showExpanded}
          />
        </ul>

        {/* User Profile Section */}
        <div className={`sidebar-user ${collapsed && !isMobile ? "collapsed" : ""}`}>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="User"
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-initials">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
          {showExpanded && (
            <>
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">
                  {`${user.firstName} ${user.lastName}`}
                </p>
                <p className="sidebar-user-role">
                  {user.role || "Member"}
                </p>
              </div>
              <button
                className="sidebar-logout-btn"
                onClick={() => setShowLogoutModal(true)}
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </button>
            </>
          )}
        </div>
      </div>
    </>
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
      <button 
        className={`sidebar-mobile-toggle ${isMobileOpen ? 'open' : ''}`}
        onClick={toggleMobileSidebar}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        <div className="hamburger-icon">
          <span className="hamburger-line line-1"></span>
          <span className="hamburger-line line-2"></span>
          <span className="hamburger-line line-3"></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-overlay"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`sidebar-container ${collapsed && !isMobile ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""} ${isNightMode ? "night-mode" : ""}`}
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
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <h2>{t("logout.title")}</h2>
            <p>{t("logout.description")}</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                {t("logout.cancel")}
              </button>
              <button className="logout-modal-confirm" onClick={handleLogout}>
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
  const { isNightMode } = useContext(DashboardContext);
  
  return (
    <li className="sidebar-item-wrapper">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `sidebar-item ${collapsed ? "collapsed" : ""} ${isActive ? "active" : ""} ${isNightMode ? "night-mode" : ""}`
        }
        onClick={onClick}
      >
        <span className="sidebar-item-icon">{icon}</span>
        {showExpanded && (
          <span className="sidebar-item-label">{label}</span>
        )}
      </NavLink>
    </li>
  );
};

export default Sidebar;