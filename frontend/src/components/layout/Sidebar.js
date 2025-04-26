'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiUsers, FiBook, FiMessageSquare,
  FiAward, FiMessageCircle, FiImage, FiLayout,
  FiMenu, FiChevronDown, FiChevronRight, FiLogOut,
  FiPackage
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <FiHome size={20} />,
    path: '/admin/dashboard',
  },
  {
    title: 'Users',
    icon: <FiUsers size={20} />,
    submenu: true,
    submenuItems: [
      { title: 'Students', path: '/admin/students' },
      { title: 'Tutors', path: '/admin/tutors' },
    ],
  },
  {
    title: 'Diaries',
    icon: <FiBook size={20} />,
    path: '/admin/diaries',
  },
  {
    title: 'Chats',
    icon: <FiMessageSquare size={20} />,
    path: '/admin/chats',
  },
  {
    title: 'Awards',
    icon: <FiAward size={20} />,
    path: '/admin/awards',
  },
  {
    title: 'Forums',
    icon: <FiMessageCircle size={20} />,
    path: '/admin/forums',
  },
  {
    title: 'Assets',
    icon: <FiPackage size={20} />,
    submenu: true,
    submenuItems: [
      { title: 'Asset Categories', path: '/admin/asset-categories' },
      { title: 'Assets', path: '/admin/assets' },
    ],
  },
  {
    title: 'Skins',
    icon: <FiLayout size={20} />,
    path: '/admin/skins',
  },
  {
    title: 'Images',
    icon: <FiImage size={20} />,
    path: '/admin/images',
  },
];

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const pathname = usePathname();
  const { logout } = useAuth();

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        const collapsed = JSON.parse(savedState);
        setIsCollapsed(collapsed);
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  }, []);

  // Save sidebar state to localStorage when it changes and notify parent
  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
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

  return (
    <div
      className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white fixed left-0 top-0 transition-all duration-300 ease-in-out z-50`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-indigo-800 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">
              헬로 잉글리시
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-indigo-800 transition-colors"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-transparent">
          <ul className="space-y-2 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                        isSubmenuActive(item.submenuItems)
                          ? 'bg-indigo-800 text-white'
                          : 'text-gray-300 hover:bg-indigo-800 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {openSubmenu === index ? <FiChevronDown /> : <FiChevronRight />}
                        </>
                      )}
                    </button>
                    {openSubmenu === index && !isCollapsed && (
                      <ul className="pl-10 mt-1 space-y-1">
                        {item.submenuItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link href={subItem.path}>
                              <span className={`block p-2 rounded-md transition-colors ${
                                isActive(subItem.path)
                                  ? 'bg-indigo-700 text-white'
                                  : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
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
                    <span className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-800 text-white'
                        : 'text-gray-300 hover:bg-indigo-800 hover:text-white'
                    }`}>
                      <span className="mr-3">{item.icon}</span>
                      {!isCollapsed && <span>{item.title}</span>}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={logout}
            className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-indigo-800 hover:text-white transition-colors"
          >
            <span className="mr-3"><FiLogOut size={20} /></span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
