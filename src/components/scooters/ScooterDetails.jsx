import React, { useState, useEffect } from 'react';  
import {   
  Container, Row, Col, Card, Badge, Button, Tab, Tabs,   
  ListGroup, Spinner, Alert, Modal, Form  
} from 'react-bootstrap';  
import {   
  FaBatteryThreeQuarters, FaMapMarkerAlt, FaClock, FaCalendarAlt,   
  FaWrench, FaCheckCircle, FaExclamationCircle, FaArrowLeft,   
  FaExclamationTriangle, FaStar, FaStarHalfAlt, FaRegStar   
} from 'react-icons/fa';  
import { useParams, useNavigate, Link } from 'react-router-dom';  
import Map from '../common/Map';  
import ScooterService from '../../services/scooter.service';  
import '../../styles/components/ScooterDetails.css';  

const ScooterDetails = () => {  
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [scooter, setScooter] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [activeTab, setActiveTab] = useState('info');  
  const [showReportModal, setShowReportModal] = useState(false);  
  const [reportForm, setReportForm] = useState({  
    issue: '',  
    description: '',  
    priority: 'low'  
  });  
  const [submitting, setSubmitting] = useState(false);  
  const [reportSuccess, setReportSuccess] = useState(false);  

  useEffect(() => {  
    const fetchScooterDetails = async () => {  
      try {  
        setLoading(true);  
        const response = await ScooterService.getScooterById(id);  
        setScooter(response.data);  
        setError(null);  
      } catch (err) {  
        console.error('Error fetching scooter details:', err);  
        setError('获取滑板车详情失败，请稍后重试。');  
        
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
          maxSpeed: 25,  
          range: 45,  
          weight: 14.2,  
          maxLoad: 100,  
          manufacturingDate: '2022-05-15',  
          lastMaintenanceDate: '2023-03-10',  
          features: ['折叠式', '防水', 'LED显示屏', '巡航模式'],  
          description: '小米Pro 2电动滑板车是一款高性能的城市代步工具，采用航空级铝合金车架，坚固轻便，最高时速可达25km/h，续航里程可达45公里。配备8.5英寸充气轮胎，带来更舒适的骑行体验。',  
          imageUrl: '/images/scooter-1.jpg',  
          reviews: [  
            { id: 1, rating: 5, comment: '非常好用，电池续航超出预期', date: '2023-01-15', user: '张先生' },  
            { id: 2, rating: 4, comment: '整体不错，就是刹车有点紧', date: '2023-02-22', user: '李女士' },  
            { id: 3, rating: 5, comment: '轻便易携带，很适合短途通勤', date: '2023-03-05', user: '王先生' }  
          ],  
          issues: [  
            { id: 1, status: 'resolved', date: '2023-01-10', description: '刹车系统异常', resolution: '更换了刹车片' },  
            { id: 2, status: 'resolved', date: '2023-02-05', description: '显示屏故障', resolution: '重新连接显示屏线路' }  
          ]  
        });  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchScooterDetails();  
  }, [id]);  

  // Helper functions for display  
  const getBatteryVariant = (level) => {  
    if (level >= 70) return 'success';  
    if (level >= 30) return 'warning';  
    return 'danger';  
  };  
  
  const getStatusBadge = (status) => {  
    switch (status) {  
      case 'available':  
        return <Badge bg="success">可用</Badge>;  
      case 'in_use':  
        return <Badge bg="warning" text="dark">使用中</Badge>;  
      case 'maintenance':  
        return <Badge bg="danger">维护中</Badge>;  
      case 'low_battery':  
        return <Badge bg="secondary">电量低</Badge>;  
      default:  
        return <Badge bg="secondary">{status}</Badge>;  
    }  
  };  
  
  const handleReportSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      setSubmitting(true);  
      // In a real app, send the report to the API  
      await ScooterService.reportIssue(id, reportForm);  
      setReportSuccess(true);  
      setTimeout(() => {  
        setShowReportModal(false);  
        setReportForm({ issue: '', description: '', priority: 'low' });  
        setReportSuccess(false);  
      }, 2000);  
    } catch (err) {  
      console.error('Error submitting report:', err);  
      alert('提交故障报告失败，请稍后重试');  
    } finally {  
      setSubmitting(false);  
    }  
  };  
  
  const handleReportChange = (field, value) => {  
    setReportForm(prev => ({ ...prev, [field]: value }));  
  };  
  
  const renderStarRating = (rating) => {  
    const stars = [];  
    const fullStars = Math.floor(rating);  
    const hasHalfStar = rating % 1 !== 0;  
    
    for (let i = 1; i <= 5; i++) {  
      if (i <= fullStars) {  
        stars.push(<FaStar key={i} className="text-warning" />);  
      } else if (i === fullStars + 1 && hasHalfStar) {  
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);  
      } else {  
        stars.push(<FaRegStar key={i} className="text-warning" />);  
      }  
    }  
    
    return stars;  
  };  
  
  const calculateAverageRating = (reviews) => {  
    if (!reviews || reviews.length === 0) return 0;  
    const sum = reviews.reduce((total, review) => total + review.rating, 0);  
    return (sum / reviews.length).toFixed(1);  
  };  

  if (loading) {  
    return (  
      <Container className="py-5 text-center">  
        <Spinner animation="border" variant="primary" />  
        <p className="mt-3">正在加载滑板车详情...</p>  
      </Container>  
    );  
  }  

  if (error || !scooter) {  
    return (  
      <Container className="py-5">  
        <Alert variant="danger">  
          <FaExclamationCircle className="me-2" />  
          {error || '未找到滑板车信息'}  
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
    <Container className="scooter-details-container py-5">  
      <div className="d-flex align-items-center mb-4">  
        <Button   
          variant="link"   
          className="p-0 me-3 back-button"  
          onClick={() => navigate('/scooters')}  
        >  
          <FaArrowLeft /> 返回列表  
        </Button>  
        <h1 className="mb-0">{scooter.model}</h1>  
        <span className="ms-3">{getStatusBadge(scooter.status)}</span>  
      </div>  
      
      <Row className="gx-lg-5">  
        <Col lg={6} className="mb-4 mb-lg-0">  
          <div className="scooter-main-image">  
            <img   
              src={scooter.imageUrl || '/images/default-scooter.jpg'}   
              alt={`${scooter.model} 电动滑板车`}  
              className="img-fluid rounded"  
            />  
            <div className="scooter-id-badge">  
              {scooter.id}  
            </div>  
          </div>  
          
          <div className="mt-4">  
            <Card className="border-0 shadow-sm">  
              <Card.Body>  
                <h5 className="mb-3">滑板车位置</h5>  
                <div className="scooter-location mb-3">  
                  <FaMapMarkerAlt className="me-2 text-primary" />  
                  {scooter.location}  
                </div>  
                <Map   
                  height="250px"  
                  center={scooter.coordinates}  
                  zoom={16}  
                  showControls={false}  
                  selectedScooterId={scooter.id}  
                />  
              </Card.Body>  
            </Card>  
          </div>  
        </Col>  
        
        <Col lg={6}>  
          <Card className="border-0 shadow-sm mb-4">  
            <Card.Body>  
              <h5 className="mb-3">出租价格</h5>  
              <Row className="pricing-info">  
                <Col xs={6} md={3} className="price-option">  
                  <div className="price-duration">  
                    <FaClock className="me-1" /> 1小时  
                  </div>  
                  <div className="price-amount">¥{scooter.pricePerHour}</div>  
                </Col>  
                <Col xs={6} md={3} className="price-option">  
                  <div className="price-duration">  
                    <FaClock className="me-1" /> 4小时  
                  </div>  
                  <div className="price-amount">¥{scooter.pricePerFourHours}</div>  
                </Col>  
                <Col xs={6} md={3} className="price-option">  
                  <div className="price-duration">  
                    <FaCalendarAlt className="me-1" /> 1天  
                  </div>  
                  <div className="price-amount">¥{scooter.pricePerDay}</div>  
                </Col>  
                <Col xs={6} md={3} className="price-option">  
                  <div className="price-duration">  
                    <FaCalendarAlt className="me-1" /> 1周  
                  </div>  
                  <div className="price-amount">¥{scooter.pricePerWeek}</div>  
                </Col>  
              </Row>  
              
              {scooter.status === 'available' && (  
                <div className="d-grid mt-3">  
                  <Button   
                    variant="primary"   
                    size="lg"  
                    onClick={() => navigate(`/scooters/${scooter.id}/rent`)}  
                  >  
                    立即租用  
                  </Button>  
                </div>  
              )}  
              
              {scooter.status !== 'available' && (  
                <Alert variant="warning" className="mt-3 mb-0">  
                  <FaExclamationTriangle className="me-2" />  
                  此滑板车当前不可用  
                </Alert>  
              )}  
            </Card.Body>  
          </Card>  
          
          <Tabs  
            activeKey={activeTab}  
            onSelect={(k) => setActiveTab(k)}  
            className="mb-4"  
          >  
            <Tab eventKey="info" title="基本信息">  
              <Card className="border-0 shadow-sm">  
                <Card.Body>  
                  <div className="battery-status mb-3">  
                    <h6>电池状态</h6>  
                    <div className="d-flex align-items-center">  
                      <FaBatteryThreeQuarters   
                        size={24}   
                        className={`me-2 text-${getBatteryVariant(scooter.batteryLevel)}`}   
                      />  
                      <div className="flex-grow-1">  
                        <div className="d-flex justify-content-between mb-1">  
                          <span>电量</span>  
                          <strong>{scooter.batteryLevel}%</strong>  
                        </div>  
                        <div className="progress" style={{ height: '8px' }}>  
                          <div   
                            className={`progress-bar bg-${getBatteryVariant(scooter.batteryLevel)}`}   
                            role="progressbar"   
                            style={{ width: `${scooter.batteryLevel}%` }}   
                            aria-valuenow={scooter.batteryLevel}   
                            aria-valuemin="0"   
                            aria-valuemax="100"  
                          ></div>  
                        </div>  
                      </div>  
                    </div>  
                  </div>  
                  
                  <h6>技术规格</h6>  
                  <ListGroup variant="flush" className="specs-list">  
                    <ListGroup.Item className="d-flex justify-content-between px-0">  
                      <span>最高时速</span>  
                      <strong>{scooter.maxSpeed} km/h</strong>  
                    </ListGroup.Item>  
                    <ListGroup.Item className="d-flex justify-content-between px-0">  
                      <span>续航里程</span>  
                      <strong>{scooter.range} km</strong>  
                    </ListGroup.Item>  
                    <ListGroup.Item className="d-flex justify-content-between px-0">  
                      <span>车身重量</span>  
                      <strong>{scooter.weight} kg</strong>  
                    </ListGroup.Item>  
                    <ListGroup.Item className="d-flex justify-content-between px-0">  
                      <span>最大载重</span>  
                      <strong>{scooter.maxLoad} kg</strong>  
                    </ListGroup.Item>  
                    <ListGroup.Item className="d-flex justify-content-between px-0">  
                      <span>出厂日期</span>  
                      <strong>{scooter.manufacturingDate}</strong>  
                    </ListGroup.Item>  
                    <ListGroup.Item className="d-flex justify-content-between px-0">  
                      <span>最近维护</span>  
                      <strong>{scooter.lastMaintenanceDate}</strong>  
                    </ListGroup.Item>  
                  </ListGroup>  
                  
                  <h6 className="mt-3">特色功能</h6>  
                  <div className="features-list">  
                    {scooter.features.map((feature, index) => (  
                      <Badge   
                        bg="light"   
                        text="dark"   
                        className="feature-badge me-2 mb-2"   
                        key={index}  
                      >  
                        {feature}  
                      </Badge>  
                    ))}  
                  </div>  
                  
                  <h6 className="mt-3">产品描述</h6>  
                  <p className="mb-0">{scooter.description}</p>  
                </Card.Body>  
              </Card>  
            </Tab>  
            
            <Tab eventKey="reviews" title="用户评价">  
              <Card className="border-0 shadow-sm">  
                <Card.Body>  
                  <div className="d-flex align-items-center mb-4">  
                    <div className="rating-summary me-4">  
                      <div className="average-rating">{calculateAverageRating(scooter.reviews)}</div>  
                      <div>{renderStarRating(parseFloat(calculateAverageRating(scooter.reviews)))}</div>  
                      <div className="review-count mt-1">{scooter.reviews.length} 条评价</div>  
                    </div>  
                    <div className="rating-distribution flex-grow-1">  
                      {/* Rating distribution bars would go here */}  
                    </div>  
                  </div>  
                  
                  {scooter.reviews.length === 0 ? (  
                    <div className="text-center py-4">  
                      <p className="text-muted">暂无评价</p>  
                    </div>  
                  ) : (  
                    <div className="reviews-list">  
                      {scooter.reviews.map(review => (  
                        <div key={review.id} className="review-item">  
                          <div className="d-flex justify-content-between">  
                            <div className="reviewer-info">  
                              <div className="reviewer-name">{review.user}</div>  
                              <div className="review-date text-muted">{review.date}</div>  
                            </div>  
                            <div>{renderStarRating(review.rating)}</div>  
                          </div>  
                          <p className="review-comment mt-2 mb-0">{review.comment}</p>  
                        </div>  
                      ))}  
                    </div>  
                  )}  
                </Card.Body>  
              </Card>  
            </Tab>  
            
            <Tab eventKey="maintenance" title="维护记录">  
              <Card className="border-0 shadow-sm">  
                <Card.Body>  
                  <h6 className="mb-3">历史维护记录</h6>  
                  
                  {scooter.issues.length === 0 ? (  
                    <div className="text-center py-4">  
                      <p className="text-muted">暂无维护记录</p>  
                    </div>  
                  ) : (  
                    <div className="maintenance-timeline">  
                      {scooter.issues.map(issue => (  
                        <div key={issue.id} className="maintenance-item">  
                          <div className="maintenance-status">  
                            {issue.status === 'resolved' ? (  
                              <FaCheckCircle className="text-success" />  
                            ) : (  
                              <FaWrench className="text-warning" />  
                            )}  
                          </div>  
                          <div className="maintenance-content">  
                            <div className="maintenance-date">{issue.date}</div>  
                            <div className="maintenance-description">  
                              <strong>{issue.description}</strong>  
                            </div>  
                            {issue.resolution && (  
                              <div className="maintenance-resolution text-muted">  
                                解决方案: {issue.resolution}  
                              </div>  
                            )}  
                          </div>  
                        </div>  
                      ))}  
                    </div>  
                  )}  
                  
                  <div className="d-grid mt-4">  
                    <Button   
                      variant="outline-danger"   
                      onClick={() => setShowReportModal(true)}  
                    >  
                      <FaExclamationTriangle className="me-2" />  
                      报告故障或问题  
                    </Button>  
                  </div>  
                </Card.Body>  
              </Card>  
            </Tab>  
          </Tabs>  
        </Col>  
      </Row>  
      
      {/* Report Issue Modal */}  
      <Modal show={showReportModal} onHide={() => !submitting && setShowReportModal(false)}>  
        <Modal.Header closeButton>  
          <Modal.Title>报告故障或问题</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          {reportSuccess ? (  
            <div className="text-center py-3">  
              <FaCheckCircle size={48} className="text-success mb-3" />  
              <h5>感谢您的反馈</h5>  
              <p className="text-muted">我们会尽快处理您报告的问题。</p>  
            </div>  
          ) : (  
            <Form onSubmit={handleReportSubmit}>  
              <Form.Group className="mb-3">  
                <Form.Label>问题类型</Form.Label>  
                <Form.Select   
                  value={reportForm.issue}   
                  onChange={(e) => handleReportChange('issue', e.target.value)}  
                  required  
                >  
                  <option value="">选择问题类型...</option>  
                  <option value="battery">电池问题</option>  
                  <option value="brakes">刹车问题</option>  
                  <option value="wheels">轮胎问题</option>  
                  <option value="display">显示屏问题</option>  
                  <option value="motor">电机问题</option>  
                  <option value="lights">灯光问题</option>  
                  <option value="other">其他问题</option>  
                </Form.Select>  
              </Form.Group>  
              
              <Form.Group className="mb-3">  
                <Form.Label>问题描述</Form.Label>  
                <Form.Control   
                  as="textarea"   
                  rows={4}  
                  value={reportForm.description}  
                  onChange={(e) => handleReportChange('description', e.target.value)}  
                  placeholder="请详细描述您遇到的问题..."  
                  required  
                />  
              </Form.Group>  
              
              <Form.Group className="mb-3">  
                <Form.Label>紧急程度</Form.Label>  
                <Form.Select   
                  value={reportForm.priority}  
                  onChange={(e) => handleReportChange('priority', e.target.value)}  
                >  
                  <option value="low">一般 - 不影响使用</option>  
                  <option value="medium">中等 - 部分影响使用</option>  
                  <option value="high">紧急 - 无法使用</option>  
                </Form.Select>  
              </Form.Group>  
              
              <div className="d-grid">  
                <Button   
                  type="submit"   
                  variant="primary"  
                  disabled={submitting}  
                >  
                  {submitting ? (  
                    <>  
                      <Spinner   
                        as="span"   
                        animation="border"   
                        size="sm"   
                        className="me-2"   
                      />  
                      提交中...  
                    </>  
                  ) : '提交报告'}  
                </Button>  
              </div>  
            </Form>  
          )}  
        </Modal.Body>  
      </Modal>  
    </Container>  
  );  
};  

export default ScooterDetails;