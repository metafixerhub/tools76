import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, FileDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">FormAdmin</div>
            
            <nav className="flex-col gap-2" style={{ flex: 1 }}>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} />
                    <span>Overview</span>
                </NavLink>
                
                <NavLink to="/dashboard/submissions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Submissions</span>
                </NavLink>

                <NavLink to="/dashboard/export" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileDown size={20} />
                    <span>Export Data</span>
                </NavLink>

                <NavLink to="/dashboard/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Form Settings</span>
                </NavLink>
            </nav>

            <div style={{ padding: '1.5rem' }}>
                <button onClick={logout} className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontWeight: 500, width: '100%' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
