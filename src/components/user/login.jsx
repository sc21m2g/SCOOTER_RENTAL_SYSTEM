import React, { useState } from 'react';  
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';  
import { Link, useNavigate, useLocation } from 'react-router-dom';  
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';  
import { useAuth } from '../../contexts/AuthContext';  
import authService from '../../services/auth.service';  
import { validateEmail, validatePassword } from '../../utils/validation';  
import './login.css';  

const Login = () => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const [rememberMe, setRememberMe] = useState(false);  
  const [error, setError] = useState('');  
  const [loading, setLoading] = useState(false);  
  
  const { login } = useAuth();  
  const navigate = useNavigate();  
  const location = useLocation();  
  const from = location.state?.from?.pathname || '/scooters';  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    
    // Input validation  
    if (!email || !password) {  
      setError('请输入邮箱和密码');  
      return;  
    }  
    
    if (!validateEmail(email)) {  
      setError('请输入有效的邮箱地址');  
      return;  
    }  
    
    try {  
      setError('');  
      setLoading(true);  
      
      // Call authentication service  
      const response = await authService.login(email, password);  
      
      // Update auth context  
      login(response.user, response.token);  
      
      // Store token in local/session storage based on rememberMe  
      if (rememberMe) {  
        localStorage.setItem('token', response.token);  
      } else {  
        sessionStorage.setItem('token', response.token);  
      }  
      
      // Redirect to intended location or default  
      navigate(from, { replace: true });  
      
    } catch (err) {  
      console.error('Login error:', err);  
      setError(err.response?.data?.message || '登录失败，请检查您的邮箱和密码');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <Container className="login-container">  
      <Card className="login-card">  
        <Card.Body>  
          <div className="text-center mb-4">  
            <h2 className="login-title">欢迎回来</h2>  
            <p className="text-muted">请登录您的账户</p>  
          </div>  
          
          {error && (  
            <Alert variant="danger" className="mb-4">  
              {error}  
            </Alert>  
          )}  
          
          <Form onSubmit={handleSubmit}>  
            <Form.Group controlId="email" className="mb-3">  
              <Form.Label>邮箱地址</Form.Label>  
              <div className="input-group">  
                <span className="input-group-text">  
                  <FaUser />  
                </span>  
                <Form.Control  
                  type="email"  
                  placeholder="输入您的邮箱"  
                  value={email}  
                  onChange={(e) => setEmail(e.target.value)}  
                  disabled={loading}  
                />  
              </div>  
            </Form.Group>  
            
            <Form.Group controlId="password" className="mb-4">  
              <div className="d-flex justify-content-between align-items-center">  
                <Form.Label>密码</Form.Label>  
                <Link to="/forgot-password" className="small">  
                  忘记密码?  
                </Link>  
              </div>  
              <div className="input-group">  
                <span className="input-group-text">  
                  <FaLock />  
                </span>  
                <Form.Control  
                  type="password"  
                  placeholder="输入您的密码"  
                  value={password}  
                  onChange={(e) => setPassword(e.target.value)}  
                  disabled={loading}  
                />  
              </div>  
            </Form.Group>  
            
            <Form.Group controlId="rememberMe" className="mb-4">  
              <Form.Check  
                type="checkbox"  
                label="记住我"  
                checked={rememberMe}  
                onChange={(e) => setRememberMe(e.target.checked)}  
                disabled={loading}  
              />  
            </Form.Group>  
            
            <div className="d-grid">  
              <Button  
                variant="primary"  
                type="submit"  
                className="login-button"  
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
                    登录中...  
                  </>  
                ) : (  
                  <>  
                    <FaSignInAlt className="me-2" />  
                    登录  
                  </>  
                )}  
              </Button>  
            </div>  
          </Form>  
          
          <div className="text-center mt-4">  
            <p>  
              还没有账户? <Link to="/register">立即注册</Link>  
            </p>  
          </div>  
        </Card.Body>  
      </Card>  
    </Container>  
  );  
};  

export default Login;