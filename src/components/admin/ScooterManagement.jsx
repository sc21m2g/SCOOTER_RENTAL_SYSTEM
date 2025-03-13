import React, { useState, useEffect } from 'react';  
import { Container, Row, Col, Card, Table, Form, Button, InputGroup, Modal, Badge, Pagination, Nav, Tab, Alert } from 'react-bootstrap';  
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTimes, FaTrash, FaExclamationTriangle, FaFileExport, FaSortAmountDown, FaSortAmountUp, FaBatteryFull, FaBatteryHalf, FaBatteryEmpty, FaLocationArrow, FaExchangeAlt, FaBicycle, FaQrcode } from 'react-icons/fa';  
import { adminService } from '../../services/admin.service';  

const ScooterManagement = () => {  
  const [scooters, setScooters] = useState([]);  
  const [filteredScooters, setFilteredScooters] = useState([]);  
  const [searchTerm, setSearchTerm] = useState('');  
  const [currentPage, setCurrentPage] = useState(1);  
  const [scootersPerPage] = useState(10);  
  const [sortField, setSortField] = useState('id');  
  const [sortDirection, setSortDirection] = useState('asc');  
  const [showAddModal, setShowAddModal] = useState(false);  
  const [showEditModal, setShowEditModal] = useState(false);  
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [showLocationModal, setShowLocationModal] = useState(false);  
  const [selectedScooter, setSelectedScooter] = useState(null);  
  const [scooterForm, setScooterForm] = useState({  
    model: '',  
    batteryLevel: 100,  
    status: 'available',  
    location: {  
      latitude: '',  
      longitude: ''  
    },  
    lastMaintenance: '',  
    manufactureDate: ''  
  });  
  const [activeTab, setActiveTab] = useState('all');  
  const [validated, setValidated] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);  
  const [message, setMessage] = useState({ type: '', text: '' });  
  const [filterOptions, setFilterOptions] = useState({  
    status: 'all',  
    batteryLevel: 'all',  
    model: 'all'  
  });  
  
  // 初始化和加载滑板车数据  
  useEffect(() => {  
    const fetchScooters = async () => {  
      try {  
        setIsLoading(true);  
        
        // 模拟从API获取滑板车数据  
        // const response = await adminService.getScooters();  
        
        const scooterModels = ['X1 Pro', 'X2 Lite', 'X3 Max', 'Urban Rider', 'City Explorer'];  
        const locations = [  
          { latitude: 39.9042, longitude: 116.4074 }, // 北京  
          { latitude: 31.2304, longitude: 121.4737 }, // 上海  
          { latitude: 22.5431, longitude: 114.0579 }, // 深圳  
          { latitude: 30.5728, longitude: 104.0668 }, // 成都  
          { latitude: 23.1291, longitude: 113.2644 }  // 广州  
        ];  
        
        const mockScooters = Array(50).fill().map((_, index) => {  
          const id = `SC-${String(1000 + index).substring(1)}`;  
          const model = scooterModels[Math.floor(Math.random() * scooterModels.length)];  
          const batteryLevel = Math.floor(Math.random() * 100) + 1;  
          
          // 决定状态，大部分是可用的  
          let status;  
          if (index % 10 === 0) status = 'maintenance';  
          else if (index % 7 === 0) status = 'rented';  
          else status = 'available';  
          
          // 随机位置  
          const locationIndex = Math.floor(Math.random() * locations.length);  
          const location = {  
            latitude: (locations[locationIndex].latitude + (Math.random() * 0.02 - 0.01)).toFixed(4),  
            longitude: (locations[locationIndex].longitude + (Math.random() * 0.02 - 0.01)).toFixed(4)  
          };  
          
          return {  
            id,  
            model,  
            batteryLevel,  
            status,  
            location,  
            totalRentals: Math.floor(Math.random() * 100),  
            totalRevenue: (Math.random() * 2000 + 500).toFixed(2),  
            lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  
            manufactureDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  
            currentUser: status === 'rented' ? `用户${Math.floor(Math.random() * 100) + 1}` : null  
          };  
        });  
        
        setScooters(mockScooters);  
        setFilteredScooters(mockScooters);  
        setIsLoading(false);  
      } catch (error) {  
        console.error('获取滑板车列表失败:', error);  
        setMessage({ type: 'danger', text: '获取滑板车列表失败，请稍后重试' });  
        setIsLoading(false);  
      }  
    };  
    
    fetchScooters();  
  }, []);  
  
  // 搜索和筛选逻辑  
  useEffect(() => {  
    const filterScooters = () => {  
      let filtered = scooters;  
      
      // 根据Tab过滤  
      if (activeTab !== 'all') {  
        filtered = filtered.filter(scooter => scooter.status === activeTab);  
      }  
      
      // 搜索过滤  
      if (searchTerm) {  
        filtered = filtered.filter(scooter =>   
          scooter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||  
          scooter.model.toLowerCase().includes(searchTerm.toLowerCase())  
        );  
      }  
      
      // 状态过滤  
      if (filterOptions.status !== 'all') {  
        filtered = filtered.filter(scooter => scooter.status === filterOptions.status);  
      }  
      
      // 电量过滤  
      if (filterOptions.batteryLevel !== 'all') {  
        if (filterOptions.batteryLevel === 'high') {  
          filtered = filtered.filter(scooter => scooter.batteryLevel >= 80);  
        } else if (filterOptions.batteryLevel === 'medium') {  
          filtered = filtered.filter(scooter => scooter.batteryLevel >= 30 && scooter.batteryLevel < 80);  
        } else if (filterOptions.batteryLevel === 'low') {  
          filtered = filtered.filter(scooter => scooter.batteryLevel < 30);  
        }  
      }  
      
      // 型号过滤  
      if (filterOptions.model !== 'all') {  
        filtered = filtered.filter(scooter => scooter.model === filterOptions.model);  
      }  
      
      // 排序  
      filtered.sort((a, b) => {  
        let comparison = 0;  
        
        if (sortField === 'id') {  
          comparison = a.id.localeCompare(b.id);  
        } else if (sortField === 'model') {  
          comparison = a.model.localeCompare(b.model);  
        } else if (sortField === 'batteryLevel') {  
          comparison = a.batteryLevel - b.batteryLevel;  
        } else if (sortField === 'totalRentals') {  
          comparison = a.totalRentals - b.totalRentals;  
        } else if (sortField === 'totalRevenue') {  
          comparison = parseFloat(a.totalRevenue) - parseFloat(b.totalRevenue);  
        } else if (sortField === 'lastMaintenance') {  
          comparison = new Date(a.lastMaintenance) - new Date(b.lastMaintenance);  
        }  
        
        return sortDirection === 'asc' ? comparison : -comparison;  
      });  
      
      setFilteredScooters(filtered);  
      setCurrentPage(1);  
    };  
    
    filterScooters();  
  }, [scooters, activeTab, searchTerm, filterOptions, sortField, sortDirection]);  
  
  // 添加新滑板车  
  const handleAddScooter = async (e) => {  
    e.preventDefault();  
    const form = e.currentTarget;  
    
    if (form.checkValidity() === false) {  
      e.stopPropagation();  
      setValidated(true);  
      return;  
    }  
    
    try {  
      setValidated(true);  
      // await adminService.createScooter(scooterForm);  
      
      // 模拟API调用  
      const newId = `SC-${String(1000 + scooters.length).substring(1)}`;  
      const newScooter = {  
        ...scooterForm,  
        id: newId,  
        totalRentals: 0,  
        totalRevenue: '0.00',  
        currentUser: null  
      };  
      
      setScooters([newScooter, ...scooters]);  
      setShowAddModal(false);  
      setMessage({ type: 'success', text: '滑板车添加成功' });  
      
      // 重置表单  
      setScooterForm({  
        model: '',  
        batteryLevel: 100,  
        status: 'available',  
        location: {  
          latitude: '',  
          longitude: ''  
        },  
        lastMaintenance: '',  
        manufactureDate: ''  
      });  
      setValidated(false);  
    } catch (error) {  
      console.error('添加滑板车失败:', error);  
      setMessage({ type: 'danger', text: '添加滑板车失败，请稍后重试' });  
    }  
  };  
  
  // 编辑滑板车  
  const handleEditScooter = async (e) => {  
    e.preventDefault();  
    const form = e.currentTarget;  
    
    if (form.checkValidity() === false) {  
      e.stopPropagation();  
      setValidated(true);  
      return;  
    }  
    
    try {  
      setValidated(true);  
      // await adminService.updateScooter(selectedScooter.id, scooterForm);  
      
      // 模拟API调用  
      const updatedScooters = scooters.map(scooter => {  
        if (scooter.id === selectedScooter.id) {  
          return { ...scooter, ...scooterForm };  
        }  
        return scooter;  
      });  
      
      setScooters(updatedScooters);  
      setShowEditModal(false);  
      setMessage({ type: 'success', text: '滑板车更新成功' });
setValidated(false);
} catch (error) {
console.error('更新滑板车失败:', error);
setMessage({ type: 'danger', text: '更新滑板车失败，请稍后重试' });
}
};

