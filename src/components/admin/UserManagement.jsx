import React, { useState, useEffect } from 'react';  
import { Container, Row, Col, Card, Table, Form, Button, InputGroup, Modal, Badge, Pagination, Tabs, Tab, Alert } from 'react-bootstrap';  
import { FaSearch, FaFilter, FaUserPlus, FaEdit, FaBan, FaTrash, FaCheckCircle, FaExclamationTriangle, FaFileExport, FaSortAmountDown, FaSortAmountUp, FaUserAlt } from 'react-icons/fa';  
import { adminService } from '../../services/admin.service';  

const UserManagement = () => {  
  const [users, setUsers] = useState([]);  
  const [filteredUsers, setFilteredUsers] = useState([]);  
  const [searchTerm, setSearchTerm] = useState('');  
  const [currentPage, setCurrentPage] = useState(1);  
  const [usersPerPage] = useState(10);  
  const [sortField, setSortField] = useState('createdAt');  
  const [sortDirection, setSortDirection] = useState('desc');  
  const [showAddModal, setShowAddModal] = useState(false);  
  const [showEditModal, setShowEditModal] = useState(false);  
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [selectedUser, setSelectedUser] = useState(null);  
  const [userForm, setUserForm] = useState({  
    name: '',  
    email: '',  
    phone: '',  
    role: 'user',  
    status: 'active'  
  });  
  const [validated, setValidated] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);  
  const [message, setMessage] = useState({ type: '', text: '' });  
  const [filterOptions, setFilterOptions] = useState({  
    status: 'all',  
    role: 'all',  
    dateRange: 'all'  
  });  
  
  // 获取用户列表  
  useEffect(() => {  
    const fetchUsers = async () => {  
      try {  
        setIsLoading(true);  
        
        // 模拟从API获取用户数据  
        // const response = await adminService.getUsers();  
        
        const mockUsers = Array(50).fill().map((_, index) => ({  
          id: index + 1,  
          name: `用户${index + 1}`,  
          email: `user${index + 1}@example.com`,  
          phone: `1381234${String(index + 1000).substring(1)}`,  
          role: index % 10 === 0 ? 'admin' : 'user',  
          status: index % 7 === 0 ? 'inactive' : 'active',  
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  
          lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  
          rentals: Math.floor(Math.random() * 20),  
          totalSpent: (Math.floor(Math.random() * 1000) + 100).toFixed(2)  
        }));  
        
        setUsers(mockUsers);  
        setFilteredUsers(mockUsers);  
        setIsLoading(false);  
      } catch (error) {  
        console.error('获取用户列表失败:', error);  
        setMessage({ type: 'danger', text: '获取用户列表失败，请稍后重试' });  
        setIsLoading(false);  
      }  
    };  
    
    fetchUsers();  
  }, []);  
  
  // 搜索和筛选  
  useEffect(() => {  
    const applyFilters = () => {  
      let filtered = users.filter(user => {  
        // 搜索条件  
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||  
          user.phone.includes(searchTerm);  
        
        // 状态筛选  
        const matchesStatus = filterOptions.status === 'all' || user.status === filterOptions.status;  
        
        // 角色筛选  
        const matchesRole = filterOptions.role === 'all' || user.role === filterOptions.role;  
        
        // 日期范围筛选  
        let matchesDateRange = true;  
        if (filterOptions.dateRange !== 'all') {  
          const userDate = new Date(user.createdAt);  
          const now = new Date();  
          
          if (filterOptions.dateRange === 'today') {  
            matchesDateRange = userDate.toDateString() === now.toDateString();  
          } else if (filterOptions.dateRange === 'week') {  
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));  
            matchesDateRange = userDate >= weekStart;  
          } else if (filterOptions.dateRange === 'month') {  
            matchesDateRange = userDate.getMonth() === now.getMonth() &&   
                              userDate.getFullYear() === now.getFullYear();  
          }  
        }  
        
        return matchesSearch && matchesStatus && matchesRole && matchesDateRange;  
      });  
      
      // 排序  
      filtered.sort((a, b) => {  
        let comparison = 0;  
        
        if (sortField === 'name') {  
          comparison = a.name.localeCompare(b.name);  
        } else if (sortField === 'createdAt') {  
          comparison = new Date(a.createdAt) - new Date(b.createdAt);  
        } else if (sortField === 'lastLogin') {  
          comparison = new Date(a.lastLogin) - new Date(b.lastLogin);  
        } else if (sortField === 'rentals') {  
          comparison = a.rentals - b.rentals;  
        } else if (sortField === 'totalSpent') {  
          comparison = parseFloat(a.totalSpent) - parseFloat(b.totalSpent);  
        }  
        
        return sortDirection === 'asc' ? comparison : -comparison;  
      });  
      
      setFilteredUsers(filtered);  
      setCurrentPage(1);  
    };  
    
    applyFilters();  
  }, [users, searchTerm, filterOptions, sortField, sortDirection]);  
  
  // 创建用户  
  const handleAddUser = async (e) => {  
    e.preventDefault();  
    const form = e.currentTarget;  
    
    if (form.checkValidity() === false) {  
      e.stopPropagation();  
      setValidated(true);  
      return;  
    }  
    
    try {  
      setValidated(true);  
      // await adminService.createUser(userForm);  
      
      // 模拟API调用  
      const newUser = {  
        id: users.length + 1,  
        ...userForm,  
        createdAt: new Date().toISOString().split('T')[0],  
        lastLogin: '-',  
        rentals: 0,  
        totalSpent: '0.00'  
      };  
      
      setUsers([newUser, ...users]);  
      setShowAddModal(false);  
      setMessage({ type: 'success', text: '用户创建成功' });  
      
      // 重置表单  
      setUserForm({  
        name: '',  
        email: '',  
        phone: '',  
        role: 'user',  
        status: 'active'  
      });  
      setValidated(false);  
    } catch (error) {  
      console.error('创建用户失败:', error);  
      setMessage({ type: 'danger', text: '创建用户失败，请稍后重试' });  
    }  
  };  
  
  // 编辑用户  
  const handleEditUser = async (e) => {  
    e.preventDefault();  
    const form = e.currentTarget;  
    
    if (form.checkValidity() === false) {  
      e.stopPropagation();  
      setValidated(true);  
      return;  
    }  
    
    try {  
      setValidated(true);  
      // await adminService.updateUser(selectedUser.id, userForm);  
      
      // 模拟API调用  
      const updatedUsers = users.map(user => {  
        if (user.id === selectedUser.id) {  
          return { ...user, ...userForm };  
        }  
        return user;  
      });  
      
      setUsers(updatedUsers);  
      setShowEditModal(false);  
      setMessage({ type: 'success', text: '用户更新成功' });  
      setValidated(false);  
    } catch (error) {  
      console.error('更新用户失败:', error);  
      setMessage({ type: 'danger', text: '更新用户失败，请稍后重试' });  
    }  
  };  
  
  // 删除用户  
  const handleDeleteUser = async () => {  
    try {  
      // await adminService.deleteUser(selectedUser.id);  
      
      // 模拟API调用  
      const remainingUsers = users.filter(user => user.id !== selectedUser.id);  
      
      setUsers(remainingUsers);  
      setShowDeleteModal(false);  
      setMessage({ type: 'success', text: '用户删除成功' });  
    } catch (error) {  
      console.error('删除用户失败:', error);  
      setMessage({ type: 'danger', text: '删除用户失败，请稍后重试' });  
    }  
  };  
  
  // 分页处理  
  const indexOfLastUser = currentPage * usersPerPage;  
  const indexOfFirstUser = indexOfLastUser - usersPerPage;  
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);  
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);  
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);  
  
  // 打开编辑模态框  
  const openEditModal = (user) => {  
    setSelectedUser(user);  
    setUserForm({  
      name: user.name,  
      email: user.email,  
      phone: user.phone,  
      role: user.role,  
      status: user.status  
    });  
    setShowEditModal(true);  
  };  
  
  // 打开删除模态框  
  const openDeleteModal = (user) => {  
    setSelectedUser(user);  
    setShowDeleteModal(true);  
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
  
  // 切换排序方向  
  const toggleSort = (field) => {  
    if (sortField === field) {  
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');  
    } else {  
      setSortField(field);  
      setSortDirection('asc');  
    }  
  };  
  
  return (  
    <Container fluid className="py-4">  
      <Row className="mb-4">  
        <Col>  
          <h2 className="mb-1">用户管理</h2>  
          <p className="text-muted">查看、添加、编辑和删除用户账户</p>  
        </Col>  
        <Col xs="auto">  
          <Button variant="primary" onClick={() => setShowAddModal(true)}>  
            <FaUserPlus className="me-2" /> 创建用户  
          </Button>  
        </Col>  
      </Row>  
      
      {message.text && (  
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>  
          {message.text}  
        </Alert>  
      )}  
      
      <Card className="border-0 shadow-sm mb-4">  
        <Card.Body>  
          <Row className="mb-3">  
            <Col md={4} xl={3}>  
              <InputGroup>  
                <InputGroup.Text>  
                  <FaSearch />  
                </InputGroup.Text>  
                <Form.Control  
                  placeholder="搜索用户..."  
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
                    <option value="active">活跃</option>  
                    <option value="inactive">禁用</option>  
                  </Form.Select>  
                </InputGroup>  
                
                <InputGroup>  
                  <InputGroup.Text>角色</InputGroup.Text>  
                  <Form.Select  
                    value={filterOptions.role}  
                    onChange={(e) => setFilterOptions({ ...filterOptions, role: e.target.value })}  
                    style={{ width: 'auto' }}  
                  >  
                    <option value="all">全部</option>  
                    <option value="user">普通用户</option>  
                    <option value="admin">管理员</option>  
                  </Form.Select>  
                </InputGroup>  
                
                <InputGroup>  
                  <InputGroup.Text>注册日期</InputGroup.Text>  
                  <Form.Select  
                    value={filterOptions.dateRange}  
                    onChange={(e) => setFilterOptions({ ...filterOptions, dateRange: e.target.value })}  
                    style={{ width: 'auto' }}  
                  >  
                    <option value="all">全部时间</option>  
                    <option value="today">今天</option>  
                    <option value="week">本周</option>  
                    <option value="month">本月</option>  
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
                    onClick={() => toggleSort('name')}  
                  >  
                    用户名   
                    {sortField === 'name' && (  
                      sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                    )}  
                  </th>  
                  <th>邮箱</th>  
                  <th>电话</th>  
                  <th>角色</th>  
                  <th   
                    className="sortable"  
                    onClick={() => toggleSort('createdAt')}  
                  >  
                    注册时间  
                    {sortField === 'createdAt' && (  
                      sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                    )}  
                  </th>  
                  <th   
                    className="sortable"  
                    onClick={() => toggleSort('lastLogin')}  
                  >  
                    最后登录  
                    {sortField === 'lastLogin' && (  
                      sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                    )}  
                  </th>  
                  <th   
                    className="sortable"  
                    onClick={() => toggleSort('rentals')}  
                  >  
                    租赁次数  
                    {sortField === 'rentals' && (  
                      sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                    )}  
                  </th>  
                  <th   
                    className="sortable"  
                    onClick={() => toggleSort('totalSpent')}  
                  >  
                    消费总额  
                    {sortField === 'totalSpent' && (  
                      sortDirection === 'asc' ? <FaSortAmountUp className="ms-1" /> : <FaSortAmountDown className="ms-1" />  
                    )}  
                  </th>  
                  <th>状态</th>  
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
                ) : currentUsers.length === 0 ? (  
                  <tr>  
                    <td colSpan="11" className="text-center py-4">  
                      没有找到匹配的用户  
                    </td>  
                  </tr>  
                ) : (  
                  currentUsers.map((user, index) => (  
                    <tr key={user.id}>  
                      <td>{indexOfFirstUser + index + 1}</td>  
                      <td>  
                        <div className="d-flex align-items-center">  
                          <div className="user-avatar me-2">  
                            <FaUserAlt />  
                          </div>  
                          {user.name}  
                        </div>  
                      </td>  
                      <td>{user.email}</td>  
                      <td>{user.phone}</td>  
                      <td>  
                        <Badge bg={user.role === 'admin' ? 'danger' : 'info'}>  
                          {user.role === 'admin' ? '管理员' : '普通用户'}  
                        </Badge>  
                      </td>  
                      <td>{user.createdAt}</td>  
                      <td>{user.lastLogin}</td>  
                      <td>{user.rentals}</td>  
                      <td>¥{user.totalSpent}</td>  
                      <td>  
                        <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>  
                          {user.status === 'active' ? '活跃' : '禁用'}  
                        </Badge>  
                      </td>  
                      <td>  
                        <div className="d-flex gap-2">  
                          <Button   
                            variant="outline-primary"   
                            size="sm"   
                            onClick={() => openEditModal(user)}  
                          >  
                            <FaEdit />  
                          </Button>  
                          <Button   
                            variant={user.status === 'active' ? 'outline-warning' : 'outline-success'}   
                            size="sm"  
                            onClick={() => {  
                              setSelectedUser(user);  
                              setUserForm({ ...user, status: user.status === 'active' ? 'inactive' : 'active' });  
                              setShowEditModal(true);  
                            }}  
                          >  
                            {user.status === 'active' ? <FaBan /> : <FaCheckCircle />}  
                          </Button>  
                          <Button   
                            variant="outline-danger"   
                            size="sm"  
                            onClick={() => openDeleteModal(user)}  
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
                显示 {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} 条，共 {filteredUsers.length} 条  
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
      
      {/* 创建用户模态框 */}  
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>  
        <Modal.Header closeButton>  
          <Modal.Title>创建新用户</Modal.Title>  
        </Modal.Header>  
        <Form noValidate validated={validated} onSubmit={handleAddUser}>  
          <Modal.Body>  
            <Form.Group className="mb-3">  
              <Form.Label>用户名</Form.Label>  
              <Form.Control  
                type="text"  
                placeholder="请输入用户名"  
                value={userForm.name}  
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入用户名  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <Form.Group className="mb-3">  
              <Form.Label>邮箱</Form.Label>  
              <Form.Control  
                type="email"  
                placeholder="请输入邮箱"  
                value={userForm.email}  
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入有效的邮箱地址  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <Form.Group className="mb-3">  
              <Form.Label>电话</Form.Label>  
              <Form.Control  
                type="tel"  
                placeholder="请输入电话号码"  
                value={userForm.phone}  
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入电话号码  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <Row>  
              <Col md={6}>  
                <Form.Group className="mb-3">  
                  <Form.Label>角色</Form.Label>  
                  <Form.Select  
                    value={userForm.role}  
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}  
                    required  
                  >  
                    <option value="user">普通用户</option>  
                    <option value="admin">管理员</option>  
                  </Form.Select>  
                </Form.Group>  
              </Col>  
              <Col md={6}>  
                <Form.Group className="mb-3">  
                  <Form.Label>状态</Form.Label>  
                  <Form.Select  
                    value={userForm.status}  
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}  
                    required  
                  >  
                    <option value="active">活跃</option>  
                    <option value="inactive">禁用</option>  
                  </Form.Select>  
                </Form.Group>  
              </Col>  
            </Row>  
          </Modal.Body>  
          <Modal.Footer>  
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>  
              取消  
            </Button>  
            <Button variant="primary" type="submit">  
              创建  
            </Button>  
          </Modal.Footer>  
        </Form>  
      </Modal>  
      
      {/* 编辑用户模态框 */}  
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>  
        <Modal.Header closeButton>  
          <Modal.Title>编辑用户</Modal.Title>  
        </Modal.Header>  
        <Form noValidate validated={validated} onSubmit={handleEditUser}>  
          <Modal.Body>  
            <Form.Group className="mb-3">  
              <Form.Label>用户名</Form.Label>  
              <Form.Control  
                type="text"  
                placeholder="请输入用户名"  
                value={userForm.name}  
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入用户名  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <Form.Group className="mb-3">  
              <Form.Label>邮箱</Form.Label>  
              <Form.Control  
                type="email"  
                placeholder="请输入邮箱"  
                value={userForm.email}  
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入有效的邮箱地址  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <Form.Group className="mb-3">  
              <Form.Label>电话</Form.Label>  
              <Form.Control  
                type="tel"  
                placeholder="请输入电话号码"  
                value={userForm.phone}  
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}  
                required  
              />  
              <Form.Control.Feedback type="invalid">  
                请输入电话号码  
              </Form.Control.Feedback>  
            </Form.Group>  
            
            <Row>  
              <Col md={6}>  
                <Form.Group className="mb-3">  
                  <Form.Label>角色</Form.Label>  
                  <Form.Select  
                    value={userForm.role}  
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}  
                    required  
                  >  
                    <option value="user">普通用户</option>  
                    <option value="admin">管理员</option>  
                  </Form.Select>  
                </Form.Group>  
              </Col>  
              <Col md={6}>  
                <Form.Group className="mb-3">  
                  <Form.Label>状态</Form.Label>  
                  <Form.Select  
                    value={userForm.status}  
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}  
                    required  
                  >  
                    <option value="active">活跃</option>  
                    <option value="inactive">禁用</option>  
                  </Form.Select>  
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
      
      {/* 删除用户确认模态框 */}  
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>  
        <Modal.Header closeButton>  
          <Modal.Title>确认删除</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <div className="text-center mb-4">  
            <FaExclamationTriangle size={48} className="text-warning mb-3" />  
            <h5>确定要删除此用户吗？</h5>  
            <p className="text-muted">  
              {selectedUser && `用户名：${selectedUser.name}`}<br />  
              {selectedUser && `邮箱：${selectedUser.email}`}  
            </p>  
            <p className="text-danger">  
              此操作无法撤销，用户的所有数据将被永久删除。  
            </p>  
          </div>  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>  
            取消  
          </Button>  
          <Button variant="danger" onClick={handleDeleteUser}>  
            确认删除  
          </Button>  
        </Modal.Footer>  
      </Modal>  
    </Container>  
  );  
};  

export default UserManagement;