import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, FileDown } from 'lucide-react';

const Sidebar = () => {

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

        </div>
    );
};

export default Sidebar;
