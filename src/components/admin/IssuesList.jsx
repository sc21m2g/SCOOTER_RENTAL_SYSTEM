import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Badge, 
  Form, InputGroup, Dropdown, Modal, Tabs, Tab,
  Alert, Spinner, OverlayTrigger, Tooltip, Pagination
} from 'react-bootstrap';
import { 
  FaSearch, FaFilter, FaSort, FaPlus, FaEye, FaPencilAlt,
  FaTrash, FaCheck, FaTimes, FaExclamationTriangle, FaBell,
  FaUser, FaClock, FaMotorcycle, FaTools, FaMapMarkerAlt,
  FaArrowUp, FaArrowDown, FaSync, FaExclamationCircle,
  FaClipboardList, FaCamera, FaComments, FaCalendarAlt, FaInfo
} from 'react-icons/fa';
import { debounce } from 'lodash';

// 模拟数据
const dummyIssues = [
  {
    id: 1001,
    title: '刹车系统故障',
    description: '用户报告滑板车刹车反应迟缓，需要立即检查',
    status: 'open',
    priority: 'high',
    reportedAt: '2023-05-15T08:30:00',
    reportedBy: {
      id: 101,
      name: '李明',
      phone: '13800138001'
    },
    assignedTo: {
      id: 201,
      name: '张工程师',
      role: '维修技师'
    },
    scooter: {
      id: 'SC-8721',
      model: 'SpeedRunner X1',
      lastLocation: {
        latitude: 31.2304,
        longitude: 121.4737,
        address: '上海市黄浦区南京东路123号附近'
      }
    },
    images: [
      'https://example.com/images/issue1001-1.jpg',
      'https://example.com/images/issue1001-2.jpg'
    ],
    category: '机械故障',
    comments: [
      {
        id: 1,
        user: '张工程师',
        content: '已接单，预计30分钟内到达现场',
        time: '2023-05-15T08:45:00'
      }
    ],
    estimatedCost: 150,
    estimatedFixTime: '2023-05-15T10:30:00'
  },
  {
    id: 1002,
    title: '电池电量异常',
    description: '滑板车显示满电但使用不到10分钟就没电',
    status: 'in_progress',
    priority: 'medium',
    reportedAt: '2023-05-14T14:22:00',
    reportedBy: {
      id: 102,
      name: '王芳',
      phone: '13900139002'
    },
    assignedTo: {
      id: 202,
      name: '刘技术',
      role: '电气工程师'
    },
    scooter: {
      id: 'SC-5432',
      model: 'CityGlider Pro',
      lastLocation: {
        latitude: 31.2196,
        longitude: 121.4805,
        address: '上海市静安区南京西路456号附近'
      }
    },
    images: [
      'https://example.com/images/issue1002-1.jpg'
    ],
    category: '电气故障',
    comments: [
      {
        id: 2,
        user: '调度中心',
        content: '已将滑板车锁定，请技术人员检查',
        time: '2023-05-14T14:30:00'
      },
      {
        id: 3,
        user: '刘技术',
        content: '正在更换电池管理系统，预计1小时内完成',
        time: '2023-05-14T15:15:00'
      }
    ],
    estimatedCost: 200,
    estimatedFixTime: '2023-05-14T16:30:00'
  },
  {
    id: 1003,
    title: '二维码损坏',
    description: '滑板车上的二维码磨损严重，无法扫描',
    status: 'resolved',
    priority: 'low',
    reportedAt: '2023-05-13T09:15:00',
    reportedBy: {
      id: 103,
      name: '运维巡检',
      phone: '13700137003'
    },
    assignedTo: {
      id: 203,
      name: '周维护',
      role: '现场运维'
    },
    scooter: {
      id: 'SC-3287',
      model: 'UrbanCruiser',
      lastLocation: {
        latitude: 31.2428,
        longitude: 121.5099,
        address: '上海市浦东新区世纪大道789号附近'
      }
    },
    images: [],
    category: '外观损坏',
    comments: [
      {
        id: 4,
        user: '周维护',
        content: '已更换新的二维码标签',
        time: '2023-05-13T10:30:00'
      }
    ],
    resolvedAt: '2023-05-13T10:35:00',
    repairCost: 20
  },
  {
    id: 1004,
    title: 'GPS定位异常',
    description: 'APP上显示的位置与实际位置相差500米',
    status: 'pending',
    priority: 'medium',
    reportedAt: '2023-05-15T11:45:00',
    reportedBy: {
      id: 104,
      name: '赵强',
      phone: '13600136004'
    },
    scooter: {
      id: 'SC-6502',
      model: 'SpeedRunner X1',
      lastLocation: {
        latitude: 31.2255,
        longitude: 121.4886,
        address: '上海市静安区延安中路321号附近'
      }
    },
    images: [],
    category: '电子设备故障',
    comments: [
      {
        id: 5,
        user: '系统',
        content: '等待分配维修人员',
        time: '2023-05-15T11:46:00'
      }
    ],
    estimatedCost: null,
    estimatedFixTime: null
  },
  {
    id: 1005,
    title: '轮胎漏气',
    description: '前轮胎完全瘪了，需要更换',
    status: 'open',
    priority: 'high',
    reportedAt: '2023-05-15T09:20:00',
    reportedBy: {
      id: 105,
      name: '孙明',
      phone: '13500135005'
    },
    assignedTo: {
      id: 204,
      name: '陈工',
      role: '维修技师'
    },
    scooter: {
      id: 'SC-9012',
      model: 'CityGlider Lite',
      lastLocation: {
        latitude: 31.2308,
        longitude: 121.4737,
        address: '上海市黄浦区人民广场附近'
      }
    },
    images: [
      'https://example.com/images/issue1005-1.jpg'
    ],
    category: '机械故障',
    comments: [],
    estimatedCost: 80,
    estimatedFixTime: '2023-05-15T11:00:00'
  }
];

