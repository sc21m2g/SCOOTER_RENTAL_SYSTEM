import React, { useState, useEffect } from 'react';  
import {   
  Container, Card, Form, Row, Col, Button,   
  Alert, Spinner, InputGroup, Badge   
} from 'react-bootstrap';  
import {   
  FaCreditCard, FaLock, FaCheckCircle,   
  FaSave, FaTimes, FaArrowLeft   
} from 'react-icons/fa';  
import { Link, useNavigate } from 'react-router-dom';  
import { useAuth } from '../../contexts/AuthContext';  
import authService from '../../services/auth.service';  
import './PaymentInfo.css';  

const PaymentInfo = () => {  
  const { user, updateUser } = useAuth();  
  const navigate = useNavigate();  
  
  const [cardDetails, setCardDetails] = useState({  
    cardNumber: '',  
    cardName: '',  
    expiry: '',  
    cvv: '',  
    setAsDefault: true  
  });  
  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  const [cardType, setCardType] = useState('');  
  
  // Detect card type based on first few digits  
  useEffect(() => {  
    const number = cardDetails.cardNumber.replace(/\s/g, '');  
    
    if (number.startsWith('4')) {  
      setCardType('visa');  
    } else if (/^5[1-5]/.test(number)) {  
      setCardType('mastercard');  
    } else if (/^3[47]/.test(number)) {  
      setCardType('amex');  
    } else if (/^6(?:011|5)/.test(number)) {  
      setCardType('discover');  
    } else {  
      setCardType('');  
    }  
  }, [cardDetails.cardNumber]);  
  
  // Format card number with spaces  
  const formatCardNumber = (value) => {  
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');  
    const matches = v.match(/\d{4,16}/g);  
    const match = (matches && matches[0]) || '';  
    const parts = [];  
    
    for (let i = 0, len = match.length; i < len; i += 4) {  
      parts.push(match.substring(i, i + 4));  
    }  
    
    if (parts.length) {  
      return parts.join(' ');  
    } else {  
      return value;  
    }  
  };  
  
  // Format expiry date (MM/YY)  
  const formatExpiryDate = (value) => {  
    const cleanValue = value.replace(/[^\d]/g, '');  
    
    if (cleanValue.length <= 2) {  
      return cleanValue;  
    }  
    
    let month = cleanValue.substr(0, 2);  
    let year = cleanValue.substr(2);  
    
    // Validate month  
    if (parseInt(month) > 12) {  
      month = '12';  
    }  
    
    return `${month}/${year}`;  
  };  
  
  // Handle input changes  
  const handleChange = (e) => {  
    const { name, value, checked, type } = e.target;  
    
    if (name === 'cardNumber') {  
      setCardDetails({  
        ...cardDetails,  
        [name]: formatCardNumber(value)  
      });  
    } else if (name === 'expiry') {  
      setCardDetails({  
        ...cardDetails,  
        [name]: formatExpiryDate(value)  
      });  
    } else if (name === 'cvv') {  
      // Allow only numbers and max length 4  
      const cvv = value.replace(/\D/g, '').substring(0, 4);  
      setCardDetails({  
        ...cardDetails,  
        [name]: cvv  
      });  
    } else {  
      setCardDetails({  
        ...cardDetails,  
        [name]: type === 'checkbox' ? checked : value  
      });  
    }  
  };  
  
  // Validate form  
  const validateForm = () => {  
    // Clear previous errors  
    setError('');  
    
    // Card number validation  
    const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, '');  
    if (!cardNumberClean || cardNumberClean.length < 13) {  
      setError('请输入有效的卡号');  
      return false;  
    }  
    
    // Card name validation  
    if (!cardDetails.cardName.trim()) {  
      setError('请输入持卡人姓名');  
      return false;  
    }  
    
    // Expiry validation  
    const [month, year] = cardDetails.expiry.split('/');  
    if (!month || !year || month.length !== 2 || year.length !== 2) {  
      setError('请输入有效的到期日期 (MM/YY)');  
      return false;  
    }  
    
    const now = new Date();  
    const currentYear = now.getFullYear() % 100;  
    const currentMonth = now.getMonth() + 1;  
    
    if (parseInt(year) < currentYear ||   
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {  
      setError('卡片已过期');  
      return false;  
    }  
    
    // CVV validation  
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {  
      setError('请输入有效的安全码');  
      return false;  
    }  
    
    return true;  
  };  
  
  // Submit form  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    
    if (!validateForm()) {  
      return;  
    }  
    
    try {  
      setLoading(true);  
      
      // Call API to add payment method  
      const updatedUser = await authService.addPaymentMethod(user.id, {  
        cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),  
        cardName: cardDetails.cardName,  
        expiry: cardDetails.expiry,  
        cardType,  
        isDefault: cardDetails.setAsDefault  
      });  
      
      // Update user in context  
      updateUser(updatedUser);  
      
      // Show success message  
      setSuccess('支付方式已成功添加');  
      
      // Reset form  
      setCardDetails({  
        cardNumber: '',  
        cardName: '',  
        expiry: '',  
        cvv: '',  
        setAsDefault: true  
      });  
      
      // Redirect after a delay  
      setTimeout(() => {  
        navigate('/profile');  
      }, 2000);  
      
    } catch (err) {  
      console.error('Add payment method error:', err);  
      setError(err.response?.data?.message || '添加支付方式失败，请稍后再试');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Render card type icon  
  const renderCardIcon = () => {  
    switch (cardType) {  
      case 'visa':  
        return <i className="fab fa-cc-visa text-primary"></i>;  
      case 'mastercard':  
        return <i className="fab fa-cc-mastercard text-danger"></i>;  
      case 'amex':  
        return <i className="fab fa-cc-amex text-info"></i>;  
      case 'discover':  
        return <i className="fab fa-cc-discover text-warning"></i>;  
      default:  
        return <FaCreditCard />;  
    }  
  };  
  
  return (  
    <Container className="payment-info-container py-5">  
      <Row className="justify-content-center">  
        <Col md={8} lg={6}>  
          <div className="mb-4">  
            <Button   
              as={Link}   
              to="/profile"   
              variant="link"   
              className="p-0 text-decoration-none"  
            >  
              <FaArrowLeft className="me-2" />  
              返回个人资料  
            </Button>  
          </div>  
          
          <Card className="payment-card">  
            <Card.Body>  
              <h4 className="mb-4">添加支付方式</h4>  
              
              {error && (  
                <Alert variant="danger" className="mb-4">  
                  <FaTimes className="me-2" />  
                  {error}  
                </Alert>  
              )}  
              
              {success && (  
                <Alert variant="success" className="mb-4">  
                  <FaCheckCircle className="me-2" />  
                  {success}  
                </Alert>  
              )}  
              
              <Form onSubmit={handleSubmit}>  
                <Form.Group className="mb-3">  
                  <Form.Label>卡号</Form.Label>  
                  <InputGroup>  
                    <Form.Control  
                      type="text"  
                      name="cardNumber"  
                      value={cardDetails.cardNumber}  
                      onChange={handleChange}  
                      placeholder="**** **** **** ****"  
                      maxLength="19"  
                      disabled={loading}  
                      required  
                    />  
                    <InputGroup.Text>  
                      {renderCardIcon()}  
                    </InputGroup.Text>  
                  </InputGroup>  
                </Form.Group>  
                
                <Form.Group className="mb-3">  
                  <Form.Label>持卡人姓名</Form.Label>  
                  <Form.Control  
                    type="text"  
                    name="cardName"  
                    value={cardDetails.cardName}  
                    onChange={handleChange}  
                    placeholder="输入持卡人姓名"  
                    disabled={loading}  
                    required  
                  />  
                </Form.Group>  
                
                <Row>  
                  <Col sm={6} className="mb-3">  
                    <Form.Group>  
                      <Form.Label>到期日期</Form.Label>  
                      <Form.Control  
                        type="text"  
                        name="expiry"  
                        value={cardDetails.expiry}  
                        onChange={handleChange}  
                        placeholder="MM/YY"  
                        maxLength="5"  
                        disabled={loading}  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                  
                  <Col sm={6} className="mb-3">  
                    <Form.Group>  
                      <Form.Label>  
                        安全码 (CVV)  
                        <i className="ms-1 small text-muted">  
                          <FaLock />  
                        </i>  
                      </Form.Label>  
                      <Form.Control  
                        type="password"  
                        name="cvv"  
                        value={cardDetails.cvv}  
                        onChange={handleChange}  
                        placeholder="***"  
                        maxLength="4"  
                        disabled={loading}  
                        required  
                      />  
                    </Form.Group>  
                  </Col>  
                </Row>  
                
                <div className="card-preview mb-4">  
                  <div className={`payment-card-preview ${cardType}`}>  
                    <div className="card-preview-header">  
                      <div className="card-chip"></div>  
                      <div className="card-type">  
                        {renderCardIcon()}  
                      </div>  
                    </div>  
                    <div className="card-number-preview">  
                      {cardDetails.cardNumber || '**** **** **** ****'}  
                    </div>  
                    <div className="card-details-preview">  
                      <div className="card-holder">  
                        <div className="card-label">持卡人</div>  
                        <div className="card-name-preview">  
                          {cardDetails.cardName || 'YOUR NAME'}  
                        </div>  
                      </div>  
                      <div className="card-expiry-preview">  
                        <div className="card-label">有效期至</div>  
                        <div>{cardDetails.expiry || 'MM/YY'}</div>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
                
                <Form.Group className="mb-4">  
                  <Form.Check  
                    type="checkbox"  
                    id="setAsDefault"  
                    name="setAsDefault"  
                    label="设为默认支付方式"  
                    checked={cardDetails.setAsDefault}  
                    onChange={handleChange}  
                    disabled={loading}  
                  />  
                </Form.Group>  
                
                <div className="security-info mb-4">  
                  <Badge bg="light" text="dark" className="d-flex align-items-center p-2">  
                    <FaLock className="me-2 text-success" />  
                    <span>您的支付信息会被安全加密处理</span>  
                  </Badge>  
                </div>  
                
                <div className="d-grid">  
                  <Button  
                    variant="primary"  
                    type="submit"  
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
                        处理中...  
                      </>  
                    ) : (  
                      <>  
                        <FaSave className="me-2" />  
                        保存支付方式  
                      </>  
                    )}  
                  </Button>  
                </div>  
              </Form>  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
    </Container>  
  );  
};  

export default PaymentInfo;