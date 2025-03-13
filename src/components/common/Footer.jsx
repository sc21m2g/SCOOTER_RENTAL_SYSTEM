import React from 'react';  
import { Container, Row, Col, Nav } from 'react-bootstrap';  
import { Link } from 'react-router-dom';  
import { FaFacebookF, FaTwitter, FaInstagram, FaWeixin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';  
import './Footer.css';  
import qrCode from '../../assets/qrcode.png';  
import logo from '../../assets/logo.svg';  

const Footer = () => {  
  const currentYear = new Date().getFullYear();  

  return (  
    <footer className="footer">  
      <Container>  
        <Row className="py-5">  
          <Col lg={4} md={6} className="mb-4 mb-md-0">  
            <div className="d-flex align-items-center mb-3">  
              <img src={logo} alt="ScooterGo Logo" height="30" className="me-2" />  
              <h5 className="mb-0 fw-bold">ScooterGo</h5>  
            </div>  
            <p className="text-muted">  
              ScooterGo致力于提供便捷、环保的城市短途出行解决方案，让您的城市生活更加轻松自由。  
            </p>  
            <div className="d-flex social-links">  
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="me-2">  
                <FaFacebookF />  
              </a>  
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="me-2">  
                <FaTwitter />  
              </a>  
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="me-2">  
                <FaInstagram />  
              </a>  
              <a href="#wechat" className="me-2 wechat-container">  
                <FaWeixin />  
                <img src={qrCode} alt="微信二维码" className="wechat-qrcode" />  
              </a>  
            </div>  
          </Col>  
          
          <Col lg={2} md={6} className="mb-4 mb-md-0">  
            <h6 className="fw-bold mb-3">快速链接</h6>  
            <Nav className="flex-column footer-nav">  
              <Nav.Link as={Link} to="/">首页</Nav.Link>  
              <Nav.Link as={Link} to="/scooters">查找车辆</Nav.Link>  
              <Nav.Link as={Link} to="/pricing">收费标准</Nav.Link>  
              <Nav.Link as={Link} to="/faq">常见问题</Nav.Link>  
              <Nav.Link as={Link} to="/about">关于我们</Nav.Link>  
            </Nav>  
          </Col>  
          
          <Col lg={3} md={6} className="mb-4 mb-md-0">  
            <h6 className="fw-bold mb-3">法律条款</h6>  
            <Nav className="flex-column footer-nav">  
              <Nav.Link as={Link} to="/terms">服务条款</Nav.Link>  
              <Nav.Link as={Link} to="/privacy">隐私政策</Nav.Link>  
              <Nav.Link as={Link} to="/refund-policy">退款政策</Nav.Link>  
              <Nav.Link as={Link} to="/safety">安全指南</Nav.Link>  
              <Nav.Link as={Link} to="/agreement">用户协议</Nav.Link>  
            </Nav>  
          </Col>  
          
          <Col lg={3} md={6}>  
            <h6 className="fw-bold mb-3">联系我们</h6>  
            <div className="contact-info">  
              <div className="d-flex align-items-center mb-2">  
                <FaPhoneAlt className="contact-icon me-2" />  
                <span>400-123-4567</span>  
              </div>  
              <div className="d-flex align-items-center mb-2">  
                <FaEnvelope className="contact-icon me-2" />  
                <span>support@scootergo.com</span>  
              </div>  
              <div className="d-flex align-items-start mb-2">  
                <FaMapMarkerAlt className="contact-icon me-2 mt-1" />  
                <span>上海市浦东新区张江高科技园区博云路2号浦软大厦9层</span>  
              </div>  
            </div>  
          </Col>  
        </Row>  
        
        <hr className="footer-divider" />  
        
        <Row className="py-3">  
          <Col md={6} className="text-center text-md-start">  
            <p className="mb-0 text-muted small">  
              © {currentYear} ScooterGo科技有限公司. 保留所有权利.  
            </p>  
          </Col>  
          <Col md={6} className="text-center text-md-end">  
            <p className="mb-0 text-muted small">  
              <a href="/terms" className="text-muted text-decoration-none">隐私政策</a>  
              <span className="mx-2">|</span>  
              <a href="/privacy" className="text-muted text-decoration-none">服务条款</a>  
              <span className="mx-2">|</span>  
              <a href="/cookies" className="text-muted text-decoration-none">Cookie政策</a>  
            </p>  
          </Col>  
        </Row>  
        
        <div className="app-download text-center py-4">  
          <h6 className="fw-bold mb-3">下载我们的APP</h6>  
          <div className="d-flex justify-content-center gap-2">  
            <a href="#appstore" className="app-badge">  
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" height="40" />  
            </a>  
            <a href="#googleplay" className="app-badge">  
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" height="40" />  
            </a>  
          </div>  
        </div>  
      </Container>  
    </footer>  
  );  
};  

export default Footer;