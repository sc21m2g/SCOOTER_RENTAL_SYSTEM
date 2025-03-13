import React, { useState } from 'react';  
import { Form, Button, Card, Container, Alert, Spinner, Row, Col } from 'react-bootstrap';  
import { Link, useNavigate } from 'react-router-dom';  
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';  
import { useAuth } from '../../contexts/AuthContext';  
import authService from '../../services/auth.service';  
import { validateEmail, validatePassword, validatePhone } from '../../utils/validation';  
import './Register.css';  

const Register = () => {  
  const [formData, setFormData] = useState({  
    fullName: '',  
    email: '',  
    phone: '',  
    password: '',  
    confirmPassword: '',  
    agreeTerms: false  
  });  
  
  const [errors, setErrors] = useState({});  
  const [loading, setLoading] = useState(false);  
  const [generalError, setGeneralError] = useState('');  
  
  const { login } = useAuth();  
  const navigate = useNavigate();  
  
  const handleChange = (e) => {  
    const { name, value, checked, type } = e.target;  
    setFormData({  
      ...formData,  
      [name]: type === 'checkbox' ? checked : value  
    });  
    
    // Clear specific field error when user starts typing  
    if (errors[name]) {  
      setErrors({  
        ...errors,  
        [name]: ''  
      });  
    }  
  };  
  
  const validateForm = () => {  
    const newErrors = {};  
    
    if (!formData.fullName.trim()) {  
      newErrors.fullName = '请输入您的姓名';  
    }  
    
    if (!formData.email.trim()) {  
      newErrors.email = '请输入电子邮箱';  
    } else if (!validateEmail(formData.email)) {  
      newErrors.email = '请输入有效的电子邮箱';  
    }  
    
    if (formData.phone && !validatePhone(formData.phone)) {  
      newErrors.phone = '请输入有效的手机号码';  
    }  
    
    if (!formData.password) {  
      newErrors.password = '请输入密码';  
    } else if (!validatePassword(formData.password)) {  
      newErrors.password = '密码必须包含至少8个字符，包括字母和数字';  
    }  
    
    if (formData.password !== formData.confirmPassword) {  
      newErrors.confirmPassword = '两次输入的密码不一致';  
    }  
    
    if (!formData.agreeTerms) {  
      newErrors.agreeTerms = '您必须同意服务条款';  
    }  
    
    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    
    // Reset general error  
    setGeneralError('');  
    
    // Validate form  
    if (!validateForm()) {  
      return;  
    }  
    
    try {  
      setLoading(true);  
      
      // Call registration service  
      const response = await authService.register({  
        fullName: formData.fullName,  
        email: formData.email,  
        phone: formData.phone,  
        password: formData.password  
      });  
      
      // Automatically log user in  
      login(response.user, response.token);  
      
      // Store token in session storage  
      sessionStorage.setItem('token', response.token);  
      
      // Redirect to scooters page  
      navigate('/scooters');  
      
    } catch (err) {  
      console.error('Registration error:', err);  
      
      if (err.response?.data?.field) {  
        // Field-specific error  
        setErrors({  
          ...errors,  
          [err.response.data.field]: err.response.data.message  
        });  
      } else {  
        // General error  
        setGeneralError(err.response?.data?.message || '注册失败，请稍后再试');  
      }  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <Container className="register-container">  
      <Card className="register-card">  
        <Card.Body>  
          <div className="text-center mb-4">  
            <h2 className="register-title">创建账户</h2>  
            <p className="text-muted">填写以下信息注册新账户</p>  
          </div>  
          
          {generalError && (  
            <Alert variant="danger" className="mb-4">  
              {generalError}  
            </Alert>  
          )}  
          
          <Form onSubmit={handleSubmit}>  
            <Form.Group controlId="fullName" className="mb-3">  
              <Form.Label>姓名</Form.Label>  
              <div className="input-group">  
                <span className="input-group-text">  
                  <FaUser />  
                </span>  
                <Form.Control  
                  type="text"  
                  name="fullName"  
                  placeholder="输入您的姓名"  
                  value={formData.fullName}  
                  onChange={handleChange}  
                  isInvalid={!!errors.fullName}  
                  disabled={loading}  
                />  
                <Form.Control.Feedback type="invalid">  
                  {errors.fullName}  
                </Form.Control.Feedback>  
              </div>  
            </Form.Group>  
            
            <Row>  
              <Col md={6}>  
                <Form.Group controlId="email" className="mb-3">  
                  <Form.Label>电子邮箱</Form.Label>  
                  <div className="input-group">  
                    <span className="input-group-text">  
                      <FaEnvelope />  
                    </span>  
                    <Form.Control  
                      type="email"  
                      name="email"  
                      placeholder="输入您的电子邮箱"  
                      value={formData.email}  
                      onChange={handleChange}  
                      isInvalid={!!errors.email}  
                      disabled={loading}  
                    />  
                    <Form.Control.Feedback type="invalid">  
                      {errors.email}  
                    </Form.Control.Feedback>  
                  </div>  
                </Form.Group>  
              </Col>  
              
              <Col md={6}>  
                <Form.Group controlId="phone" className="mb-3">  
                  <Form.Label>手机号码 (可选)</Form.Label>  
                  <div className="input-group">  
                    <span className="input-group-text">  
                      <FaPhone />  
                    </span>  
                    <Form.Control  
                      type="tel"  
                      name="phone"  
                      placeholder="输入您的手机号码"  
                      value={formData.phone}  
                      onChange={handleChange}  
                      isInvalid={!!errors.phone}  
                      disabled={loading}  
                    />  
                    <Form.Control.Feedback type="invalid">  
                      {errors.phone}  
                    </Form.Control.Feedback>  
                  </div>  
                </Form.Group>  
              </Col>  
            </Row>  
            
            <Form.Group controlId="password" className="mb-3">  
              <Form.Label>密码</Form.Label>  
              <div className="input-group">  
                <span className="input-group-text">  
                  <FaLock />  
                </span>  
                <Form.Control  
                  type="password"  
                  name="password"  
                  placeholder="输入密码"  
                  value={formData.password}  
                  onChange={handleChange}  
                  isInvalid={!!errors.password}  
                  disabled={loading}  
                />  
                <Form.Control.Feedback type="invalid">  
                  {errors.password}  
                </Form.Control.Feedback>  
              </div>  
              <Form.Text className="text-muted">  
                密码必须包含至少8个字符，包括字母和数字。  
              </Form.Text>  
            </Form.Group>  
            
            <Form.Group controlId="confirmPassword" className="mb-4">  
              <Form.Label>确认密码</Form.Label>  
              <div className="input-group">  
                <span className="input-group-text">  
                  <FaLock />  
                </span>  
                <Form.Control  
                  type="password"  
                  name="confirmPassword"  
                  placeholder="再次输入密码"  
                  value={formData.confirmPassword}  
                  onChange={handleChange}  
                  isInvalid={!!errors.confirmPassword}  
                  disabled={loading}  
                />  
                <Form.Control.Feedback type="invalid">  
                  {errors.confirmPassword}  
                </Form.Control.Feedback>  
              </div>  
            </Form.Group>  
            
            <Form.Group controlId="agreeTerms" className="mb-4">  
              <Form.Check  
                type="checkbox"  
                name="agreeTerms"  
                label={  
                  <span>  
                    我已阅读并同意 <Link to="/terms">服务条款</Link> 和 <Link to="/privacy">隐私政策</Link>  
                  </span>  
                }  
                checked={formData.agreeTerms}  
                onChange={handleChange}  
                isInvalid={!!errors.agreeTerms}  
                disabled={loading}  
              />  
              <Form.Control.Feedback type="invalid">  
                {errors.agreeTerms}  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <div className="d-grid">  
              <Button  
                variant="primary"  
                type="submit"  
                className="register-button"  
                disabled={loading}  
              >  
                {loading ? (  
                  <>  
                    <Spinner  
                      as="span"  
                      animation="border"  
                      size="sm"  
                      role="status"  
                      aria-hidden="true"  
                      className="me-2"  
                    />  
                    注册中...  
                  </>  
                ) : (  
                  <>  
                    <FaUserPlus className="me-2" />  
                    注册  
                  </>  
                )}  
              </Button>  
            </div>  
          </Form>  
          
          <div className="text-center mt-4">  
            <p>  
              已有账户? <Link to="/login">登录</Link>  
            </p>  
          </div>  
        </Card.Body>  
      </Card>  
    </Container>  
  );  
};  

export default Register;