// 删除滑板车
const handleDeleteScooter = async () => {
try {
// await adminService.deleteScooter(selectedScooter.id);

  // 模拟API调用  
  const remainingScooters = scooters.filter(scooter => scooter.id !== selectedScooter.id);  
  
  setScooters(remainingScooters);  
  setShowDeleteModal(false);  
  setMessage({ type: 'success', text: '滑板车删除成功' });  
} catch (error) {  
  console.error('删除滑板车失败:', error);  
  setMessage({ type: 'danger', text: '删除滑板车失败，请稍后重试' });  
}  
};

// 分页处理
const indexOfLastScooter = currentPage * scootersPerPage;
const indexOfFirstScooter = indexOfLastScooter - scootersPerPage;
const currentScooters = filteredScooters.slice(indexOfFirstScooter, indexOfLastScooter);
const totalPages = Math.ceil(filteredScooters.length / scootersPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

// 打开编辑模态框
const openEditModal = (scooter) => {
setSelectedScooter(scooter);
setScooterForm({
model: scooter.model,
batteryLevel: scooter.batteryLevel,
status: scooter.status,
location: {
latitude: scooter.location.latitude,
longitude: scooter.location.longitude
},
lastMaintenance: scooter.lastMaintenance,
manufactureDate: scooter.manufactureDate
});
setShowEditModal(true);
};

// 打开位置查看模态框
const openLocationModal = (scooter) => {
setSelectedScooter(scooter);
setShowLocationModal(true);
};

// 打开删除模态框
const openDeleteModal = (scooter) => {
setSelectedScooter(scooter);
setShowDeleteModal(true);
};

// 获取电池图标
const getBatteryIcon = (level) => {
if (level >= 70) return <FaBatteryFull className="text-success" />;
if (level >= 30) return <FaBatteryHalf className="text-warning" />;
return <FaBatteryEmpty className="text-danger" />;
};

// 获取状态标签
const getStatusBadge = (status) => {
switch(status) {
case 'available':
return <Badge bg="success">可用</Badge>;
case 'rented':
return <Badge bg="primary">租用中</Badge>;
case 'maintenance':
return <Badge bg="warning">维修中</Badge>;
case 'disabled':
return <Badge bg="danger">禁用</Badge>;
default:
return <Badge bg="secondary">未知</Badge>;
}
};

// 切换排序方向
const toggleSort = (field) => {
if (sortField === field) {
setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
} else {
setSortField(field);
setSortDirection('asc');
}
};

// 清空消息
useEffect(() => {
if (message.text) {
const timer = setTimeout(() => {
setMessage({ type: '', text: '' });
}, 5000);

  return () => clearTimeout(timer);  
}  
}, [message]);

// 统计各状态滑板车数量
const statusCounts = {
all: scooters.length,
available: scooters.filter(s => s.status === 'available').length,
rented: scooters.filter(s => s.status === 'rented').length,
maintenance: scooters.filter(s => s.status === 'maintenance').length,
disabled: scooters.filter(s => s.status === 'disabled').length
};

// 获取所有型号列表
const uniqueModels = [...new Set(scooters.map(s => s.model))];

return (
<Container fluid className="py-4">
<Row className="mb-4">
<Col>
<h2 className="mb-1">滑板车管理</h2>
<p className="text-muted">查看、添加、编辑和删除滑板车设备</p>
</Col>
<Col xs="auto">
<Button variant="primary" onClick={() => setShowAddModal(true)}>
<FaPlus className="me-2" /> 添加滑板车
</Button>
</Col>
</Row>

  {message.text && (  
    <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>  
      {message.text}  
    </Alert>  
  )}  
  
  <Nav variant="tabs" className="mb-4">  
    <Nav.Item>  
      <Nav.Link   
        active={activeTab === 'all'}   
        onClick={() => setActiveTab('all')}  
      >  
        全部 ({statusCounts.all})  
      </Nav.Link>  
    </Nav.Item>  
    <Nav.Item>  
      <Nav.Link   
        active={activeTab === 'available'}   
        onClick={() => setActiveTab('available')}  
        className="text-success"  
      >  
        可用 ({statusCounts.available})  
      </Nav.Link>  
    </Nav.Item>  
    <Nav.Item>  
      <Nav.Link   
        active={activeTab === 'rented'}   
        onClick={() => setActiveTab('rented')}  
        className="text-primary"  
      >  
        租用中 ({statusCounts.rented})  
      </Nav.Link>  
    </Nav.Item>  
    <Nav.Item>  
      <Nav.Link   
        active={activeTab === 'maintenance'}   
        onClick={() => setActiveTab('maintenance')}  
        className="text-warning"  
      >  
        维修中 ({statusCounts.maintenance})  
      </Nav.Link>  
    </Nav.Item>  
    <Nav.Item>  
      <Nav.Link   
        active={activeTab === 'disabled'}   
        onClick={() => setActiveTab('disabled')}  
        className="text-danger"  
      >  
        禁用 ({statusCounts.disabled || 0})  
      </Nav.Link>  
    </Nav.Item>  
  </Nav>  
  
  <Card className="border-0 shadow-sm mb-4">  
    <Card.Body>  
      <Row className="mb-3">  
        <Col md={4} xl={3}>  
          <InputGroup>  
            <InputGroup.Text>  
              <FaSearch />  
            </InputGroup.Text>  
            <Form.Control  
              placeholder="搜索滑板车ID或型号..."  
              value={searchTerm}  
              onChange={(e) => setSearchTerm(e.target.value)}  
            />  
          </InputGroup>  
        </Col>  
        <Col md={8} xl={9}>  
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">  
            <InputGroup>  
              <InputGroup.Text>状态</InputGroup.Text>  
              <Form.Select  
                value={filterOptions.status}  
                onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}  
                style={{ width: 'auto' }}  
              >  
                <option value="all">全部</option>  
                <option value="available">可用</option>  
                <option value="rented">租用中</option>  
                <option value="maintenance">维修中</option>  
                <option value="disabled">禁用</option>  
              </Form.Select>  
            </InputGroup>  
            
            <InputGroup>  
              <InputGroup.Text>电量</InputGroup.Text>  
              <Form.Select  
                value={filterOptions.batteryLevel}  
                onChange={(e) => setFilterOptions({ ...filterOptions, batteryLevel: e.target.value })}  
                style={{ width: 'auto' }}  
              >  
                <option value="all">全部</option>  
                <option value="high">高电量 (≥80%)</option>  
                <option value="medium">中等电量 (30%-80%)</option>  
                <option value="low">低电量 (0-30%)</option>  
              </Form.Select>  
            </InputGroup>  
            
            <InputGroup>  
              <InputGroup.Text>型号</InputGroup.Text>  
              <Form.Select  
                value={filterOptions.model}  
                onChange={(e) => setFilterOptions({ ...filterOptions, model: e.target.value })}  
                style={{ width: 'auto' }}  
              >  
                <option value="all">全部</option>  
                {uniqueModels.map((model, index) => (  
                  <option key={index} value={model}>{model}</option>  
                ))}  
              </Form.Select>  
            </InputGroup>  
            
            <Button variant="outline-secondary">  
              <FaFileExport /> 导出  
            </Button>  
          </div>  
        </Col>  
      </Row>  
      
      <div className="table-responsive">  
        <Table hover className="align-middle">  
          <thead>  
            <tr>  
              <th>#</th>  
              <th   
                className="sortable"  
                onClick={() => toggleSort('id')}  
              >  
                滑板车ID   
                {sortField === 'id' && (  
                  sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                )}  
              </th>  
              <th   
                className="sortable"  
                onClick={() => toggleSort('model')}  
              >  
                型号  
                {sortField === 'model' && (  
                  sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                )}  
              </th>  
              <th   
                className="sortable"  
                onClick={() => toggleSort('batteryLevel')}  
              >  
                电量  
                {sortField === 'batteryLevel' && (  
                  sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                )}  
              </th>  
              <th>当前状态</th>  
              <th>位置</th>  
              <th   
                className="sortable"  
                onClick={() => toggleSort('totalRentals')}  
              >  
                总租赁次数  
                {sortField === 'totalRentals' && (  
                  sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                )}  
              </th>  
              <th   
                className="sortable"  
                onClick={() => toggleSort('totalRevenue')}  
              >  
                总收入  
                {sortField === 'totalRevenue' && (  
                  sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                )}  
              </th>  
              <th   
                className="sortable"  
                onClick={() => toggleSort('lastMaintenance')}  
              >  
                最后维护  
                {sortField === 'lastMaintenance' && (  
                  sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                )}  
              </th>  
              <th>当前用户</th>  
              <th>操作</th>  
            </tr>  
          </thead>  
          <tbody>  
            {isLoading ? (  
              <tr>  
                <td colSpan="11" className="text-center py-4">  
                  <div className="spinner-border text-primary" role="status">  
                    <span className="visually-hidden">Loading...</span>  
                  </div>  
                </td>  
              </tr>  
            ) : currentScooters.length === 0 ? (  
              <tr>  
                <td colSpan="11" className="text-center py-4">  
                  没有找到匹配的滑板车  
                </td>  
              </tr>  
            ) : (  
              currentScooters.map((scooter, index) => (  
                <tr key={scooter.id}>  
                  <td>{indexOfFirstScooter + index + 1}</td>  
                  <td>  
                    <div className="d-flex align-items-center">  
                      <div className="scooter-icon me-2">  
                        <FaBicycle />  
                      </div>  
                      {scooter.id}  
                      {scooter.status === 'available' && (  
                        <FaQrcode className="ms-2 text-muted" title="查看二维码" />  
                      )}  
                    </div>  
                  </td>  
                  <td>{scooter.model}</td>  
                  <td>  
                    <div className="d-flex align-items-center">  
                      {getBatteryIcon(scooter.batteryLevel)}  
                      <span className="ms-2">{scooter.batteryLevel}%</span>  
                    </div>  
                  </td>  
                  <td>{getStatusBadge(scooter.status)}</td>  
                  <td>  
                    <Button   
                      variant="link"   
                      className="p-0"   
                      onClick={() => openLocationModal(scooter)}  
                    >  
                      <FaLocationArrow className="text-primary" /> 查看  
                    </Button>  
                  </td>  
                  <td>{scooter.totalRentals}</td>  
                  <td>¥{scooter.totalRevenue}</td>  
                  <td>{scooter.lastMaintenance}</td>  
                  <td>  
                    {scooter.currentUser ? (  
                      scooter.currentUser  
                    ) : (  
                      <span className="text-muted">-</span>  
                    )}  
                  </td>  
                  <td>  
                    <div className="d-flex gap-2">  
                      <Button   
                        variant="outline-primary"   
                        size="sm"   
                        onClick={() => openEditModal(scooter)}  
                      >  
                        <FaEdit />  
                      </Button>  
                      {scooter.status === 'available' && (  
                        <Button   
                          variant="outline-warning"   
                          size="sm"  
                          onClick={() => {  
                            setSelectedScooter(scooter);  
                            setScooterForm({  
                              ...scooterForm,  
                              status: 'maintenance'  
                            });  
                            setShowEditModal(true);  
                          }}  
                          title="设为维修状态"  
                        >  
                          <FaExchangeAlt />  
                        </Button>  
                      )}  
                      <Button   
                        variant="outline-danger"   
                        size="sm"  
                        onClick={() => openDeleteModal(scooter)}  
                      >  
                        <FaTrash />  
                      </Button>  
                    </div>  
                  </td>  
                </tr>  
              ))  
            )}  
          </tbody>  
        </Table>  
      </div>  
      
      {totalPages > 1 && (  
        <div className="d-flex justify-content-between align-items-center mt-4">  
          <div>  
            显示 {indexOfFirstScooter + 1}-{Math.min(indexOfLastScooter, filteredScooters.length)} 条，共 {filteredScooters.length} 条  
          </div>  
          <Pagination>  
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />  
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />  
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {  
              let pageNumber;  
              if (totalPages <= 5) {  
                pageNumber = index + 1;  
              } else if (currentPage <= 3) {  
                pageNumber = index + 1;  
              } else if (currentPage >= totalPages - 2) {  
                pageNumber = totalPages - 4 + index;  
              } else {  
                pageNumber = currentPage - 2 + index;  
              }  
              
              return (  
                <Pagination.Item  
                  key={pageNumber}  
                  active={pageNumber === currentPage}  
                  onClick={() => paginate(pageNumber)}  
                >  
                  {pageNumber}  
                </Pagination.Item>  
              );  
            })}  
            
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />  
            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />  
          </Pagination>  
        </div>  
      )}  
    </Card.Body>  
  </Card>  
  
  {/* 添加滑板车模态框 */}  
  <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>  
    <Modal.Header closeButton>  
      <Modal.Title>添加新滑板车</Modal.Title>  
    </Modal.Header>  
    <Form noValidate validated={validated} onSubmit={handleAddScooter}>  
      <Modal.Body>  
        <Form.Group className="mb-3">  
          <Form.Label>型号</Form.Label>  
          <Form.Select  
            value={scooterForm.model}  
            onChange={(e) => setScooterForm({ ...scooterForm, model: e.target.value })}  
            required  
          >  
            <option value="">选择型号</option>  
            {uniqueModels.map((model, index) => (  
              <option key={index} value={model}>{model}</option>  
            ))}  
            <option value="other">其他</option>  
          </Form.Select>  
          <Form.Control.Feedback type="invalid">  
            请选择型号  
          </Form.Control.Feedback>  
        </Form.Group>  
        
        <Form.Group className="mb-3">  
          <Form.Label>电量 ({scooterForm.batteryLevel}%)</Form.Label>  
          <Form.Range  
            value={scooterForm.batteryLevel}  
            onChange={(e) => setScooterForm({ ...scooterForm, batteryLevel: parseInt(e.target.value) })}  
            min="0"  
            max="100"  
          />  
        </Form.Group>  
        
        <Form.Group className="mb-3">  
          <Form.Label>状态</Form.Label>  
          <Form.Select  
            value={scooterForm.status}  
            onChange={(e) => setScooterForm({ ...scooterForm, status: e.target.value })}  
            required  
          >  
            <option value="available">可用</option>  
            <option value="maintenance">维修中</option>  
            <option value="disabled">禁用</option>  
          </Form.Select>  
        </Form.Group>  
        
        <Row>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>纬度</Form.Label>  
              <Form.Control  
                type="text"  
                placeholder="例如: 39.9042"  
                value={scooterForm.location.latitude}  
                onChange={(e) => setScooterForm({  
                  ...scooterForm,  
                  location: { ...scooterForm.location, latitude: e.target.value }  
                })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入有效的纬度  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>经度</Form.Label>  
              <Form.Control  
                type="text"  
                placeholder="例如: 116.4074"  
                value={scooterForm.location.longitude}  
                onChange={(e) => setScooterForm({  
                  ...scooterForm,  
                  location: { ...scooterForm.location, longitude: e.target.value }  
                })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入有效的经度  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
        </Row>  
        
        <Row>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>最后维护日期</Form.Label>  
              <Form.Control  
                type="date"  
                value={scooterForm.lastMaintenance}  
                onChange={(e) => setScooterForm({ ...scooterForm, lastMaintenance: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请选择最后维护日期  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>生产日期</Form.Label>  
              <Form.Control  
                type="date"  
                value={scooterForm.manufactureDate}  
                onChange={(e) => setScooterForm({ ...scooterForm, manufactureDate: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请选择生产日期  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
        </Row>  
      </Modal.Body>  
      <Modal.Footer>  
        <Button variant="secondary" onClick={() => setShowAddModal(false)}>  
          取消  
        </Button>  
        <Button variant="primary" type="submit">  
          添加  
        </Button>  
      </Modal.Footer>  
    </Form>  
  </Modal>  
  
  {/* 编辑滑板车模态框 */}  
  <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>  
    <Modal.Header closeButton>  
      <Modal.Title>  
        编辑滑板车 {selectedScooter && selectedScooter.id}  
      </Modal.Title>  
    </Modal.Header>  
    <Form noValidate validated={validated} onSubmit={handleEditScooter}>  
      <Modal.Body>  
        <Form.Group className="mb-3">  
          <Form.Label>型号</Form.Label>  
          <Form.Select  
            value={scooterForm.model}  
            onChange={(e) => setScooterForm({ ...scooterForm, model: e.target.value })}  
            required  
          >  
            <option value="">选择型号</option>  
            {uniqueModels.map((model, index) => (  
              <option key={index} value={model}>{model}</option>  
            ))}  
            <option value="other">其他</option>  
          </Form.Select>  
          <Form.Control.Feedback type="invalid">  
            请选择型号  
          </Form.Control.Feedback>  
        </Form.Group>  
        
        <Form.Group className="mb-3">  
          <Form.Label>电量 ({scooterForm.batteryLevel}%)</Form.Label>  
          <Form.Range  
            value={scooterForm.batteryLevel}  
            onChange={(e) => setScooterForm({ ...scooterForm, batteryLevel: parseInt(e.target.value) })}  
            min="0"  
            max="100"  
          />  
        </Form.Group>  
        
        <Form.Group className="mb-3">  
          <Form.Label>状态</Form.Label>  
          <Form.Select  
            value={scooterForm.status}  
            onChange={(e) => setScooterForm({ ...scooterForm, status: e.target.value })}  
            required  
          >  
            <option value="available">可用</option>  
            <option value="maintenance">维修中</option>  
            <option value="disabled">禁用</option>  
          </Form.Select>  
        </Form.Group>  
        
        <Row>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>纬度</Form.Label>  
              <Form.Control  
                type="text"  
                placeholder="例如: 39.9042"  
                value={scooterForm.location.latitude}  
                onChange={(e) => setScooterForm({  
                  ...scooterForm,  
                  location: { ...scooterForm.location, latitude: e.target.value }  
                })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入有效的纬度  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>经度</Form.Label>  
              <Form.Control  
                type="text"  
                placeholder="例如: 116.4074"  
                value={scooterForm.location.longitude}  
                onChange={(e) => setScooterForm({  
                  ...scooterForm,  
                  location: { ...scooterForm.location, longitude: e.target.value }  
                })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入有效的经度  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
        </Row>  
        
        <Row>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>最后维护日期</Form.Label>  
              <Form.Control  
                type="date"  
                value={scooterForm.lastMaintenance}  
                onChange={(e) => setScooterForm({ ...scooterForm, lastMaintenance: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请选择最后维护日期  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
          <Col md={6}>  
            <Form.Group className="mb-3">  
              <Form.Label>生产日期</Form.Label>  
              <Form.Control  
                type="date"  
                value={scooterForm.manufactureDate}  
                onChange={(e) => setScooterForm({ ...scooterForm, manufactureDate: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请选择生产日期  
              </Form.Control.Feedback>  
            </Form.Group>  
          </Col>  
        </Row>  
      </Modal.Body>  
      <Modal.Footer>  
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>  
          取消  
        </Button>  
        <Button variant="primary" type="submit">  
          保存  
        </Button>  
      </Modal.Footer>  
    </Form>  
  </Modal>  
  
  {/* 删除滑板车确认模态框 */}  
  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>  
    <Modal.Header closeButton>  
      <Modal.Title>确认删除</Modal.Title>  
    </Modal.Header>  
    <Modal.Body>  
      <div className="text-center mb-4">  
        <FaExclamationTriangle size={48} className="text-warning mb-3" />  
        <h5>确定要删除此滑板车吗？</h5>  
        <p className="text-muted">  
          {selectedScooter && `滑板车ID：${selectedScooter.id}`}<br />  
          {selectedScooter && `型号：${selectedScooter.model}`}  
        </p>  
        <p className="text-danger">  
          此操作无法撤销，滑板车的所有数据将被永久删除。  
        </p>  
      </div>  
    </Modal.Body>  
    <Modal.Footer>  
      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>  
        取消  
      </Button>  
      <Button variant="danger" onClick={handleDeleteScooter}>  
        确认删除  
      </Button>  
    </Modal.Footer>  
  </Modal>  
  
  {/* 位置查看模态框 */}  
  <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} centered>  
    <Modal.Header closeButton>  
      <Modal.Title>滑板车位置</Modal.Title>  
    </Modal.Header>  
    <Modal.Body>  
      {selectedScooter && (  
        <div>  
          <p className="mb-4">  
            <strong>滑板车ID:</strong> {selectedScooter.id}<br />  
            <strong>当前位置:</strong> 纬度 {selectedScooter.location.latitude}, 经度 {selectedScooter.location.longitude}  
          </p>  
          
          <div className="map-placeholder bg-light rounded text-center p-5 mb-3">  
            <FaLocationArrow size={32} className="text-primary mb-3" />  
            <h6>地图加载中...</h6>  
            <p className="text-muted small">此处将显示滑板车在地图上的位置</p>  
          </div>  
          
          <div className="d-flex justify-content-between text-muted small">  
            <span>最后更新时间: 今天 10:25</span>  
            <Button variant="link" size="sm" className="p-0">  
              刷新位置  
            </Button>  
          </div>  
        </div>  
      )}  
    </Modal.Body>  
    <Modal.Footer>  
      <Button variant="outline-primary">  
        导航到此位置  
      </Button>  
      <Button variant="secondary" onClick={() => setShowLocationModal(false)}>  
        关闭  
      </Button>  
    </Modal.Footer>  
  </Modal>  
</Container>  
);
};

export default ScooterManagement;