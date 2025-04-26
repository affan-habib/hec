'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiUsers, FiBook, FiMessageSquare,
  FiAward, FiMessageCircle, FiImage, FiLayout,
  FiMenu, FiChevronDown, FiChevronRight, FiLogOut,
  FiPackage, FiSun
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, selectSidebarState } from '@/redux/slices/sidebarSlice';

const menuItems = [
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

const Sidebar = () => {
  const isCollapsed = useSelector(selectSidebarState);
  const dispatch = useDispatch();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
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
      className={`sidebar-container ${isCollapsed ? 'w-16' : 'w-56'} h-screen bg-gradient-to-b from-gray-800 to-black text-white fixed left-0 top-0 transition-all duration-300 ease-in-out z-50 shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="py-5 px-4 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed ? (
            <h1 className="text-sm font-bold text-white">
              헬로 잉글리시
            </h1>
          ) : (
            null
          )}
          <button
            onClick={handleToggleSidebar}
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
                      {isCollapsed ? (
                        <div className="w-full flex justify-center">{item.icon}</div>
                      ) : (
                        <>
                          <span className="mr-2">{item.icon}</span>
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
                      {isCollapsed ? (
                        <div className="w-full flex justify-center">{item.icon}</div>
                      ) : (
                        <>
                          <span className="mr-2">{item.icon}</span>
                          <span className="text-sm">{item.title}</span>
                        </>
                      )}
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
            {isCollapsed ? (
              <div className="w-full flex justify-center"><FiLogOut size={16} /></div>
            ) : (
              <>
                <span className="mr-2"><FiLogOut size={16} /></span>
                <span className="text-sm">Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