const issueStatusMap = {
  'open': { label: '待处理', color: 'danger', icon: <FaExclamationCircle /> },
  'pending': { label: '待分配', color: 'warning', icon: <FaClock /> },
  'in_progress': { label: '处理中', color: 'primary', icon: <FaTools /> },
  'resolved': { label: '已解决', color: 'success', icon: <FaCheck /> },
  'closed': { label: '已关闭', color: 'secondary', icon: <FaTimes /> }
};

const priorityMap = {
  'low': { label: '低', color: 'info' },
  'medium': { label: '中', color: 'warning' },
  'high': { label: '高', color: 'danger' }
};

const IssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 筛选和排序状态
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    category: [],
    assignedTo: '',
    searchQuery: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [sortBy, setSortBy] = useState({ field: 'reportedAt', direction: 'desc' });
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalIssues, setTotalIssues] = useState(0);
  
  // 详情模态框
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // 新建/编辑模态框
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState('create'); // 'create' or 'edit'
  const [editingIssue, setEditingIssue] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    scooterId: ''
  });
  
  // 删除确认模态框
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  
  // 批量操作
  const [selectedIssueIds, setSelectedIssueIds] = useState([]);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  
  // 过滤和加载数据
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 这里应该是实际的API调用，现在使用模拟数据
        let filteredIssues = [...dummyIssues];
        
        // 应用过滤条件
        if (filters.status.length > 0) {
          filteredIssues = filteredIssues.filter(issue => filters.status.includes(issue.status));
        }
        
        if (filters.priority.length > 0) {
          filteredIssues = filteredIssues.filter(issue => filters.priority.includes(issue.priority));
        }
        
        if (filters.category.length > 0) {
          filteredIssues = filteredIssues.filter(issue => filters.category.includes(issue.category));
        }
        
        if (filters.assignedTo) {
          filteredIssues = filteredIssues.filter(issue => 
            issue.assignedTo && issue.assignedTo.id.toString() === filters.assignedTo);
        }
        
        // 搜索
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredIssues = filteredIssues.filter(issue => 
            issue.title.toLowerCase().includes(query) || 
            issue.description.toLowerCase().includes(query) ||
            (issue.scooter && issue.scooter.id.toLowerCase().includes(query))
          );
        }
        
        // 日期范围
        if (filters.dateRange.start) {
          filteredIssues = filteredIssues.filter(issue => 
            new Date(issue.reportedAt) >= new Date(filters.dateRange.start)
          );
        }
        
        if (filters.dateRange.end) {
          filteredIssues = filteredIssues.filter(issue => 
            new Date(issue.reportedAt) <= new Date(filters.dateRange.end + 'T23:59:59')
          );
        }
        
        // 排序
        filteredIssues.sort((a, b) => {
          let valA = a[sortBy.field];
          let valB = b[sortBy.field];
          
          // 特殊处理日期字段
          if (sortBy.field === 'reportedAt' || sortBy.field === 'resolvedAt') {
            valA = new Date(valA || '1970-01-01').getTime();
            valB = new Date(valB || '1970-01-01').getTime();
          }
          
          if (valA < valB) return sortBy.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sortBy.direction === 'asc' ? 1 : -1;
          return 0;
        });
        
        // 分页
        setTotalIssues(filteredIssues.length);
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedIssues = filteredIssues.slice(startIndex, startIndex + pageSize);
        
        setIssues(paginatedIssues);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setError("获取问题列表失败，请稍后重试");
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, [filters, sortBy, currentPage, pageSize]);
  
  // 搜索防抖
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, searchQuery: value }));
      setCurrentPage(1); // 重置为第一页
    }, 500),
    []
  );
  
  // 处理搜索输入
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };
  
  // 处理过滤器变化
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'status' || filterType === 'priority' || filterType === 'category') {
        // 切换数组中的值
        const updatedArray = prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value];
        
        return { ...prev, [filterType]: updatedArray };
      }
      return { ...prev, [filterType]: value };
    });
    setCurrentPage(1); // 重置为第一页
  };
  
  // 处理日期筛选
  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
    setCurrentPage(1);
  };
  
  // 处理排序
  const handleSort = (field) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // 重置所有筛选条件
  const resetFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      assignedTo: '',
      searchQuery: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
    setSortBy({ field: 'reportedAt', direction: 'desc' });
    setCurrentPage(1);
  };
  
  // 处理查看详情
  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setShowDetailModal(true);
  };
  
  // 处理修改状态
  const handleStatusChange = (issueId, newStatus) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, status: newStatus, ...(newStatus === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}) } 
          : issue
      )
    );
    
    // 在实际应用中，这里应该调用API更新状态
  };
  
  // 处理创建新问题
  const handleCreateIssue = () => {
    setEditingIssue({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      scooterId: ''
    });
    setEditMode('create');
    setShowEditModal(true);
  };
  
  // 处理编辑问题
  const handleEditIssue = (issue) => {
    setEditingIssue({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      category: issue.category,
      scooterId: issue.scooter?.id || ''
    });
    setEditMode('edit');
    setShowEditModal(true);
  };
  
  // 处理删除问题
  const handleDeleteClick = (issue) => {
    setIssueToDelete(issue);
    setShowDeleteModal(true);
  };
  
  // 确认删除问题
  const confirmDelete = () => {
    if (!issueToDelete) return;
    
    // 在实际应用中，这里应该调用API删除问题
    setIssues(prev => prev.filter(issue => issue.id !== issueToDelete.id));
    setShowDeleteModal(false);
    setIssueToDelete(null);
  };
  
  // 保存问题（创建或更新）
  const saveIssue = () => {
    if (editMode === 'create') {
      // 生成一个新的ID（在实际应用中，这应该由后端生成）
      const newId = Math.max(...issues.map(issue => issue.id), 0) + 1;
      
      const newIssue = {
        id: newId,
        title: editingIssue.title,
        description: editingIssue.description,
        status: 'open',
        priority: editingIssue.priority,
        reportedAt: new Date().toISOString(),
        reportedBy: {
          id: 999, // 当前登录用户ID（应从认证上下文中获取）
          name: '当前用户', // 当前登录用户名（应从认证上下文中获取）
        },
        scooter: {
          id: editingIssue.scooterId,
          // 其他滑板车详情应从API获取
        },
        category: editingIssue.category,
        comments: [],
      };
      
      // 在实际应用中，这里应该调用API创建问题
      setIssues(prev => [newIssue, ...prev]);
    } else {
      // 更新现有问题
      setIssues(prev => 
        prev.map(issue => 
          issue.id === editingIssue.id 
            ? { 
                ...issue, 
                title: editingIssue.title,
                description: editingIssue.description,
                priority: editingIssue.priority,
                category: editingIssue.category,
                scooter: { ...issue.scooter, id: editingIssue.scooterId }
              } 
            : issue
        )
      );
    }
    
    setShowEditModal(false);
  };
  
  // 处理选择问题（多选）
  const handleSelectIssue = (issueId) => {
    setSelectedIssueIds(prev => {
      if (prev.includes(issueId)) {
        return prev.filter(id => id !== issueId);
      } else {
        return [...prev, issueId];
      }
    });
  };
  
  // 全选/取消全选
  const handleSelectAllIssues = () => {
    if (selectedIssueIds.length === issues.length) {
      setSelectedIssueIds([]);
    } else {
      setSelectedIssueIds(issues.map(issue => issue.id));
    }
  };
  
  // 执行批量操作
  const executeBulkAction = () => {
    if (!bulkAction || selectedIssueIds.length === 0) return;
    
    if (bulkAction === 'delete') {
      // 批量删除
      setIssues(prev => prev.filter(issue => !selectedIssueIds.includes(issue.id)));
    } else {
      // 批量更新状态
      setIssues(prev => 
        prev.map(issue => 
          selectedIssueIds.includes(issue.id) 
            ? { ...issue, status: bulkAction, ...(bulkAction === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}) } 
            : issue
        )
      );
    }
    
    setSelectedIssueIds([]);
    setShowBulkActionModal(false);
  };
  
  // 添加评论
  const handleAddComment = (issueId, comment) => {
    if (!comment) return;
    
    const newComment = {
      id: Date.now(), // 生成唯一ID
      user: '当前用户', // 应从认证上下文中获取
      content: comment,
      time: new Date().toISOString()
    };
    
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, comments: [...(issue.comments || []), newComment] } 
          : issue
      )
    );
    
    // 如果当前正在查看此问题的详情，也更新selectedIssue
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
    }
  };
  
  // 处理分页
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // 渲染分页组件
  const renderPagination = () => {
    const totalPages = Math.ceil(totalIssues / pageSize);
    if (totalPages <= 1) return null;
    
    let items = [];
    // 添加"上一页"按钮
    items.push(
      <Pagination.Prev 
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );
    
    // 始终显示第一页
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // 计算要显示的页码范围
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // 添加第一页和开始页之间的省略号
    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }
    
    // 添加中间页码
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={currentPage === page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    // 添加结束页和最后页之间的省略号
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }
    
    // 始终显示最后一页
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // 添加"下一页"按钮
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );
    
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-muted">
          共 {totalIssues} 条记录，当前显示 {Math.min((currentPage - 1) * pageSize + 1, totalIssues)} - {Math.min(currentPage * pageSize, totalIssues)}
        </div>
        <Pagination>{items}</Pagination>
      </div>
    );
  };
  
  // 获取可用的类别列表（实际应该从API获取）
  const getCategories = () => [
    '机械故障',
    '电气故障',
    '电子设备故障',
    '外观损坏',
    '软件问题',
    '其他问题'
  ];
  
  // 获取技术人员列表（实际应该从API获取）
  const getTechnicians = () => [
    { id: 201, name: '张工程师', role: '维修技师' },
    { id: 202, name: '刘技术', role: '电气工程师' },
    { id: 203, name: '周维护', role: '现场运维' },
    { id: 204, name: '陈工', role: '维修技师' },
  ];
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">故障与维修管理</h2>
          <p className="text-muted">管理滑板车故障报告和维修任务</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          {selectedIssueIds.length > 0 && (
            <Button 
              variant="outline-primary" 
              onClick={() => {
                setBulkAction('');
                setShowBulkActionModal(true);
              }}
            >
              <FaClipboardList className="me-1" /> 批量操作 ({selectedIssueIds.length})
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={handleCreateIssue}
          >
            <FaPlus className="me-1" /> 新建问题
          </Button>
        </Col>
      </Row>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-0">
          {/* 筛选栏 */}
          <div className="p-3 border-bottom">
            <Row className="g-3">
              <Col lg={5}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="搜索问题标题、描述或滑板车ID"
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Text>
                    <FaCalendarAlt />
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                  <InputGroup.Text>至</InputGroup.Text>
                  <Form.Control
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg="auto">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="status-filter">
                    <FaFilter className="me-1" /> 状态
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.entries(issueStatusMap).map(([key, { label, color }]) => (
                      <Dropdown.Item
                        key={key}
                        onClick={() => handleFilterChange('status', key)}
                        active={filters.status.includes(key)}
                      >
                        <Badge bg={color} className="me-2">{label}</Badge>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col lg="auto">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="priority-filter">
                    <FaFilter className="me-1" /> 优先级
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.entries(priorityMap).map(([key, { label, color }]) => (
                      <Dropdown.Item
                        key={key}
                        onClick={() => handleFilterChange('priority', key)}
                        active={filters.priority.includes(key)}
                      >
                        <Badge bg={color} className="me-2">{label}</Badge>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col lg="auto">
                <Button 
                  variant="outline-secondary" 
                  onClick={resetFilters}
                  disabled={
                    filters.status.length === 0 && 
                    filters.priority.length === 0 && 
                    filters.category.length === 0 && 
                    !filters.assignedTo && 
                    !filters.searchQuery &&
                    !filters.dateRange.start &&
                    !filters.dateRange.end
                  }
                >
                  <FaSync className="me-1" /> 重置
                </Button>
              </Col>
            </Row>
            
            {/* 激活的筛选条件标签 */}
            {(filters.status.length > 0 || 
              filters.priority.length > 0 || 
              filters.category.length > 0 || 
              filters.assignedTo || 
              filters.dateRange.start ||
              filters.dateRange.end) && (
              <div className="mt-3 d-flex flex-wrap gap-2">
                {filters.status.map(status => (
                  <Badge 
                    key={status} 
                    bg={issueStatusMap[status].color} 
                    className="d-flex align-items-center"
                  >
                    {issueStatusMap[status].label}
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-white" 
                      onClick={() => handleFilterChange('status', status)}
                    >
                      <FaTimes size={12} />
                    </Button>
                  </Badge>
                ))}
                
                {filters.priority.map(priority => (
                  <Badge 
                    key={priority} 
                    bg={priorityMap[priority].color} 
                    className="d-flex align-items-center"
                  >
                    {priorityMap[priority].label}优先级
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-white" 
                      onClick={() => handleFilterChange('priority', priority)}
                    >
                      <FaTimes size={12} />
                    </Button>
                  </Badge>
                ))}
                
                {filters.category.map(category => (
                  <Badge 
                    key={category} 
                    bg="secondary" 
                    className="d-flex align-items-center"
                  >
                    {category}
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-white" 
                      onClick={() => handleFilterChange('category', category)}
                    >
                      <FaTimes size={12} />
                    </Button>
                  </Badge>
                ))}
                
                {filters.assignedTo && (
                  <Badge 
                    bg="info" 
                    className="d-flex align-items-center"
                  >
                    分配给: {getTechnicians().find(t => t.id.toString() === filters.assignedTo)?.name || '未知'}
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-white" 
                      onClick={() => handleFilterChange('assignedTo', '')}
                    >
                      <FaTimes size={12} />
                    </Button>
                  </Badge>
                )}
                
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <Badge 
                    bg="secondary" 
                    className="d-flex align-items-center"
                  >
                    日期: {filters.dateRange.start || '最早'} 至 {filters.dateRange.end || '现在'}
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-white" 
                      onClick={() => setFilters(prev => ({...prev, dateRange: {start: '', end: ''}}))}
                    >
                      <FaTimes size={12} />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* 数据表格 */}
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">加载中...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-3">
              {error}
            </Alert>
          ) : issues.length === 0 ? (
            <div className="text-center p-5">
              <FaExclamationTriangle className="text-muted mb-2" size={24} />
              <p>没有找到符合条件的问题</p>
              {(filters.status.length > 0 || 
                filters.priority.length > 0 || 
                filters.category.length > 0 || 
                filters.assignedTo || 
                filters.searchQuery ||
                filters.dateRange.start ||
                filters.dateRange.end) && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={resetFilters}
                >
                  清除筛选条件
                </Button>
              )}
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center" style={{ width: '40px' }}>
                    <Form.Check
                      type="checkbox"
                      onChange={handleSelectAllIssues}
                      checked={selectedIssueIds.length === issues.length && issues.length > 0}
                      indeterminate={selectedIssueIds.length > 0 && selectedIssueIds.length < issues.length}
                    />
                  </th>
                  <th style={{ width: '100px' }}>
                    <div 
                      className="d-flex align-items-center user-select-none"
                      onClick={() => handleSort('id')}
                      style={{ cursor: 'pointer' }}
                    >
                      ID
                      {sortBy.field === 'id' && (
                        sortBy.direction === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />
                      )}
                    </div>
                  </th>
                  <th>
                    <div 
                      className="d-flex align-items-center user-select-none"
                      onClick={() => handleSort('title')}
                      style={{ cursor: 'pointer' }}
                    >
                      标题
                      {sortBy.field === 'title' && (
                        sortBy.direction === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />
                      )}
                    </div>
                  </th>
                  <th>状态</th>
                  <th>优先级</th>
                  <th>类别</th>
                  <th>滑板车</th>
                  <th>
                    <div 
                      className="d-flex align-items-center user-select-none"
                      onClick={() => handleSort('reportedAt')}
                      style={{ cursor: 'pointer' }}
                    >
                      报告时间
                      {sortBy.field === 'reportedAt' && (
                        sortBy.direction === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />
                      )}
                    </div>
                  </th>
                  <th>分配给</th>
                  <th style={{ width: '140px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id} className={selectedIssueIds.includes(issue.id) ? 'table-active' : ''}>
                    <td className="text-center align-middle">
                      <Form.Check
                        type="checkbox"
                        checked={selectedIssueIds.includes(issue.id)}
                        onChange={() => handleSelectIssue(issue.id)}
                      />
                    </td>
                    <td>#{issue.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="link"
                          className="text-decoration-none p-0 text-start"
                          onClick={() => handleViewDetails(issue)}
                        >
                          {issue.title}
                        </Button>
                        {issue.comments && issue.comments.length > 0 && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{issue.comments.length} 条评论</Tooltip>}
                          >
                            <Badge bg="secondary" pill className="ms-2">
                              {issue.comments.length}
                            </Badge>
                          </OverlayTrigger>
                        )}
                      </div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                        {issue.description}
                      </div>
                    </td>
                    <td>
                      <Badge 
                        bg={issueStatusMap[issue.status].color}
                        className="d-flex align-items-center"
                        style={{ width: 'fit-content' }}
                      >
                        {issueStatusMap[issue.status].icon}
                        <span className="ms-1">{issueStatusMap[issue.status].label}</span>
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={priorityMap[issue.priority].color}>
                        {priorityMap[issue.priority].label}
                      </Badge>
                    </td>
                    <td>{issue.category || '-'}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            {issue.scooter?.model}<br />
                            {issue.scooter?.lastLocation?.address}
                          </Tooltip>
                        }
                      >
                        <div className="d-flex align-items-center">
                          <FaMotorcycle className="me-1" />
                          {issue.scooter?.id}
                        </div>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>报告人: {issue.reportedBy?.name}</Tooltip>}
                      >
                        <div>{formatDate(issue.reportedAt)}</div>
                      </OverlayTrigger>
                    </td>
                    <td>
                      {issue.assignedTo ? (
                        <div className="d-flex align-items-center">
                          <FaUser className="me-1 text-muted" />
                          {issue.assignedTo.name}
                        </div>
                      ) : (
                        <Badge bg="warning" text="dark">未分配</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm" id={`status-action-${issue.id}`}>
                            {issueStatusMap[issue.status].label}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {Object.entries(issueStatusMap).map(([key, { label }]) => (
                              <Dropdown.Item 
                                key={key}
                                onClick={() => handleStatusChange(issue.id, key)}
                                active={issue.status === key}
                              >
                                {label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(issue)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(issue)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          {/* 分页控件 */}
          {!loading && !error && issues.length > 0 && (
            <div className="p-3 border-top">
              {renderPagination()}
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* 问题详情模态框 */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        scrollable
      >
        {selectedIssue && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>问题详情 #{selectedIssue.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs defaultActiveKey="details" className="mb-4">
                <Tab eventKey="details" title="基本信息">
                  <Row>
                    <Col md={8}>
                      <h4>{selectedIssue.title}</h4>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <Badge 
                          bg={issueStatusMap[selectedIssue.status].color}
                          className="d-flex align-items-center"
                        >
                          {issueStatusMap[selectedIssue.status].icon}
                          <span className="ms-1">{issueStatusMap[selectedIssue.status].label}</span>
                        </Badge>
                        <Badge bg={priorityMap[selectedIssue.priority].color}>
                          {priorityMap[selectedIssue.priority].label}优先级
                        </Badge>
                        {selectedIssue.category && (
                          <Badge bg="secondary">{selectedIssue.category}</Badge>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">问题描述</h6>
                        <p className="mb-0">{selectedIssue.description}</p>
                      </div>
                      
                      {selectedIssue.estimatedCost !== undefined && (
                        <div className="mb-4">
                          <h6 className="text-muted mb-2">维修估算</h6>
                          <div className="d-flex gap-4">
                            <div>
                              <small className="text-muted d-block">预估费用</small>
                              <span className="fw-bold">{selectedIssue.estimatedCost ? `¥${selectedIssue.estimatedCost.toFixed(2)}` : '未评估'}</span>
                            </div>
                            <div>
                              <small className="text-muted d-block">预估完成时间</small>
                              <span className="fw-bold">{selectedIssue.estimatedFixTime ? formatDate(selectedIssue.estimatedFixTime) : '未评估'}</span>
                            </div>
                            {selectedIssue.resolvedAt && (
                              <div>
                                <small className="text-muted d-block">实际解决时间</small>
                                <span className="fw-bold">{formatDate(selectedIssue.resolvedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {selectedIssue.images && selectedIssue.images.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-muted mb-2">问题图片</h6>
                          <Row className="g-2">
                            {selectedIssue.images.map((img, index) => (
                              <Col key={index} xs={6} md={4}>
                                <div className="position-relative">
                                  <div 
                                    className="image-placeholder border rounded d-flex justify-content-center align-items-center bg-light"
                                    style={{ height: '120px' }}
                                  >
                                    <FaCamera size={24} className="text-muted" />
                                  </div>
                                  <span className="position-absolute bottom-0 end-0 bg-dark text-white rounded-pill px-2 py-1 m-1" style={{ fontSize: '0.75rem' }}>
                                    图片 {index + 1}
                                  </span>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </Col>
                    
                    <Col md={4}>
                      <Card className="mb-3">
                        <Card.Body className="p-3">
                          <h6 className="card-subtitle mb-2 text-muted">报告信息</h6>
                          <div className="mb-2">
                            <small className="text-muted d-block">报告时间</small>
                            <span>{formatDate(selectedIssue.reportedAt)}</span>
                          </div>
                          <div className="mb-0">
                            <small className="text-muted d-block">报告人</small>
                            <div className="d-flex align-items-center">
                              <FaUser className="me-1 text-muted" />
                              {selectedIssue.reportedBy?.name}
                              {selectedIssue.reportedBy?.phone && (
                                <span className="ms-2 text-muted small">{selectedIssue.reportedBy.phone}</span>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                      
                      <Card className="mb-3">
                        <Card.Body className="p-3">
                          <h6 className="card-subtitle mb-2 text-muted">滑板车信息</h6>
                          <div className="mb-2">
                            <small className="text-muted d-block">车辆ID</small>
                            <span>{selectedIssue.scooter?.id || '未关联'}</span>
                          </div>
                          {selectedIssue.scooter?.model && (
                            <div className="mb-2">
                              <small className="text-muted d-block">型号</small>
                              <span>{selectedIssue.scooter.model}</span>
                            </div>
                          )}
                          {selectedIssue.scooter?.lastLocation && (
                            <div className="mb-0">
                              <small className="text-muted d-block">位置</small>
                              <div className="d-flex align-items-start">
                                <FaMapMarkerAlt className="me-1 text-danger mt-1" />
                                <span>{selectedIssue.scooter.lastLocation.address}</span>
                              </div>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                      
                      <Card>
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="card-subtitle text-muted mb-0">维修人员</h6>
                            <Dropdown>
                              <Dropdown.Toggle variant="link" size="sm" className="p-0 text-decoration-none">
                                {selectedIssue.assignedTo ? '更换' : '分配'}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {getTechnicians().map(tech => (
                                  <Dropdown.Item 
                                    key={tech.id}
                                    // 在实际应用中，这里应该调用API来分配技术人员
                                  >
                                    {tech.name} ({tech.role})
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          
                          {selectedIssue.assignedTo ? (
                            <div className="mb-0">
                              <div className="d-flex align-items-center">
                                <FaUser className="me-2 text-primary" />
                                <div>
                                  <div>{selectedIssue.assignedTo.name}</div>
                                  <small className="text-muted">{selectedIssue.assignedTo.role}</small>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="alert alert-warning py-2 mb-0">
                              <FaExclamationTriangle className="me-1" />
                              未分配维修人员
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="comments" title="评论记录">
                  <div className="comments-container mb-4">
                    {(!selectedIssue.comments || selectedIssue.comments.length === 0) ? (
                      <div className="text-center py-4 text-muted">
                        <FaComments className="mb-2" size={24} />
                        <p className="mb-0">暂无评论记录</p>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {selectedIssue.comments.map(comment => (
                          <Card key={comment.id} className="border-0 bg-light">
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between mb-1">
                                <div className="fw-bold">{comment.user}</div>
                                <small className="text-muted">{formatDate(comment.time)}</small>
                              </div>
                              <p className="mb-0">{comment.content}</p>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    const commentText = e.target.elements.commentText.value;
                    if (commentText.trim()) {
                      handleAddComment(selectedIssue.id, commentText);
                      e.target.reset();
                    }
                  }}>
                    <Form.Group>
                      <Form.Label>添加评论</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="commentText"
                        rows={3}
                        placeholder="输入评论内容..."
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-2">
                      <Button type="submit" variant="primary">发送评论</Button>
                    </div>
                  </Form>
                </Tab>
                
                <Tab eventKey="history" title="状态历史">
                  <div className="text-center py-4 text-muted">
                    <FaClipboardList className="mb-2" size={24} />
                    <p className="mb-0">状态变更历史记录将在此显示</p>
                  </div>
                </Tab>
              </Tabs>
            </Modal.Body>
            <Modal.Footer>
              <div className="me-auto">
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    handleEditIssue(selectedIssue);
                    setShowDetailModal(false);
                  }}
                >
                  <FaPencilAlt className="me-1" /> 编辑问题
                </Button>
              </div>
              
              <Dropdown className="me-2">
                <Dropdown.Toggle variant="outline-secondary">
                  更改状态
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.entries(issueStatusMap).map(([key, { label }]) => (
                    <Dropdown.Item 
                      key={key}
                      onClick={() => {
                        handleStatusChange(selectedIssue.id, key);
                        setSelectedIssue(prev => ({...prev, status: key}));
                      }}
                      active={selectedIssue.status === key}
                    >
                      {label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      
      {/* 新建/编辑问题模态框 */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode === 'create' ? '新建问题' : '编辑问题'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>问题标题</Form.Label>
              <Form.Control
                type="text"
                value={editingIssue.title}
                onChange={(e) => setEditingIssue({...editingIssue, title: e.target.value})}
                placeholder="简单描述问题"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>问题描述</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editingIssue.description}
                onChange={(e) => setEditingIssue({...editingIssue, description: e.target.value})}
                placeholder="详细描述问题情况"
                required
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>优先级</Form.Label>
                  <Form.Select
                    value={editingIssue.priority}
                    onChange={(e) => setEditingIssue({...editingIssue, priority: e.target.value})}
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>故障类别</Form.Label>
                  <Form.Select
                    value={editingIssue.category}
                    onChange={(e) => setEditingIssue({...editingIssue, category: e.target.value})}
                  >
                    <option value="">选择类别</option>
                    {getCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>滑板车ID</Form.Label>
              <Form.Control
                type="text"
                value={editingIssue.scooterId}
                onChange={(e) => setEditingIssue({...editingIssue, scooterId: e.target.value})}
                placeholder="输入滑板车ID"
              />
            </Form.Group>
            
            {editMode === 'create' && (
              <Form.Group className="mb-0">
                <Form.Label>上传图片（可选）</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                />
                <Form.Text className="text-muted">
                  可以上传多张图片以帮助描述问题
                </Form.Text>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button 
            variant="primary" 
            onClick={saveIssue}
            disabled={!editingIssue.title || !editingIssue.description}
          >
            {editMode === 'create' ? '创建' : '保存'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 删除确认模态框 */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setIssueToDelete(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>确认删除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">
            <div className="me-3">
              <FaExclamationTriangle size={24} className="text-warning" />
            </div>
            <div>
                            <p>您确定要删除以下问题吗？</p>  
              {issueToDelete && (  
                <div className="alert alert-light mb-0">  
                  <strong>#{issueToDelete.id} {issueToDelete.title}</strong>  
                  <div className="text-muted small">{issueToDelete.description?.substring(0, 100)}{issueToDelete.description?.length > 100 ? '...' : ''}</div>  
                </div>  
              )}  
              <p className="text-danger mt-3 mb-0">此操作无法撤销。</p>  
            </div>  
          </div>  
        </Modal.Body>  
        <Modal.Footer>  
          <Button   
            variant="outline-secondary"   
            onClick={() => {  
              setShowDeleteModal(false);  
              setIssueToDelete(null);  
            }}  
          >  
            取消  
          </Button>  
          <Button variant="danger" onClick={confirmDelete}>  
            确认删除  
          </Button>  
        </Modal.Footer>  
      </Modal>  
      
      {/* 批量操作模态框 */}  
      <Modal  
        show={showBulkActionModal}  
        onHide={() => setShowBulkActionModal(false)}  
      >  
        <Modal.Header closeButton>  
          <Modal.Title>批量操作</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <p>您已选择 {selectedIssueIds.length} 个问题，请选择要执行的操作：</p>  
          
          <Form.Group className="mb-3">  
            <Form.Select   
              value={bulkAction}  
              onChange={(e) => setBulkAction(e.target.value)}  
            >  
              <option value="">请选择操作...</option>  
              <optgroup label="更改状态">  
                {Object.entries(issueStatusMap).map(([key, { label }]) => (  
                  <option key={key} value={key}>{label}</option>  
                ))}  
              </optgroup>  
              <optgroup label="其他操作">  
                <option value="delete">删除所选问题</option>  
              </optgroup>  
            </Form.Select>  
          </Form.Group>  
          
          {bulkAction === 'delete' && (  
            <Alert variant="danger">  
              <FaExclamationTriangle className="me-2" />  
              此操作将删除所有选中的问题，且无法撤销。请确认您要继续操作。  
            </Alert>  
          )}  
          
          {bulkAction && bulkAction !== 'delete' && (  
            <Alert variant="info">  
              <FaInfo className="me-2" />  
              此操作将把所有选中的问题状态更改为"{issueStatusMap[bulkAction]?.label}"。  
            </Alert>  
          )}  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="secondary" onClick={() => setShowBulkActionModal(false)}>  
            取消  
          </Button>  
          <Button   
            variant={bulkAction === 'delete' ? 'danger' : 'primary'}   
            disabled={!bulkAction}  
            onClick={executeBulkAction}  
          >  
            确认执行  
          </Button>  
        </Modal.Footer>  
      </Modal>  
    </Container>  
  );  
};  

export default IssueList;
