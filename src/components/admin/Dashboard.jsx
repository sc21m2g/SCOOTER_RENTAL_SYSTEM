import React, { useState, useEffect } from 'react';  
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup } from 'react-bootstrap';  
import { Link } from 'react-router-dom';  
import {   
  FaUsers, FaBiking, FaChartLine, FaExclamationTriangle,   
  FaMoneyBillWave, FaSearch, FaFilter, FaCalendarAlt   
} from 'react-icons/fa';  
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,   
  LineChart, Line, PieChart, Pie, Cell } from 'recharts';  
import { adminService } from '../../services/admin.service';  

const Dashboard = () => {  
  const [stats, setStats] = useState({  
    totalUsers: 0,  
    activeUsers: 0,  
    totalScooters: 0,  
    availableScooters: 0,  
    totalRentals: 0,  
    activeRentals: 0,  
    totalRevenue: 0,  
    pendingIssues: 0  
  });  
  
  const [revenueData, setRevenueData] = useState([]);  
  const [rentalData, setRentalData] = useState([]);  
  const [userDistribution, setUserDistribution] = useState([]);  
  const [recentRentals, setRecentRentals] = useState([]);  
  const [timeframe, setTimeframe] = useState('week');  
  const [isLoading, setIsLoading] = useState(true);  
  
  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'];  

  useEffect(() => {  
    const fetchDashboardData = async () => {  
      try {  
        setIsLoading(true);  
        
        // 在实际应用中，这些数据应该从API获取  
        // const response = await adminService.getDashboardStats(timeframe);  
        
        // 模拟API响应数据  
        const mockStats = {  
          totalUsers: 1248,  
          activeUsers: 857,  
          totalScooters: 350,  
          availableScooters: 289,  
          totalRentals: 5674,  
          activeRentals: 47,  
          totalRevenue: 42689.50,  
          pendingIssues: 12  
        };  
        
        const mockRevenueData = [  
          { name: '周一', 收入: 1200 },  
          { name: '周二', 收入: 1900 },  
          { name: '周三', 收入: 2100 },  
          { name: '周四', 收入: 1500 },  
          { name: '周五', 收入: 2300 },  
          { name: '周六', 收入: 2900 },  
          { name: '周日', 收入: 2700 }  
        ];  
        
        const mockRentalData = [  
          { name: '周一', 订单数: 45 },  
          { name: '周二', 订单数: 52 },  
          { name: '周三', 订单数: 49 },  
          { name: '周四', 订单数: 38 },  
          { name: '周五', 订单数: 65 },  
          { name: '周六', 订单数: 87 },  
          { name: '周日', 订单数: 78 }  
        ];  
        
        const mockUserDistribution = [  
          { name: '新用户', value: 120 },  
          { name: '活跃用户', value: 300 },  
          { name: '偶尔用户', value: 180 },  
          { name: '休眠用户', value: 200 }  
        ];  
        
        const mockRecentRentals = [  
          { id: 'ORD123456', user: '张三', scooter: 'SC-2021', time: '2023-10-01 14:30', duration: '2小时', amount: '¥25.00', status: 'active' },  
          { id: 'ORD123457', user: '李四', scooter: 'SC-1045', time: '2023-10-01 13:15', duration: '1小时', amount: '¥15.00', status: 'completed' },  
          { id: 'ORD123458', user: '王五', scooter: 'SC-3067', time: '2023-10-01 12:00', duration: '3小时', amount: '¥35.00', status: 'completed' },  
          { id: 'ORD123459', user: '赵六', scooter: 'SC-4023', time: '2023-10-01 11:45', duration: '30分钟', amount: '¥10.00', status: 'active' },  
          { id: 'ORD123460', user: '钱七', scooter: 'SC-1089', time: '2023-10-01 10:30', duration: '45分钟', amount: '¥12.00', status: 'completed' }  
        ];  
        
        setStats(mockStats);  
        setRevenueData(mockRevenueData);  
        setRentalData(mockRentalData);  
        setUserDistribution(mockUserDistribution);  
        setRecentRentals(mockRecentRentals);  
        
        setIsLoading(false);  
      } catch (error) {  
        console.error('获取仪表盘数据失败:', error);  
        setIsLoading(false);  
      }  
    };  
    
    fetchDashboardData();  
  }, [timeframe]);  
  
  return (  
    <Container fluid className="py-4">  
      <Row className="mb-4">  
        <Col>  
          <h2 className="mb-1">管理员仪表盘</h2>  
          <p className="text-muted">系统概览和数据统计</p>  
        </Col>  
        <Col xs="auto">  
          <InputGroup>  
            <InputGroup.Text>  
              <FaCalendarAlt />  
            </InputGroup.Text>  
            <Form.Select   
              value={timeframe}  
              onChange={(e) => setTimeframe(e.target.value)}  
            >  
              <option value="day">今日</option>  
              <option value="week">本周</option>  
              <option value="month">本月</option>  
              <option value="year">今年</option>  
            </Form.Select>  
          </InputGroup>  
        </Col>  
      </Row>  
      
      {/* 统计卡片 */}  
      <Row className="g-3 mb-4">  
        <Col md={6} xl={3}>  
          <Card className="h-100 border-0 shadow-sm">  
            <Card.Body>  
              <div className="d-flex justify-content-between align-items-center">  
                <div>  
                  <h6 className="text-muted mb-2">总用户数</h6>  
                  <h3 className="mb-0">{stats.totalUsers}</h3>  
                  <div className="text-success small mt-2">  
                    <span>活跃：{stats.activeUsers}</span>  
                  </div>  
                </div>  
                <div className="icon-bg bg-primary-light">  
                  <FaUsers className="text-primary" size={24} />  
                </div>  
              </div>  
              <div className="mt-3">  
                <Button as={Link} to="/admin/user-management" variant="outline-primary" size="sm">  
                  查看用户  
                </Button>  
              </div>  
            </Card.Body>  
          </Card>  
        </Col>  
        
        <Col md={6} xl={3}>  
          <Card className="h-100 border-0 shadow-sm">  
            <Card.Body>  
              <div className="d-flex justify-content-between align-items-center">  
                <div>  
                  <h6 className="text-muted mb-2">滑板车数量</h6>  
                  <h3 className="mb-0">{stats.totalScooters}</h3>  
                  <div className="text-success small mt-2">  
                    <span>可用：{stats.availableScooters}</span>  
                  </div>  
                </div>  
                <div className="icon-bg bg-success-light">  
                  <FaBiking className="text-success" size={24} />  
                </div>  
              </div>  
              <div className="mt-3">  
                <Button as={Link} to="/admin/scooter-management" variant="outline-success" size="sm">  
                  管理设备  
                </Button>  
              </div>  
            </Card.Body>  
          </Card>  
        </Col>  
        
        <Col md={6} xl={3}>  
          <Card className="h-100 border-0 shadow-sm">  
            <Card.Body>  
              <div className="d-flex justify-content-between align-items-center">  
                <div>  
                  <h6 className="text-muted mb-2">总营收</h6>  
                  <h3 className="mb-0">¥{stats.totalRevenue.toLocaleString()}</h3>  
                  <div className="text-success small mt-2">  
                    <span>订单数：{stats.totalRentals}</span>  
                  </div>  
                </div>  
                <div className="icon-bg bg-info-light">  
                  <FaMoneyBillWave className="text-info" size={24} />  
                </div>  
              </div>  
              <div className="mt-3">  
                <Button as={Link} to="/admin/pricing-settings" variant="outline-info" size="sm">  
                  定价设置  
                </Button>  
              </div>  
            </Card.Body>  
          </Card>  
        </Col>  
        
        <Col md={6} xl={3}>  
          <Card className="h-100 border-0 shadow-sm">  
            <Card.Body>  
              <div className="d-flex justify-content-between align-items-center">  
                <div>  
                  <h6 className="text-muted mb-2">待处理问题</h6>  
                  <h3 className="mb-0">{stats.pendingIssues}</h3>  
                  <div className="text-warning small mt-2">  
                    <span>当前租赁：{stats.activeRentals}</span>  
                  </div>  
                </div>  
                <div className="icon-bg bg-warning-light">  
                  <FaExclamationTriangle className="text-warning" size={24} />  
                </div>  
              </div>  
              <div className="mt-3">  
                <Button as={Link} to="/admin/issues-list" variant="outline-warning" size="sm">  
                  查看问题  
                </Button>  
              </div>  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
      
      {/* 图表区域 */}  
      <Row className="mb-4">  
        <Col xl={8}>  
          <Card className="border-0 shadow-sm mb-4">  
            <Card.Header className="bg-white border-0 pt-4 pb-0">  
              <h5 className="mb-0">收入统计</h5>  
            </Card.Header>  
            <Card.Body>  
              <ResponsiveContainer width="100%" height={300}>  
                <BarChart  
                  data={revenueData}  
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}  
                >  
                  <CartesianGrid strokeDasharray="3 3" />  
                  <XAxis dataKey="name" />  
                  <YAxis />  
                  <Tooltip formatter={(value) => [`¥${value}`, '收入']} />  
                  <Legend />  
                  <Bar dataKey="收入" fill="#4CAF50" barSize={40} />  
                </BarChart>  
              </ResponsiveContainer>  
            </Card.Body>  
          </Card>  
          
          <Card className="border-0 shadow-sm">  
            <Card.Header className="bg-white border-0 pt-4 pb-0">  
              <h5 className="mb-0">租赁订单统计</h5>  
            </Card.Header>  
            <Card.Body>  
              <ResponsiveContainer width="100%" height={300}>  
                <LineChart  
                  data={rentalData}  
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}  
                >  
                  <CartesianGrid strokeDasharray="3 3" />  
                  <XAxis dataKey="name" />  
                  <YAxis />  
                  <Tooltip />  
                  <Legend />  
                  <Line type="monotone" dataKey="订单数" stroke="#2196F3" strokeWidth={2} />  
                </LineChart>  
              </ResponsiveContainer>  
            </Card.Body>  
          </Card>  
        </Col>  
        
        <Col xl={4}>  
          <Card className="border-0 shadow-sm mb-4">  
            <Card.Header className="bg-white border-0 pt-4 pb-0">  
              <h5 className="mb-0">用户分布</h5>  
            </Card.Header>  
            <Card.Body className="d-flex flex-column align-items-center">  
              <ResponsiveContainer width="100%" height={250}>  
                <PieChart>  
                  <Pie  
                    data={userDistribution}  
                    cx="50%"  
                    cy="50%"  
                    labelLine={false}  
                    outerRadius={80}  
                    fill="#8884d8"  
                    dataKey="value"  
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}  
                  >  
                    {userDistribution.map((entry, index) => (  
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
                    ))}  
                  </Pie>  
                  <Tooltip formatter={(value, name) => [value, name]} />  
                </PieChart>  
              </ResponsiveContainer>  
              
              <div className="w-100 mt-3">  
                {userDistribution.map((entry, index) => (  
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">  
                    <div className="d-flex align-items-center">  
                      <div  
                        style={{  
                          width: 12,  
                          height: 12,  
                          backgroundColor: COLORS[index % COLORS.length],  
                          marginRight: 8,  
                          borderRadius: 2,  
                        }}  
                      />  
                      <span>{entry.name}</span>  
                    </div>  
                    <span>{entry.value}</span>  
                  </div>  
                ))}  
              </div>  
            </Card.Body>  
          </Card>  
          
          <Card className="border-0 shadow-sm">  
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">  
              <h5 className="mb-0">实时状态</h5>  
              <Badge bg="success" pill>{stats.activeRentals} 活跃租赁</Badge>  
            </Card.Header>  
            <Card.Body>  
              <div className="d-flex justify-content-between mb-4">  
                <div className="text-center">  
                  <h5 className="mb-0 text-success">{stats.availableScooters}</h5>  
                  <small className="text-muted">可用设备</small>  
                </div>  
                <div className="text-center">  
                  <h5 className="mb-0 text-warning">{stats.totalScooters - stats.availableScooters - 10}</h5>  
                  <small className="text-muted">使用中</small>  
                </div>  
                <div className="text-center">  
                  <h5 className="mb-0 text-danger">10</h5>  
                  <small className="text-muted">维修中</small>  
                </div>  
              </div>  
              
              <div className="progress mb-4" style={{ height: 8 }}>  
                <div   
                  className="progress-bar bg-success"   
                  style={{ width: `${(stats.availableScooters / stats.totalScooters) * 100}%` }}  
                ></div>  
                <div   
                  className="progress-bar bg-warning"   
                  style={{ width: `${((stats.totalScooters - stats.availableScooters - 10) / stats.totalScooters) * 100}%` }}  
                ></div>  
                <div   
                  className="progress-bar bg-danger"   
                  style={{ width: `${(10 / stats.totalScooters) * 100}%` }}  
                ></div>  
              </div>  
              
              <div className="d-flex justify-content-between text-muted small">  
                <span>设备健康度</span>  
                <span>95%</span>  
              </div>  
            </Card.Body>  
          </Card>  
        </Col>  
      </Row>  
      
      {/* 最近租赁 */}  
      <Row>  
        <Col>  
          <Card className="border-0 shadow-sm">  
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">  
              <h5 className="mb-0">最近租赁订单</h5>  
              <div className="d-flex gap-2">  
                <InputGroup size="sm">  
                  <InputGroup.Text>  
                    <FaSearch />  
                  </InputGroup.Text>  
                  <Form.Control placeholder="搜索订单..." />  
                </InputGroup>  
                <Button variant="outline-secondary" size="sm">  
                  <FaFilter /> 筛选  
                </Button>  
              </div>  
            </Card.Header>  
            <Card.Body className="p-0">  
              <Table responsive hover className="mb-0">  
                <thead className="bg-light">  
                  <tr>  
                    <th>订单号</th>  
                    <th>用户</th>  
                    <th>滑板车ID</th>  
                    <th>时间</th>  
                    <th>时长</th>  
                    <th>金额</th>  
                    <th>状态</th>  
                    <th>操作</th>  
                  </tr>  
                </thead>  
                <tbody>  
                  {recentRentals.map((rental, index) => (  
                    <tr key={index}>  
                      <td>{rental.id}</td>  
                      <td>{rental.user}</td>  
                      <td>{rental.scooter}</td>  
                      <td>{rental.time}</td>  
                      <td>{rental.duration}</td>  
                      <td>{rental.amount}</td>  
                      <td>  
                        <Badge bg={rental.status === 'active' ? 'success' : 'secondary'}>  
                          {rental.status === 'active' ? '进行中' : '已完成'}  
                        </Badge>  
                      </td>  
                      <td>  
                        <Button variant="link" size="sm" className="p-0 text-primary me-2">  
                          详情  
                        </Button>  
                      </td>  
                    </tr>  
                  ))}  
                </tbody>  
              </Table>  
            </Card.Body>  
            <Card.Footer className="bg-white text-center py-3">  
              <Button variant="outline-primary" size="sm">  
                查看所有订单  
              </Button>  
            </Card.Footer>  
          </Card>  
        </Col>  
      </Row>  
    </Container>  
  );  
};  

export default Dashboard;