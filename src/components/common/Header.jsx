import React, { useState, useEffect } from 'react';  
import { Navbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';  
import { Link, useNavigate, useLocation } from 'react-router-dom';  
import { FaUser, FaBell, FaSignOutAlt, FaCog, FaHistory, FaWallet } from 'react-icons/fa';  
import { useAuth } from '../../contexts/AuthContext';  
import logo from '../../assets/logo.svg';  
import './Header.css';  

const Header = () => {  
  const { user, logout, isAuthenticated } = useAuth();  
  const navigate = useNavigate();  
  const location = useLocation();  
  const [scrolled, setScrolled] = useState(false);  
  const [notifications, setNotifications] = useState([]);  

  // Track scrolling for navbar styling  
  useEffect(() => {  
    const handleScroll = () => {  
      setScrolled(window.scrollY > 50);  
    };  

    window.addEventListener('scroll', handleScroll);  
    return () => window.removeEventListener('scroll', handleScroll);  
  }, []);  

  // Mock notifications - in a real app, these would come from a backend  
  useEffect(() => {  
    if (isAuthenticated) {  
      setNotifications([  
        { id: 1, text: '您的骑行已成功完成', read: false, time: '10分钟前' },  
        { id: 2, text: '新优惠券已添加到您的账户', read: true, time: '昨天' }  
      ]);  
    }  
  }, [isAuthenticated]);  

  const handleLogout = () => {  
    logout();  
    navigate('/login');  
  };  

  const unreadNotifications = notifications.filter(n => !n.read).length;  
  
  // Determine which nav items to show based on path  
  const isAdminPanel = location.pathname.includes('/admin');  
  
  return (  
    <Navbar   
      expand="lg"   
      fixed="top"  
      className={`${scrolled ? 'scrolled' : ''} ${isAdminPanel ? 'admin-header' : ''}`}  
      variant={isAdminPanel ? 'dark' : scrolled ? 'light' : 'dark'}  
    >  
      <Container fluid={isAdminPanel}>  
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">  
          <img src={logo} alt="ScooterGo Logo" height="30" className="me-2" />  
          <span className="fw-bold">ScooterGo</span>  
          {isAdminPanel && <Badge bg="warning" text="dark" className="ms-2">管理面板</Badge>}  
        </Navbar.Brand>  

        <Navbar.Toggle aria-controls="basic-navbar-nav" />  
        <Navbar.Collapse id="basic-navbar-nav">  
          {!isAdminPanel && (  
            <Nav className="me-auto">  
              <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>  
                首页  
              </Nav.Link>  
              <Nav.Link as={Link} to="/scooters" className={location.pathname.includes('/scooters') ? 'active' : ''}>  
                查找车辆  
              </Nav.Link>  
              <Nav.Link as={Link} to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>  
                收费标准  
              </Nav.Link>  
              <Nav.Link as={Link} to="/about" className={location.pathname === '/about' ? 'active' : ''}>  
                关于我们  
              </Nav.Link>  
            </Nav>  
          )}  

          {isAdminPanel && (  
            <Nav className="me-auto">  
              <Nav.Link as={Link} to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>  
                仪表盘  
              </Nav.Link>  
              <Nav.Link as={Link} to="/admin/scooters" className={location.pathname.includes('/admin/scooters') ? 'active' : ''}>  
                车辆管理  
              </Nav.Link>  
              <Nav.Link as={Link} to="/admin/users" className={location.pathname.includes('/admin/users') ? 'active' : ''}>  
                用户管理  
              </Nav.Link>  
              <Nav.Link as={Link} to="/admin/issues" className={location.pathname.includes('/admin/issues') ? 'active' : ''}>  
                故障管理  
              </Nav.Link>  
              <Nav.Link as={Link} to="/admin/pricing" className={location.pathname.includes('/admin/pricing') ? 'active' : ''}>  
                价格设置  
              </Nav.Link>  
            </Nav>  
          )}  

          <Nav>  
            {isAuthenticated ? (  
              <>  
                {!isAdminPanel && (  
                  <Dropdown align="end" className="me-2">  
                    <Dropdown.Toggle variant="link" id="notification-dropdown" className="nav-link position-relative p-0 px-2">  
                      <FaBell />  
                      {unreadNotifications > 0 && (  
                        <Badge   
                          pill   
                          bg="danger"   
                          className="position-absolute top-0 end-0 notification-badge"  
                        >  
                          {unreadNotifications}  
                        </Badge>  
                      )}  
                    </Dropdown.Toggle>  
                    <Dropdown.Menu className="notification-dropdown">  
                      <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">  
                        <span className="fw-bold">通知</span>  
                        {notifications.length > 0 && (  
                          <Button variant="link" size="sm" className="p-0">  
                            标记全部已读  
                          </Button>  
                        )}  
                      </div>  
                      <div className="notification-scrollable">  
                        {notifications.length === 0 ? (  
                          <div className="text-center text-muted py-3">  
                            没有新通知  
                          </div>  
                        ) : (  
                          notifications.map(notification => (  
                            <Dropdown.Item   
                              key={notification.id}   
                              className={`notification-item ${notification.read ? 'read' : 'unread'}`}  
                            >  
                              <div className="d-flex justify-content-between">  
                                <span>{notification.text}</span>  
                                {!notification.read && <div className="unread-indicator"></div>}  
                              </div>  
                              <small className="text-muted">{notification.time}</small>  
                            </Dropdown.Item>  
                          ))  
                        )}  
                      </div>  
                      {notifications.length > 0 && (  
                        <div className="px-3 py-2 border-top text-center">  
                          <Link to="/notifications" className="text-decoration-none">  
                            查看全部  
                          </Link>  
                        </div>  
                      )}  
                    </Dropdown.Menu>  
                  </Dropdown>  
                )}  

                <Dropdown align="end">  
                  <Dropdown.Toggle variant="link" id="user-dropdown" className="nav-link d-flex align-items-center p-0 px-2">  
                    <div className="user-avatar me-2">  
                      {user?.avatarUrl ? (  
                        <img src={user.avatarUrl} alt={user.name} />  
                      ) : (  
                        <div className="default-avatar">  
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || <FaUser />}  
                        </div>  
                      )}  
                    </div>  
                    <span className="d-none d-md-inline">{user?.name || '用户'}</span>  
                  </Dropdown.Toggle>  
                  <Dropdown.Menu>  
                    <Dropdown.Item as={Link} to="/profile">  
                      <FaUser className="me-2" /> 个人资料  
                    </Dropdown.Item>  
                    {!isAdminPanel && (  
                      <>  
                        <Dropdown.Item as={Link} to="/rentals">  
                          <FaHistory className="me-2" /> 骑行记录  
                        </Dropdown.Item>  
                        <Dropdown.Item as={Link} to="/wallet">  
                          <FaWallet className="me-2" /> 我的钱包  
                        </Dropdown.Item>  
                      </>  
                    )}  
                    <Dropdown.Item as={Link} to="/settings">  
                      <FaCog className="me-2" /> 设置  
                    </Dropdown.Item>  
                    <Dropdown.Divider />  
                    <Dropdown.Item onClick={handleLogout}>  
                      <FaSignOutAlt className="me-2" /> 退出登录  
                    </Dropdown.Item>  
                  </Dropdown.Menu>  
                </Dropdown>  
              </>  
            ) : (  
              <div className="d-flex align-items-center">  
                <Button   
                  variant="outline-light"   
                  className="me-2"  
                  onClick={() => navigate('/login')}  
                >  
                  登录  
                </Button>  
                <Button   
                  variant="primary"  
                  onClick={() => navigate('/register')}  
                >  
                  注册  
                </Button>  
              </div>  
            )}  
          </Nav>  
        </Navbar.Collapse>  
      </Container>  
    </Navbar>  
  );  
};  

export default Header;