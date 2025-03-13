import React, { useState, useEffect } from 'react';  
import { Nav, Button } from 'react-bootstrap';  
import { Link, useLocation } from 'react-router-dom';  
import {   
  FaTachometerAlt,   
  FaMotorcycle,   
  FaUsers,   
  FaClipboardList,   
  FaCog,   
  FaWallet,  
  FaChartLine,  
  FaBell,  
  FaMapMarkerAlt,  
  FaAngleLeft,  
  FaAngleRight,  
  FaQuestion,  
  FaUserCircle,  
  FaSignOutAlt,  
  FaHistory  
} from 'react-icons/fa';  
import { useAuth } from '../../contexts/AuthContext';  
import './Sidebar.css';  

const Sidebar = ({ isAdmin = false }) => {  
  const location = useLocation();  
  const { user, logout } = useAuth();  
  const [collapsed, setCollapsed] = useState(false);  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);  

  // On mobile devices, sidebar should be collapsed by default  
  useEffect(() => {  
    const handleResize = () => {  
      setIsMobile(window.innerWidth < 992);  
      if (window.innerWidth < 992) {  
        setCollapsed(true);  
      }  
    };  

    window.addEventListener('resize', handleResize);  
    handleResize();  
    
    return () => window.removeEventListener('resize', handleResize);  
  }, []);  

  const toggleSidebar = () => setCollapsed(!collapsed);  
  
  // Define navigation items based on user role  
  const adminNavItems = [  
    { path: '/admin', name: '仪表盘', icon: <FaTachometerAlt /> },  
    { path: '/admin/scooters', name: '车辆管理', icon: <FaMotorcycle /> },  
    { path: '/admin/users', name: '用户管理', icon: <FaUsers /> },  
    { path: '/admin/issues', name: '故障管理', icon: <FaClipboardList /> },  
    { path: '/admin/pricing', name: '价格设置', icon: <FaWallet /> },  
    { path: '/admin/analytics', name: '数据分析', icon: <FaChartLine /> },  
    { path: '/admin/notifications', name: '系统通知', icon: <FaBell /> },  
    { path: '/admin/map', name: '车辆地图', icon: <FaMapMarkerAlt /> },  
    { path: '/admin/settings', name: '系统设置', icon: <FaCog /> },  
  ];  
  
  const userNavItems = [  
    { path: '/dashboard', name: '我的主页', icon: <FaTachometerAlt /> },  
    { path: '/profile', name: '个人资料', icon: <FaUserCircle /> },  
    { path: '/rentals', name: '骑行记录', icon: <FaHistory /> },  
    { path: '/wallet', name: '我的钱包', icon: <FaWallet /> },  
    { path: '/map', name: '附近车辆', icon: <FaMapMarkerAlt /> },  
    { path: '/notifications', name: '我的消息', icon: <FaBell /> },  
    { path: '/settings', name: '账户设置', icon: <FaCog /> },  
    { path: '/help', name: '帮助中心', icon: <FaQuestion /> }  
  ];  
  
  const navItems = isAdmin ? adminNavItems : userNavItems;  

  return (  
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>  
      <div className="sidebar-header">  
        {!collapsed && (  
          <div className="logo">  
            <h4 className="mb-0">{isAdmin ? '管理中心' : '用户中心'}</h4>  
          </div>  
        )}  
        <Button   
          variant="link"   
          className="toggle-btn"   
          onClick={toggleSidebar}  
          aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}  
        >  
          {collapsed ? <FaAngleRight /> : <FaAngleLeft />}  
        </Button>  
      </div>  
      
      {!collapsed && (  
        <div className="user-profile">  
          <div className="avatar">  
            {user?.avatarUrl ? (  
              <img src={user.avatarUrl} alt={user.name} />  
            ) : (  
              <FaUserCircle size={40} />  
            )}  
          </div>  
          <div className="user-info">  
            <h6>{user?.name || '用户'}</h6>  
            <small className="text-muted">{isAdmin ? '管理员' : '用户'}</small>  
          </div>  
        </div>  
      )}  
      
      <Nav className="flex-column sidebar-nav">  
        {navItems.map((item) => (  
          <Nav.Item key={item.path}>  
            <Nav.Link   
              as={Link}   
              to={item.path}   
              className={location.pathname === item.path ? 'active' : ''}  
              title={collapsed ? item.name : undefined}  
            >  
              <span className="icon">{item.icon}</span>  
              {!collapsed && <span className="item-name">{item.name}</span>}  
            </Nav.Link>  
          </Nav.Item>  
        ))}  
      </Nav>  
      
      <div className="sidebar-footer">  
        <Button   
          variant="link"   
          className="logout-btn"  
          onClick={logout}  
          title={collapsed ? "退出登录" : undefined}  
        >  
          <FaSignOutAlt />  
          {!collapsed && <span className="ms-2">退出登录</span>}  
        </Button>  
      </div>  
    </div>  
  );  
};  

export default Sidebar;