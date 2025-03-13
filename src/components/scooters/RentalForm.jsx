import React, { useState, useEffect } from 'react';  
import {   
  Container, Row, Col, Card, Form, Button, Alert,   
  Spinner, Badge, Tab, Tabs, InputGroup, Modal  
} from 'react-bootstrap';  
import {   
  FaClipboardCheck, FaCreditCard, FaRegClock, FaCalendarAlt,   
  FaInfoCircle, FaMapMarkerAlt, FaLock, FaCheckCircle,   
  FaArrowLeft, FaMoneyBillWave, FaTimesCircle, FaCcVisa,  
  FaCcMastercard, FaCcAmex, FaWallet  
} from 'react-icons/fa';  
import { useParams, useNavigate, Link } from 'react-router-dom';  
import { useAuth } from '../../contexts/AuthContext';  
import { useRental } from '../../contexts/RentalContext';  
import ScooterItem from './ScooterItem';  
import ScooterService from '../../services/scooter.service';  
import RentalService from '../../services/rental.service';  
import '../../styles/components/RentalForm.css';  

const RentalForm = () => {  
  const { id } = useParams();  
  const navigate = useNavigate();  
  const { user } = useAuth();  
  const { addRental } = useRental();  
  
  const [scooter, setScooter] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [rentalPlan, setRentalPlan] = useState('hourly');  
  const [rentalDuration, setRentalDuration] = useState(1);  
  const [totalCost, setTotalCost] = useState(0);  
  const [paymentMethod, setPaymentMethod] = useState(user?.defaultPaymentMethod || 'card');  
  const [cardDetails, setCardDetails] = useState({  
    cardNumber: user?.savedCards?.[0]?.cardNumber || '',  
    cardName: user?.savedCards?.[0]?.cardName || '',  
    expiry: user?.savedCards?.[0]?.expiry || '',  
    cvv: '',  
    saveCard: false  
  });  
  const [useSavedCard, setUseSavedCard] = useState(user?.savedCards?.length > 0);  
  const [savedCards, setSavedCards] = useState(user?.savedCards || []);  
  const [selectedCard, setSelectedCard] = useState(user?.savedCards?.[0]?.id || '');  
  const [processingPayment, setProcessingPayment] = useState(false);  
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);  
  const [rentalComplete, setRentalComplete] = useState(false);  
  const [bookingDetails, setBookingDetails] = useState(null);  
  
  useEffect(() => {  
    const fetchScooterDetails = async () => {  
      try {  
        setLoading(true);  
        const response = await ScooterService.getScooterById(id);  
        
        // Check if scooter is available  
        if (response.data.status !== 'available') {  
          setError('该滑板车当前不可用，请选择其他滑板车');  
          return;  
        }  
        
        setScooter(response.data);  
      } catch (err) {  
        console.error('Error fetching scooter details:', err);  
        setError('获取滑板车详情失败，请稍后重试');  
        
        // Mock data for development  
        setScooter({  
          id: 'SC001',  
          model: 'Xiaomi Pro 2',  
          batteryLevel: 85,  
          status: 'available',  
          location: '中山公园',  
          coordinates: [31.2304, 121.4737],  
          pricePerHour: 15,  
          pricePerFourHours: 50,  
          pricePerDay: 100,  
          pricePerWeek: 500,  
          imageUrl: '/images/scooter-1.jpg'  
        });  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchScooterDetails();  
  }, [id]);  
  
  // Calculate total cost whenever rental plan or duration changes  
  useEffect(() => {  
    if (!scooter) return;  
    
    let cost = 0;  
    switch (rentalPlan) {  
      case 'hourly':  
        cost = scooter.pricePerHour * rentalDuration;  
        break;  
      case 'fourHours':  
        cost = scooter.pricePerFourHours;  
        break;  
      case 'daily':  
        cost = scooter.pricePerDay * rentalDuration;  
        break;  
      case 'weekly':  
        cost = scooter.pricePerWeek * rentalDuration;  
        break;  
      default:  
        cost = 0;  
    }  
    
    // Apply discount if user is eligible  
    if (user?.discountEligible) {  
      cost = cost * 0.9; // 10% discount  
    }  
    
    setTotalCost(cost);  
  }, [rentalPlan, rentalDuration, scooter, user]);  
  
  // Handle card input changes  
  const handleCardDetailChange = (field, value) => {  
    setCardDetails(prev => ({ ...prev, [field]: value }));  
  };  
  
  // Format credit card number with spaces  
  const formatCardNumber = (value) => {  
    if (!value) return '';  
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');  
    const matches = v.match(/\d{4,16}/g);  
    const match = matches && matches[0] || '';  
    const parts = [];  
    
    for (let i = 0; i < match.length; i += 4) {  
      parts.push(match.substring(i, i + 4));  
    }  
    
    if (parts.length) {  
      return parts.join(' ');  
    } else {  
      return value;  
    }  
  };  
  
  // Determine card type based on the number  
  const getCardType = (number) => {  
    if (!number) return null;  
    const cleanNumber = number.replace(/\s+/g, '');  
    
    // Visa: Starts with 4  
    if (/^4/.test(cleanNumber)) return 'visa';  
    
    // Mastercard: Starts with 51-55 or 2221-2720  
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]2[0-1]/.test(cleanNumber)) return 'mastercard';  
    
    // Amex: Starts with 34 or 37  
    if (/^3[47]/.test(cleanNumber)) return 'amex';  
    
    return null;  
  };  
  
  // Card icon component  
  const CardIcon = ({ cardNumber }) => {  
    const type = getCardType(cardNumber);  
    
    switch (type) {  
      case 'visa':  
        return <FaCcVisa size={24} className="text-primary" />;  
      case 'mastercard':  
        return <FaCcMastercard size={24} className="text-danger" />;  
      case 'amex':  
        return <FaCcAmex size={24} className="text-info" />;  
      default:  
        return <FaCreditCard size={24} className="text-secondary" />;  
    }  
  };  
  
  // Handle form submission  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    
    // Validate scooter availability again  
    if (scooter.status !== 'available') {  
      setError('该滑板车已被租用，请选择其他滑板车');  
      return;  
    }  
    
    // Prepare rental data  
    const rentalData = {  
      scooterId: scooter.id,  
      userId: user.id,  
      plan: rentalPlan,  
      duration: rentalDuration,  
      startTime: new Date().toISOString(),  
      cost: totalCost,  
      paymentMethod: paymentMethod  
    };  
    
    // If using card payment, add card details  
    if (paymentMethod === 'card') {  
      if (useSavedCard && selectedCard) {  
        rentalData.paymentDetails = { savedCardId: selectedCard };  
      } else {  
        // Validate card details  
        if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {  
          setError('请填写完整的信用卡信息');  
          return;  
        }  
        
        rentalData.paymentDetails = {  
          cardNumber: cardDetails.cardNumber.replace(/\s+/g, ''),  
          cardName: cardDetails.cardName,  
          expiry: cardDetails.expiry,  
          saveCard: cardDetails.saveCard  
        };  
      }  
    }  
    
    // Show confirmation modal  
    setShowConfirmationModal(true);  
  };  
  
  // Complete the booking  
  const completeBooking = async () => {  
    try {  
      setProcessingPayment(true);  
      // In a real app, process payment through a payment gateway  
      
      // Create rental record  
      const response = await RentalService.createRental({  
        scooterId: scooter.id,  
        plan: rentalPlan,  
        duration: rentalDuration,  
        cost: totalCost  
      });  
      
      // Save the booking details  
      setBookingDetails(response.data);  
      
      // Add to rental context  
      addRental(response.data);  
      
      // Update scooter status  
      await ScooterService.updateScooterStatus(scooter.id, 'in_use');  
      
      // If user wants to save card and it's not already saved  
      if (paymentMethod === 'card' && !useSavedCard && cardDetails.saveCard) {  
        // In a real app, save card to user profile  
        console.log('Saving card for future use');  
      }  
      
      setRentalComplete(true);  
    } catch (err) {  
      console.error('Error processing rental:', err);  
      setError('处理租赁请求时出错，请稍后重试');  
      setShowConfirmationModal(false);  
    } finally {  
      setProcessingPayment(false);  
    }  
  };  
  
  // Format plan name for display  
  const formatPlanName = (plan) => {  
    switch (plan) {  
      case 'hourly':  
        return `${rentalDuration} 小时`;  
      case 'fourHours':  
        return '4 小时';  
      case 'daily':  
        return `${rentalDuration} 天`;  
      case 'weekly':  
        return `${rentalDuration} 周`;  
      default:  
        return plan;  
    }  
  };  

  if (loading) {  
    return (  
      <Container className="py-5 text-center">  
        <Spinner animation="border" variant="primary" />  
        <p className="mt-3">正在加载租赁信息...</p>  
      </Container>  
    );  
  }  

  if (error && !scooter) {  
    return (  
      <Container className="py-5">  
        <Alert variant="danger">  
          <FaTimesCircle className="me-2" />  
          {error}  
        </Alert>  
        <div className="text-center mt-4">  
          <Button as={Link} to="/scooters" variant="primary">  
            <FaArrowLeft className="me-2" />  
            返回滑板车列表  
          </Button>  
        </div>  
      </Container>  
    );  
  }  

  return (  
    <Container className="rental-form-container py-5">  
      <Row>  
        <Col lg={8} className="mx-auto">  
          <Card className="border-0 shadow">  
            <Card.Header className="bg-white py-3">  
              <div className="d-flex align-items-center">  
                <Button   
                  variant="link"   
                  className="p-0 me-3 back-button"  
                  onClick={() => navigate(`/scooters/${id}`)}  
                >  
                  <FaArrowLeft /> 返回详情  
                </Button>  
                <h4 className="mb-0">租赁滑板车</h4>  
              </div>  
            </Card.Header>  
            
            <Card.Body className="p-md-4">  
              {error && (  
                <Alert variant="danger" className="mb-4">  
                  <FaTimesCircle className="me-2" />  
                  {error}  
                </Alert>  
              )}  
              
              <Row className="mb-4">  
                <Col md={6} className="mb-4 mb-md-0">  
                  <h5 className="mb-3">选择的滑板车</h5>  
                  <ScooterItem scooter={scooter} showDetailButton={false} />  
                </Col>  
                
                <Col md={6}>  
                  <h5 className="mb-3">租赁详情</h5>  
                  <Form onSubmit={handleSubmit}>  
                    <Form.Group className="mb-3">  
                      <Form.Label>租赁方案</Form.Label>  
                      <div className="rental-plans">  
                        <Form.Check  
                          type="radio"  
                          id="hourly-plan"  
                          name="rental-plan"  
                          label={`按小时 (¥${scooter.pricePerHour}/小时)`}  
                          checked={rentalPlan === 'hourly'}  
                          onChange={() => setRentalPlan('hourly')}  
                          className="rental-plan-option"  
                        />  
                        
                        <Form.Check  
                          type="radio"  
                          id="four-hours-plan"  
                          name="rental-plan"  
                          label={`4小时套餐 (¥${scooter.pricePerFourHours})`}  
                          checked={rentalPlan === 'fourHours'}  
                          onChange={() => {  
                            setRentalPlan('fourHours');  
                            setRentalDuration(1);  
                          }}  
                          className="rental-plan-option"  
                        />  
                        
                        <Form.Check  
                          type="radio"  
                          id="daily-plan"  
                          name="rental-plan"  
                          label={`按天 (¥${scooter.pricePerDay}/天)`}  
                          checked={rentalPlan === 'daily'}  
                          onChange={() => setRentalPlan('daily')}  
                          className="rental-plan-option"  
                        />  
                        
                        <Form.Check  
                          type="radio"  
                          id="weekly-plan"  
                          name="rental-plan"  
                          label={`按周 (¥${scooter.pricePerWeek}/周)`}  
                          checked={rentalPlan === 'weekly'}  
                          onChange={() => setRentalPlan('weekly')}  
                          className="rental-plan-option"  
                        />  
                      </div>  
                    </Form.Group>  
                    
                    {(rentalPlan === 'hourly' || rentalPlan === 'daily' || rentalPlan === 'weekly') && (  
                      <Form.Group className="mb-4">  
                        <Form.Label>  
                          {rentalPlan === 'hourly' ? '小时数' : rentalPlan === 'daily' ? '天数' : '周数'}  
                        </Form.Label>  
                        <Form.Range   
                          min={1}  
                          max={rentalPlan === 'hourly' ? 8 : rentalPlan === 'daily' ? 7 : 4}  
                          value={rentalDuration}  
                          onChange={(e) => setRentalDuration(parseInt(e.target.value))}  
                        />  
                        <div className="d-flex justify-content-between">  
                          <span>1</span>  
                          <span>{rentalDuration}</span>  
                          <span>{rentalPlan === 'hourly' ? '8' : rentalPlan === 'daily' ? '7' : '4'}</span>  
                        </div>  
                      </Form.Group>  
                    )}  
                    
                    <div className="rental-summary mb-4">  
                      <div className="d-flex justify-content-between mb-2">  
                        <span>租赁方案:</span>  
                        <span>{formatPlanName(rentalPlan)}</span>  
                      </div>  
                      <div className="d-flex justify-content-between mb-2">  
                        <span>取车地点:</span>  
                        <span>{scooter.location}</span>  
                      </div>  
                      <div className="d-flex justify-content-between mb-2">  
                        <span>预计费用:</span>  
                        <span className="fw-bold">¥{totalCost.toFixed(2)}</span>  
                      </div>  
                      
                      {user?.discountEligible && (  
                        <div className="discount-badge mt-2">  
                          <Badge bg="success">已应用 10% 的常客折扣</Badge>  
                        </div>  
                      )}  
                    </div>  
                    
                    <h5 className="mb-3">支付方式</h5>  
                    <Tabs  
                      id="payment-methods"  
                      activeKey={paymentMethod}  
                      onSelect={(k) => setPaymentMethod(k)}  
                      className="mb-4"  
                    >  
                      <Tab eventKey="card" title="信用卡">  
                        {user?.savedCards?.length > 0 && (  
                          <Form.Group className="mb-3">  
                            <Form.Check   
                              type="switch"  
                              id="use-saved-card"  
                              label="使用已保存的卡"  
                              checked={useSavedCard}  
                              onChange={(e) => setUseSavedCard(e.target.checked)}  
                            />  
                          </Form.Group>  
                        )}  
                        
                        {useSavedCard && user?.savedCards?.length > 0 ? (  
                          <Form.Group className="mb-4">  
                            <Form.Label>选择卡片</Form.Label>  
                            {user.savedCards.map(card => (  
                              <Form.Check  
                                key={card.id}  
                                type="radio"  
                                id={`card-${card.id}`}  
                                name="selected-card"  
                                checked={selectedCard === card.id}  
                                onChange={() => setSelectedCard(card.id)}  
                                label={  
                                  <div className="d-flex align-items-center">  
                                    <CardIcon cardNumber={card.cardNumber} />  
                                    <span className="ms-2">  
                                      **** **** **** {card.cardNumber.slice(-4)} ({card.expiry})  
                                    </span>  
                                  </div>  
                                }  
                                className="mb-2"  
                              />  
                            ))}  
                          </Form.Group>  
                        ) : (  
                          <>  
                            <Form.Group className="mb-3">  
                              <Form.Label>卡号</Form.Label>  
                              <InputGroup>  
                                <Form.Control  
                                  type="text"  
                                  value={cardDetails.cardNumber}  
                                  onChange={(e) => handleCardDetailChange('cardNumber', formatCardNumber(e.target.value))}  
                                  placeholder="**** **** **** ****"  
                                  maxLength="19"  
                                  required={paymentMethod === 'card' && !useSavedCard}  
                                />  
                                <InputGroup.Text>  
                                  <CardIcon cardNumber={cardDetails.cardNumber} />  
                                </InputGroup.Text>  
                              </InputGroup>  
                            </Form.Group>  
                            
                            <Form.Group className="mb-3">  
                              <Form.Label>持卡人姓名</Form.Label>  
                              <Form.Control  
                                type="text"  
                                value={cardDetails.cardName}  
                                onChange={(e) => handleCardDetailChange('cardName', e.target.value)}  
                                placeholder="持卡人姓名"  
                                required={paymentMethod === 'card' && !useSavedCard}  
                              />  
                            </Form.Group>  
                            
                            <Row>  
                              <Col sm={6} className="mb-3">  
                                <Form.Group>  
                                  <Form.Label>到期日期</Form.Label>  
                                  <Form.Control  
                                    type="text"  
                                    value={cardDetails.expiry}  
                                    onChange={(e) => handleCardDetailChange('expiry', e.target.value)}  
                                    placeholder="MM/YY"  
                                    maxLength="5"  
                                    required={paymentMethod === 'card' && !useSavedCard}  
                                  />  
                                </Form.Group>  
                              </Col>  
                              <Col sm={6} className="mb-3">  
                                <Form.Group>
                                <Form.Label>CVV</Form.Label>  
                              <Form.Control  
                                type="text"  
                                value={cardDetails.cvv}  
                                onChange={(e) => handleCardDetailChange('cvv', e.target.value)}  
                                placeholder="***"  
                                maxLength="4"  
                                required={paymentMethod === 'card' && !useSavedCard}  
                              />  
                            </Form.Group>  
                          </Col>  
                        </Row>  
                        
                        <Form.Group className="mb-3">  
                          <Form.Check  
                            type="checkbox"  
                            id="save-card"  
                            label="保存此卡以便将来使用"  
                            checked={cardDetails.saveCard}  
                            onChange={(e) => handleCardDetailChange('saveCard', e.target.checked)}  
                          />  
                        </Form.Group>  
                      </>  
                    )}  
                  </Tab>  
                  
                  <Tab eventKey="wallet" title="电子钱包">  
                    <div className="wallet-info mb-4">  
                      <div className="d-flex justify-content-between align-items-center mb-3">  
                        <div>  
                          <h6 className="mb-1">钱包余额</h6>  
                          <div className="balance-amount">¥{user?.walletBalance || '0.00'}</div>  
                        </div>  
                        <FaWallet size={24} className="text-success" />  
                      </div>  
                      
                      {(user?.walletBalance || 0) < totalCost && (  
                        <Alert variant="warning" className="mb-0">  
                          <FaInfoCircle className="me-2" />  
                          您的钱包余额不足，请先充值或选择其他支付方式。  
                        </Alert>  
                      )}  
                    </div>  
                  </Tab>  
                </Tabs>  
                
                <div className="rental-terms mb-4">  
                  <h6>租赁条款</h6>  
                  <ul className="small text-muted">  
                    <li>您需要安全驾驶并遵守交通规则。</li>  
                    <li>滑板车必须在租赁期结束前归还到指定位置。</li>  
                    <li>如发生损坏，您需要承担修理费用。</li>  
                    <li>超时将额外收费，按每小时¥{scooter.pricePerHour}计算。</li>  
                  </ul>  
                  <Form.Group>  
                    <Form.Check  
                      type="checkbox"  
                      id="accept-terms"  
                      label="我已阅读并同意租赁条款"  
                      required  
                    />  
                  </Form.Group>  
                </div>  
                
                <div className="d-grid">  
                  <Button   
                    type="submit"   
                    variant="primary"   
                    size="lg"  
                    disabled={  
                      (paymentMethod === 'wallet' && (user?.walletBalance || 0) < totalCost) ||  
                      processingPayment  
                    }  
                  >  
                    {processingPayment ? (  
                      <>  
                        <Spinner   
                          as="span"   
                          animation="border"   
                          size="sm"   
                          className="me-2"   
                        />  
                        处理中...  
                      </>  
                    ) : '确认租赁'}  
                  </Button>  
                </div>  
              </Form>  
            </Col>  
          </Row>  
        </Card.Body>  
      </Card>  
    </Col>  
  </Row>  
  
  {/* Confirmation Modal */}  
  <Modal   
    show={showConfirmationModal}  
    onHide={() => !processingPayment && !rentalComplete && setShowConfirmationModal(false)}  
    backdrop="static"  
    keyboard={false}  
    centered  
  >  
    <Modal.Header closeButton={!processingPayment && !rentalComplete}>  
      <Modal.Title>{rentalComplete ? '租赁成功' : '确认租赁'}</Modal.Title>  
    </Modal.Header>  
    <Modal.Body>  
      {rentalComplete ? (  
        <div className="booking-confirmation">  
          <div className="text-center mb-4">  
            <FaCheckCircle size={60} className="text-success mb-3" />  
            <h5>您已成功租用滑板车！</h5>  
            <p className="text-muted">请使用应用解锁滑板车。</p>  
          </div>  
          
          <Card className="booking-details mb-4">  
            <Card.Body>  
              <h6 className="mb-3">租赁详情</h6>  
              <div className="d-flex justify-content-between mb-2">  
                <span>订单号:</span>  
                <strong>{bookingDetails?.id || '00001'}</strong>  
              </div>  
              <div className="d-flex justify-content-between mb-2">  
                <span>滑板车:</span>  
                <strong>{scooter.model} ({scooter.id})</strong>  
              </div>  
              <div className="d-flex justify-content-between mb-2">  
                <span>租赁方案:</span>  
                <strong>{formatPlanName(rentalPlan)}</strong>  
              </div>  
              <div className="d-flex justify-content-between mb-2">  
                <span>取车地点:</span>  
                <strong>{scooter.location}</strong>  
              </div>  
              <div className="d-flex justify-content-between mb-2">  
                <span>开始时间:</span>  
                <strong>{new Date().toLocaleString()}</strong>  
              </div>  
              <div className="d-flex justify-content-between">  
                <span>费用:</span>  
                <strong>¥{totalCost.toFixed(2)}</strong>  
              </div>  
            </Card.Body>  
          </Card>  
          
          <div className="unlock-instructions mb-4">  
            <h6 className="mb-2">如何解锁</h6>  
            <ol className="small text-muted">  
              <li>前往滑板车所在位置</li>  
              <li>点击"我的租赁"中的"解锁"按钮</li>  
              <li>或扫描滑板车上的二维码</li>  
            </ol>  
          </div>  
          
          <div className="d-flex justify-content-between">  
            <Button   
              variant="outline-primary"   
              onClick={() => navigate('/scooters')}  
            >  
              返回滑板车列表  
            </Button>  
            <Button   
              variant="primary"   
              onClick={() => navigate('/rentals')}  
            >  
              查看我的租赁  
            </Button>  
          </div>  
        </div>  
      ) : (  
        <>  
          {processingPayment ? (  
            <div className="text-center py-4">  
              <Spinner animation="border" variant="primary" />  
              <p className="mt-3">正在处理您的付款，请稍候...</p>  
            </div>  
          ) : (  
            <>  
              <p className="mb-4">请确认以下租赁信息：</p>  
              
              <div className="confirm-details mb-4">  
                <div className="d-flex justify-content-between mb-2">  
                  <span>滑板车:</span>  
                  <strong>{scooter.model} ({scooter.id})</strong>  
                </div>  
                <div className="d-flex justify-content-between mb-2">  
                  <span>租赁方案:</span>  
                  <strong>{formatPlanName(rentalPlan)}</strong>  
                </div>  
                <div className="d-flex justify-content-between mb-2">  
                  <span>取车地点:</span>  
                  <strong>{scooter.location}</strong>  
                </div>  
                <div className="d-flex justify-content-between">  
                  <span>总费用:</span>  
                  <strong className="text-primary">¥{totalCost.toFixed(2)}</strong>  
                </div>  
              </div>  
              
              <div className="payment-confirm mb-4">  
                <div className="d-flex align-items-center">  
                  <div className="payment-icon me-3">  
                    {paymentMethod === 'card' ? (  
                      useSavedCard ? <FaCreditCard size={24} className="text-primary" /> :   
                      <CardIcon cardNumber={cardDetails.cardNumber} />  
                    ) : (  
                      <FaWallet size={24} className="text-success" />  
                    )}  
                  </div>  
                  <div>  
                    <div className="payment-method-title">支付方式</div>  
                    <div className="payment-method-details">  
                      {paymentMethod === 'card' ? (  
                        useSavedCard ?   
                        `已保存的卡 (**** ${user.savedCards.find(c => c.id === selectedCard)?.cardNumber.slice(-4) || '1234'})` :   
                        `信用卡 (**** ${cardDetails.cardNumber.slice(-4) || '1234'})`  
                      ) : (  
                        '电子钱包余额'  
                      )}  
                    </div>  
                  </div>  
                </div>  
              </div>  
              
              <Alert variant="info" className="mb-4">  
                <FaInfoCircle className="me-2" />  
                确认后将从您的支付方式中扣取费用。  
              </Alert>  
            </>  
          )}  
        </>  
      )}  
    </Modal.Body>  
    
    {!rentalComplete && !processingPayment && (  
      <Modal.Footer>  
        <Button   
          variant="outline-secondary"   
          onClick={() => setShowConfirmationModal(false)}  
        >  
          返回修改  
        </Button>  
        <Button   
          variant="primary"   
          onClick={completeBooking}  
        >  
          <FaLock className="me-2" />  
          确认并支付  
        </Button>  
      </Modal.Footer>  
    )}  
  </Modal>  
</Container>
);
};

export default RentalForm;