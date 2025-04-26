'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/hooks/useAuth';
import {
  FiHome, FiUsers, FiBook, FiMessageSquare,
  FiAward, FiMessageCircle, FiImage, FiLayout,
  FiMenu, FiChevronDown, FiChevronRight, FiLogOut,
  FiPackage, FiSun, FiCalendar, FiSettings,
  FiBarChart2, FiFileText, FiUser
} from 'react-icons/fi';

// Define menu items for each role
const adminMenuItems = [
  {
    title: 'Dashboard',
    icon: <FiHome size={16} />,
    path: '/admin/dashboard',
  },
  {
    title: 'Users',
    icon: <FiUsers size={16} />,
    submenu: true,
    submenuItems: [
      { title: 'Students', path: '/admin/students' },
      { title: 'Tutors', path: '/admin/tutors' },
    ],
  },
  {
    title: 'Diaries',
    icon: <FiBook size={16} />,
    path: '/admin/diaries',
  },
  {
    title: 'Chats',
    icon: <FiMessageSquare size={16} />,
    path: '/admin/chats',
  },
  {
    title: 'Awards',
    icon: <FiAward size={16} />,
    path: '/admin/awards',
  },
  {
    title: 'Forums',
    icon: <FiMessageCircle size={16} />,
    path: '/admin/forums',
  },
  {
    title: 'Assets',
    icon: <FiPackage size={16} />,
    submenu: true,
    submenuItems: [
      { title: 'Asset Categories', path: '/admin/asset-categories' },
      { title: 'Assets', path: '/admin/assets' },
    ],
  },
  {
    title: 'Skins',
    icon: <FiLayout size={16} />,
    path: '/admin/skins',
  },
  {
    title: 'Images',
    icon: <FiImage size={16} />,
    path: '/admin/images',
  },
];

const tutorMenuItems = [
  {
    title: 'Dashboard',
    icon: <FiHome size={16} />,
    path: '/tutor/dashboard',
  },
  {
    title: 'My Students',
    icon: <FiUsers size={16} />,
    path: '/tutor/students',
  },
  {
    title: 'Diaries',
    icon: <FiBook size={16} />,
    path: '/tutor/diaries',
  },
  {
    title: 'Chats',
    icon: <FiMessageSquare size={16} />,
    path: '/tutor/chats',
  },
  {
    title: 'Schedule',
    icon: <FiCalendar size={16} />,
    path: '/tutor/schedule',
  },
  {
    title: 'Forums',
    icon: <FiMessageCircle size={16} />,
    path: '/tutor/forums',
  },
  {
    title: 'Profile',
    icon: <FiUser size={16} />,
    path: '/tutor/profile',
  },
];

const studentMenuItems = [
  {
    title: 'Dashboard',
    icon: <FiHome size={16} />,
    path: '/student',
  },
  {
    title: 'My Diary',
    icon: <FiBook size={16} />,
    path: '/student/diaries',
  },
  {
    title: 'Chat with Tutor',
    icon: <FiMessageSquare size={16} />,
    path: '/student/chats',
  },
  {
    title: 'My Awards',
    icon: <FiAward size={16} />,
    path: '/student/awards',
  },
  {
    title: 'Forums',
    icon: <FiMessageCircle size={16} />,
    path: '/student/forums',
  },
  {
    title: 'Progress',
    icon: <FiBarChart2 size={16} />,
    path: '/student/progress',
  },
  {
    title: 'Resources',
    icon: <FiFileText size={16} />,
    path: '/student/resources',
  },
  {
    title: 'Profile',
    icon: <FiUser size={16} />,
    path: '/student/profile',
  },
];

const CommonSidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Get menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    // Log user data for debugging
    console.log('User data in CommonSidebar:', user);

    // Extract role from user object - handle different possible structures
    let userRole = null;

    // Try to get role directly from user object
    if (user.role) {
      userRole = user.role;
    }
    // Try to get role from user.data if it exists
    else if (user.data && user.data.role) {
      userRole = user.data.role;
    }
    // Check if we can determine role from the pathname
    else {
      const path = pathname;
      if (path.startsWith('/admin')) {
        userRole = 'admin';
      } else if (path.startsWith('/tutor')) {
        userRole = 'tutor';
      } else if (path.startsWith('/student')) {
        userRole = 'student';
      }
    }

    console.log('Detected user role:', userRole);

    // Force specific menu items based on the current path as a fallback
    if (pathname.startsWith('/admin')) {
      console.log('Forcing admin menu items based on path');
      return adminMenuItems;
    } else if (pathname.startsWith('/tutor')) {
      console.log('Forcing tutor menu items based on path');
      return tutorMenuItems;
    } else if (pathname.startsWith('/student')) {
      console.log('Forcing student menu items based on path');
      return studentMenuItems;
    }

    // If we have a valid role, return the appropriate menu items
    switch (userRole) {
      case 'admin':
        console.log('Returning admin menu items');
        return adminMenuItems;
      case 'tutor':
        console.log('Returning tutor menu items');
        return tutorMenuItems;
      case 'student':
        console.log('Returning student menu items');
        return studentMenuItems;
      default:
        console.log('No matching role found, returning empty menu');
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Load sidebar state from cookies on component mount
  useEffect(() => {
    try {
      const savedState = Cookies.get('sidebarCollapsed');
      if (savedState !== null) {
        const collapsed = JSON.parse(savedState);
        setIsCollapsed(collapsed);
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  }, []);

  // Save sidebar state to cookies when it changes and notify parent
  useEffect(() => {
    try {
      Cookies.set('sidebarCollapsed', JSON.stringify(isCollapsed), { expires: 7 }); // Expires in 7 days
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  const isSubmenuActive = (items) => {
    return items.some(item => pathname === item.path);
  };

  // Get the title based on user role or current path
  const getSidebarTitle = () => {
    if (!user) return 'Hello English';

    // Determine role from path if needed
    if (pathname.startsWith('/admin')) {
      return 'Admin Panel';
    } else if (pathname.startsWith('/tutor')) {
      return 'Tutor Portal';
    } else if (pathname.startsWith('/student')) {
      return '헬로 잉글리시';
    }

    // Try to get role from user object
    let userRole = null;
    if (user.role) {
      userRole = user.role;
    } else if (user.data && user.data.role) {
      userRole = user.data.role;
    }

    switch (userRole) {
      case 'admin':
        return 'Admin Panel';
      case 'tutor':
        return 'Tutor Portal';
      case 'student':
        return '헬로 잉글리시';
      default:
        return 'Hello English';
    }
  };

  return (
    <div
      className={`sidebar-container ${isCollapsed ? 'w-16' : 'w-56'} h-screen bg-gradient-to-b from-gray-800 to-black text-white fixed left-0 top-0 transition-all duration-300 ease-in-out z-50 shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="h-16 px-4 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed ? (
            <div>
              <h1 className="text-sm font-bold text-white">
                {getSidebarTitle()}
              </h1>
              {user && (
                <p className="text-xs text-gray-400">
                  Role: {pathname.startsWith('/admin') ? 'admin' :
                         pathname.startsWith('/tutor') ? 'tutor' :
                         pathname.startsWith('/student') ? 'student' :
                         user.role || 'unknown'}
                </p>
              )}
            </div>
          ) : (
            null
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-700 hover:text-yellow-400 transition-colors"
          >
            <FiMenu size={18} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`w-full flex items-center py-2 px-2 rounded-md transition-all duration-200 ${isSubmenuActive(item.submenuItems)
                          ? 'bg-yellow-500 text-black font-medium shadow-md'
                          : 'text-white hover:bg-gray-700 hover:text-yellow-400 hover:shadow-md hover:translate-x-1'
                        }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-sm">{item.title}</span>
                          {openSubmenu === index ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                        </>
                      )}
                    </button>
                    {openSubmenu === index && !isCollapsed && (
                      <ul className="pl-8 mt-1 space-y-1">
                        {item.submenuItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link href={subItem.path}>
                              <span className={`block py-1 px-2 rounded-md transition-all duration-200 text-xs ${isActive(subItem.path)
                                  ? 'bg-yellow-500 text-black font-medium shadow-sm'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-400 hover:shadow-sm hover:translate-x-1'
                                }`}>
                                {subItem.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link href={item.path}>
                    <span className={`flex items-center py-2 px-2 rounded-md transition-all duration-200 ${isActive(item.path)
                        ? 'bg-yellow-500 text-black font-medium shadow-md'
                        : 'text-white hover:bg-gray-700 hover:text-yellow-400 hover:shadow-md hover:translate-x-1'
                      }`}>
                      <span className="mr-2">{item.icon}</span>
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="py-2 px-3 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center py-2 px-2 rounded-md text-white hover:bg-gray-700 hover:text-yellow-400 hover:shadow-md hover:translate-x-1 transition-all duration-200"
          >
            <span className="mr-2"><FiLogOut size={16} /></span>
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonSidebar;
