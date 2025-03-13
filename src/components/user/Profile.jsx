import React, { useState, useEffect } from 'react';  
import {   
  Container, Row, Col, Card, Tab, Nav, Form,   
  Button, Alert, Spinner, ListGroup, Badge, Modal   
} from 'react-bootstrap';  
import {   
  FaUser, FaEdit, FaLock, FaCreditCard, FaMapMarkerAlt,   
  FaSave, FaTrash, FaPlus, FaCheck, FaTimes, FaMotorcycle   
} from 'react-icons/fa';  
import { useAuth } from '../../contexts/AuthContext';  
import { useRental } from '../../contexts/RentalContext';  
import authService from '../../services/auth.service';  
import rentalService from '../../services/rental.service';  
import { validateEmail, validatePassword, validatePhone } from '../../utils/validation';  
import './Profile.css';  

const Profile = () => {  
  const { user, updateUser, logout } = useAuth();  
  const { rentals } = useRental();  
  
  const [activeTab, setActiveTab] = useState('profile');  
  const [editMode, setEditMode] = useState(false);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  
  // Profile form state  
  const [profileForm, setProfileForm] = useState({  
    fullName: '',  
    email: '',  
    phone: '',  
    address: ''  
  });  
  
  // Password form state  
  const [passwordForm, setPasswordForm] = useState({  
    currentPassword: '',  
    newPassword: '',  
    confirmPassword: ''  
  });  
  
  // Delete account modal state  
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');  
  
  // Filter rentals  
  const activeRentals = rentals.filter(rental =>   
    rental.status === 'active' || rental.status === 'unlocked'  
  );  
  const completedRentals = rentals.filter(rental =>   
    rental.status === 'completed'  
  );  
  
  // Load user data into form  
  useEffect(() => {  
    if (user) {  
      setProfileForm({  
        fullName: user.fullName || '',  
        email: user.email || '',  
        phone: user.phone || '',  
        address: user.address || ''  
      });  
    }  
  }, [user]);  
  
  // Handle profile form changes  
  const handleProfileChange = (e) => {  
    const { name, value } = e.target;  
    setProfileForm({  
      ...profileForm,  
      [name]: value  
    });  
  };  
  
  // Handle password form changes  
  const handlePasswordChange = (e) => {  
    const { name, value } = e.target;  
    setPasswordForm({  
      ...passwordForm,  
      [name]: value  
    });  
  };  
  
  // Toggle edit mode  
  const toggleEditMode = () => {  
    setEditMode(!editMode);  
    setError('');  
    setSuccess('');  
    
    // Reset form to current user data if cancelling edit  
    if (editMode) {  
      setProfileForm({  
        fullName: user.fullName || '',  
        email: user.email || '',  
        phone: user.phone || '',  
        address: user.address || ''  
      });  
    }  
  };  
  
  // Save profile changes  
  const handleProfileSubmit = async (e) => {  
    e.preventDefault();  
    
    // Validate form  
    if (!profileForm.fullName.trim()) {  
      setError('姓名不能为空');  
      return;  
    }  
    
    if (!validateEmail(profileForm.email)) {  
      setError('请输入有效的电子邮箱');  
      return;  
    }  
    
    if (profileForm.phone && !validatePhone(profileForm.phone)) {  
      setError('请输入有效的手机号码');  
      return;  
    }  
    
    try {  
      setLoading(true);  
      setError('');  
      setSuccess('');  
      
      // Call API to update profile  
      const updatedUser = await authService.updateProfile(user.id, profileForm);  
      
      // Update auth context  
      updateUser(updatedUser);  
      
      // Show success message and exit edit mode  
      setSuccess('个人资料已成功更新');  
      setEditMode(false);  
      
    } catch (err) {  
      console.error('Profile update error:', err);  
      setError(err.response?.data?.message || '更新失败，请稍后再试');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Change password  
  const handlePasswordSubmit = async (e) => {  
    e.preventDefault();  
    
    // Validate form  
    if (!passwordForm.currentPassword) {  
      setError('请输入当前密码');  
      return;  
    }  
    
    if (!validatePassword(passwordForm.newPassword)) {  
      setError('新密码必须包含至少8个字符，包括字母和数字');  
      return;  
    }  
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {  
      setError('两次输入的新密码不一致');  
      return;  
    }  
    
    try {  
      setLoading(true);  
      setError('');  
      setSuccess('');  
      
      // Call API to change password  
      await authService.changePassword(user.id, {  
        currentPassword: passwordForm.currentPassword,  
        newPassword: passwordForm.newPassword  
      });  
      
      // Show success message and reset form  
      setSuccess('密码已成功更新');  
      setPasswordForm({  
        currentPassword: '',  
        newPassword: '',  
        confirmPassword: ''  
      });  
      
    } catch (err) {  
      console.error('Password change error:', err);  
      setError(err.response?.data?.message || '密码更新失败，请检查当前密码是否正确');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Delete account  
  const handleDeleteAccount = async () => {  
    if (deleteConfirmation !== user.email) {  
      setError('请输入正确的邮箱地址以确认删除');  
      return;  
    }  
    
    try {  
      setLoading(true);  
      
      // Call API to delete account  
      await authService.deleteAccount(user.id);  
      
      // Logout user  
      logout();  
      
      // Redirect to home page will happen automatically due to logout  
      
    } catch (err) {  
      console.error('Account deletion error:', err);  
      setError(err.response?.data?.message || '账户删除失败，请稍后再试');  
      setLoading(false);  
    }  
  };  
  
  // Format date  
  const formatDate = (dateString) => {  
    return new Date(dateString).toLocaleString();  
  };  
  
  // Calculate total spent  
  const calculateTotalSpent = () => {  
    if (!completedRentals.length) return 0;  
    return completedRentals.reduce((total, rental) => total + rental.cost, 0);  
  };  
  
  // Calculate average rating  
  const calculateAverageRating = () => {  
    const ratedRentals = completedRentals.filter(rental => rental.rating);  
    if (!ratedRentals.length) return 'N/A';  
    
    const sum = ratedRentals.reduce((total, rental) => total + rental.rating, 0);  
    return (sum / ratedRentals.length).toFixed(1);  
  };  
  
  return (  
    <Container className="profile-container py-5">  
      <Row>  
        <Col lg={3} md={4} className="mb-4">  
          <Card className="profile-sidebar">  
            <Card.Body className="text-center">  
              <div className="profile-avatar mb-3">  
                {user?.fullName ? (  
                  <div className="avatar-circle">  
                    {user.fullName.charAt(0).toUpperCase()}  
                  </div>  
                ) : (  
                  <div className="avatar-circle">  
                    <FaUser />  
                  </div>  
                )}  
              </div>  
              <h5>{user?.fullName || '用户'}</h5>  
              <p className="text-muted small mb-3">{user?.email}</p>  
              
              <div className="user-stats d-flex justify-content-around mb-3">  
                <div className="text-center">  
                  <div className="stat-value">{completedRentals.length}</div>  
                  <div className="stat-label small">租赁</div>  
                </div>  
                <div className="text-center">  
                  <div className="stat-value">¥{calculateTotalSpent().toFixed(2)}</div>  
                  <div className="stat-label small">消费</div>  
                </div>  
                <div className="text-center">  
                  <div className="stat-value">{calculateAverageRating()}</div>  
                  <div className="stat-label small">评分</div>  
                </div>  
              </div>  
            </Card.Body>  
            
            <Nav variant="pills" className="flex-column profile-nav">  
              <Nav.Item>  
                <Nav.Link   
                  active={activeTab === 'profile'}   
                  onClick={() => setActiveTab('profile')}  
                >  
                  <FaUser className="me-2" />  
                  个人资料  
                </Nav.Link>  
              </Nav.Item>  
              <Nav.Item>  
                <Nav.Link   
                  active={activeTab === 'security'}   
                  onClick={() => setActiveTab('security')}  
                >  
                  <FaLock className="me-2" />  
                  安全设置  
                </Nav.Link>  
              </Nav.Item>  
              <Nav.Item>  
                <Nav.Link   
                  active={activeTab === 'payment'}   
                  onClick={() => setActiveTab('payment')}  
                >  
                  <FaCreditCard className="me-2" />  
                  支付方式  
                </Nav.Link>  
              </Nav.Item>  
              <Nav.Item>  
                <Nav.Link   
                  active={activeTab === 'rentals'}   
                  onClick={() => setActiveTab('rentals')}  
                >  
                  <FaMotorcycle className="me-2" />  
                  租赁历史  
                </Nav.Link>  
              </Nav.Item>  
            </Nav>  
          </Card>  
        </Col>  
        
        <Col lg={9} md={8}>  
          <Card className="profile-content">  
            <Card.Body>  
              {/* Profile Tab */}  
              {activeTab === 'profile' && (  
                <>  
                  <div className="d-flex justify-content-between align-items-center mb-4">  
                    <h4 className="mb-0">个人资料</h4>  
                    <Button   
                      variant={editMode ? "outline-secondary" : "outline-primary"}   
                      onClick={toggleEditMode}  
                    >  
                      {editMode ? (  
                        <>  
                          <FaTimes className="me-2" />  
                          取消  
                        </>  
                      ) : (  
                        <>  
                          <FaEdit className="me-2" />  
                          编辑资料  
                        </>  
                      )}  
                    </Button>  
                  </div>  
                  
                  {error && <Alert variant="danger">{error}</Alert>}  
                  {success && <Alert variant="success">{success}</Alert>}  
                  
                  <Form onSubmit={handleProfileSubmit}>  
                    <Row>  
                      <Col md={6} className="mb-3">  
                        <Form.Group controlId="fullName">  
                          <Form.Label>姓名</Form.Label>  
                          <Form.Control  
                            type="text"  
                            name="fullName"  
                            value={profileForm.fullName}  
                            onChange={handleProfileChange}  
                            disabled={!editMode || loading}  
                          />  
                        </Form.Group>  
                      </Col>  
                      
                      <Col md={6} className="mb-3">  
                        <Form.Group controlId="email">  
                          <Form.Label>电子邮箱</Form.Label>  
                          <Form.Control  
                            type="email"  
                            name="email"  
                            value={profileForm.email}  
                            onChange={handleProfileChange}  
                            disabled={!editMode || loading}  
                          />  
                        </Form.Group>  
                      </Col>  
                    </Row>  
                    
                    <Row>  
                      <Col md={6} className="mb-3">  
                        <Form.Group controlId="phone">  
                          <Form.Label>手机号码</Form.Label>  
                          <Form.Control  
                            type="tel"  
                            name="phone"  
                            value={profileForm.phone}  
                            onChange={handleProfileChange}  
                            disabled={!editMode || loading}  
                          />  
                        </Form.Group>  
                      </Col>  
                      
                      <Col md={6} className="mb-3">  
                        <Form.Group controlId="address">  
                          <Form.Label>地址</Form.Label>  
                          <Form.Control  
                            type="text"  
                            name="address"  
                            value={profileForm.address}  
                            onChange={handleProfileChange}  
                            disabled={!editMode || loading}  
                          />  
                        </Form.Group>  
                      </Col>  
                    </Row>  
                    
                    {editMode && (  
                      <div className="d-flex justify-content-end">  
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
                              保存中...  
                            </>  
                          ) : (  
                            <>  
                              <FaSave className="me-2" />  
                              保存更改  
                            </>  
                          )}  
                        </Button>  
                      </div>  
                    )}  
                  </Form>  
                </>  
              )}  
              
              {/* Security Tab */}  
              {activeTab === 'security' && (  
                <>  
                  <h4 className="mb-4">安全设置</h4>  
                  
                  {error && <Alert variant="danger">{error}</Alert>}  
                  {success && <Alert variant="success">{success}</Alert>}  
                  
                  <div className="security-section mb-4">  
                    <h5 className="mb-3">更改密码</h5>  
                    <Form onSubmit={handlePasswordSubmit}>  
                      <Form.Group className="mb-3" controlId="currentPassword">  
                        <Form.Label>当前密码</Form.Label>  
                        <Form.Control  
                          type="password"  
                          name="currentPassword"  
                          value={passwordForm.currentPassword}  
                          onChange={handlePasswordChange}  
                          disabled={loading}  
                        />  
                      </Form.Group>  
                      
                      <Form.Group className="mb-3" controlId="newPassword">  
                        <Form.Label>新密码</Form.Label>  
                        <Form.Control  
                          type="password"  
                          name="newPassword"  
                          value={passwordForm.newPassword}  
                          onChange={handlePasswordChange}  
                          disabled={loading}  
                        />  
                        <Form.Text className="text-muted">  
                          密码必须包含至少8个字符，包括字母和数字。  
                        </Form.Text>  
                      </Form.Group>  
                      
                      <Form.Group className="mb-4" controlId="confirmPassword">  
                        <Form.Label>确认新密码</Form.Label>  
                        <Form.Control  
                          type="password"  
                          name="confirmPassword"  
                          value={passwordForm.confirmPassword}  
                          onChange={handlePasswordChange}  
                          disabled={loading}  
                        />  
                      </Form.Group>  
                      
                      <div className="d-flex justify-content-end">  
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
                              更新中...  
                            </>  
                          ) : (  
                            <>  
                              <FaLock className="me-2" />  
                              更新密码  
                            </>  
                          )}  
                        </Button>  
                      </div>  
                    </Form>  
                  </div>  
                  
                  <div className="security-section mt-5">  
                    <h5 className="mb-3 text-danger">删除账户</h5>  
                    <p className="text-muted">  
                      删除账户将会永久移除您的个人资料和所有相关数据。这个操作无法撤销。  
                    </p>  
                    <Button   
                      variant="outline-danger"   
                      onClick={() => setShowDeleteModal(true)}  
                    >  
                      <FaTrash className="me-2" />  
                      删除我的账户  
                    </Button>  
                  </div>  
                </>  
              )}  
              
              {/* Payment Tab */}  
              {activeTab === 'payment' && (  
                <>  
                  <div className="d-flex justify-content-between align-items-center mb-4">  
                    <h4 className="mb-0">支付方式</h4>  
                    <Button   
                      variant="outline-primary"  
                      onClick={() => window.location.href = '/payment-info'}  
                    >  
                      <FaPlus className="me-2" />  
                      添加支付方式  
                    </Button>  
                  </div>  
                  
                  {user?.savedCards && user.savedCards.length > 0 ? (  
                    <ListGroup className="mb-4">  
                      {user.savedCards.map(card => (  
                        <ListGroup.Item   
                          key={card.id}  
                          className="d-flex justify-content-between align-items-center payment-card-item"  
                        >  
                          <div className="d-flex align-items-center">  
                            <div className="card-icon me-3">  
                              {card.cardType === 'visa' && <i className="fab fa-cc-visa"></i>}  
                              {card.cardType === 'mastercard' && <i className="fab fa-cc-mastercard"></i>}  
                              {card.cardType === 'amex' && <i className="fab fa-cc-amex"></i>}  
                              {!['visa', 'mastercard', 'amex'].includes(card.cardType) && <FaCreditCard />}  
                            </div>  
                            <div>  
                              <div className="card-name">{card.cardName}</div>  
                              <div className="card-number text-muted">  
                                **** **** **** {card.cardNumber.substr(-4)}  
                              </div>  
                              <div className="card-expiry text-muted small">  
                                到期日: {card.expiry}  
                              </div>  
                            </div>  
                          </div>  
                          <div className="d-flex">  
                            {card.isDefault && (  
                              <Badge bg="success" className="me-2">默认</Badge>  
                            )}  
                            <Button   
                              variant="outline-danger"   
                              size="sm"  
                              className="btn-remove-card"  
                            >  
                              <FaTrash />  
                            </Button>  
                          </div>  
                        </ListGroup.Item>  
                      ))}  
                    </ListGroup>  
                  ) : (  
                    <Alert variant="info">  
                      您还没有添加任何支付方式。  
                    </Alert>  
                  )}  
                  
                  <div className="wallet-section mt-4">  
                    <h5 className="mb-3">我的钱包</h5>  
                    <Card className="wallet-card">  
                      <Card.Body>  
                        <div className="d-flex justify-content-between">  
                          <div>  
                            <div className="wallet-balance">¥{user?.walletBalance || '0.00'}</div>  
                            <div className="text-muted small">当前余额</div>  
                          </div>  
                          <Button variant="outline-primary" size="sm">  
                            充值  
                          </Button>  
                        </div>  
                      </Card.Body>  
                    </Card>  
                  </div>  
                </>  
              )}  
              
              {/* Rentals Tab */}  
              {activeTab === 'rentals' && (  
                <>  
                  <h4 className="mb-4">租赁历史</h4>  
                  
                  {activeRentals.length > 0 && (  
                    <div className="mb-4">  
                      <h5 className="mb-3">进行中的租赁</h5>  
                      <ListGroup>  
                        {activeRentals.map(rental => (  
                          <ListGroup.Item key={rental.id} className="rental-item">  
                            <div className="d-flex justify-content-between align-items-center">  
                              <div>  
                                <div className="rental-scooter">  
                                  {rental.scooter?.model || '电动滑板车'} ({rental.scooter?.id || rental.scooterId})  
                                </div>  
                                <div className="rental-details text-muted small">  
                                  <span className="me-3">  
                                    <FaMapMarkerAlt className="me-1" />  
                                    {rental.location || '未知位置'}  
                                  </span>  
                                  <span>  
                                    开始时间: {formatDate(rental.startTime)}  
                                  </span>  
                                </div>  
                              </div>  
                              <div className="d-flex align-items-center">  
                                <Badge   
                                  bg={rental.status === 'unlocked' ? 'success' : 'warning'}  
                                  className="me-3"  
                                >  
                                  {rental.status === 'unlocked' ? '使用中' : '待取车'}  
                                </Badge>  
                                <Button   
                                  variant="outline-primary"   
                                  size="sm"  
                                  href={`/rentals/${rental.id}`}  
                                >  
                                  查看详情  
                                </Button>  
                              </div>  
                            </div>  
                          </ListGroup.Item>  
                        ))}  
                      </ListGroup>  
                    </div>  
                  )}  
                  
                  <div>  
                    <h5 className="mb-3">已完成的租赁</h5>  
                    {completedRentals.length > 0 ? (  
                      <ListGroup>  
                        {completedRentals.slice(0, 5).map(rental => (  
                          <ListGroup.Item key={rental.id} className="rental-item">  
                            <div className="d-flex justify-content-between align-items-center">  
                              <div>  
                                <div className="rental-scooter">  
                                  {rental.scooter?.model || '电动滑板车'} ({rental.scooter?.id || rental.scooterId})  
                                </div>  
                                <div className="rental-details text-muted small">  
                                  <span className="me-3">  
                                    <FaMapMarkerAlt className="me-1" />  
                                    {rental.location || '未知位置'}  
                                  </span>  
                                  <span className="me-3">  
                                    时间: {formatDate(rental.startTime)}  
                                  </span>  
                                  <span>  
                                    费用: ¥{rental.cost?.toFixed(2)}  
                                  </span>  
                                </div>  
                              </div>  
                              <div className="d-flex align-items-center">  
                                {rental.rating ? (  
                                  <div className="rental-rating me-3">  
                                    <span className="text-warning">  
                                      {[...Array(5)].map((_, i) => (  
                                        <span key={i}>  
                                          {i < rental.rating ? '★' : '☆'}  
                                        </span>  
                                      ))}  
                                    </span>  
                                  </div>  
                                ) : (  
                                  <Button   
                                    variant="outline-secondary"   
                                    size="sm"  
                                    className="me-3"  
                                  >  
                                    评价  
                                  </Button>  
                                )}  
                                <Button   
                                  variant="outline-primary"   
                                  size="sm"  
                                  href={`/rentals/${rental.id}`}  
                                >  
                                  查看详情  
                                </Button>  
                              </div>  
                            </div>  
                          </ListGroup.Item>  
                        ))}  
                      </ListGroup>  
                    ) : (  
                      <Alert variant="info">  
                        您还没有已完成的租赁记录。  
                      </Alert>  
                    )}  
                    
                    {completedRentals.length > 5 && (  
                      <div className="text-center mt-3">  
                        <Button   
                          variant="outline-primary"  
                          href="/rentals"  
                        >  
                          查看所有租赁历史  
                        </Button>  
                      </div>  
                    )}  
                  </div>  
                </>  
              )}  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
      
      {/* Delete Account Confirmation Modal */}  
      <Modal   
        show={showDeleteModal}   
        onHide={() => setShowDeleteModal(false)}  
        centered  
      >  
        <Modal.Header closeButton>  
          <Modal.Title className="text-danger">删除账户</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <Alert variant="danger">  
            <strong>警告：</strong> 此操作将永久删除您的账户和所有相关数据，无法恢复！  
          </Alert>  
          <p>  
            如果您确定要删除您的账户，请在下方输入您的电子邮箱地址 (<strong>{user?.email}</strong>) 进行确认。  
          </p>  
          <Form.Group controlId="deleteConfirmation">  
            <Form.Control  
              type="text"  
              value={deleteConfirmation}  
              onChange={(e) => setDeleteConfirmation(e.target.value)}  
              placeholder="输入您的电子邮箱地址"  
              className="mb-3"  
            />  
          </Form.Group>  
        </Modal.Body>  
        <Modal.Footer>  
          <Button   
            variant="outline-secondary"   
            onClick={() => setShowDeleteModal(false)}  
          >  
            取消  
          </Button>  
          <Button   
            variant="danger"   
            onClick={handleDeleteAccount}  
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
                <FaTrash className="me-2" />  
                确认删除  
              </>  
            )}  
          </Button>  
        </Modal.Footer>  
      </Modal>  
    </Container>  
  );  
};  

export default Profile;