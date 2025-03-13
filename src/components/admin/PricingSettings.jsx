import React, { useState, useEffect } from 'react';  
import {   
  Container, Row, Col, Card, Form, Button, Table,   
  Tabs, Tab, Modal, Alert, InputGroup, Badge,  
  OverlayTrigger, Tooltip  
} from 'react-bootstrap';  
import {   
  FaSave, FaUndo, FaPlus, FaTrash, FaInfoCircle,   
  FaHistory, FaPercentage, FaClock, FaMapMarkedAlt,  
  FaUserTag, FaCalendarAlt, FaExclamationTriangle,  
  FaCheck  
} from 'react-icons/fa';  

const PricingSettings = () => {  
  // 状态管理  
  const [pricingConfig, setPricingConfig] = useState({  
    baseRate: {  
      unlockFee: 2.00,  
      perMinuteRate: 0.30,  
      minimumFare: 5.00,  
      maximumDailyFare: 50.00,  
      reservationFee: 1.00,  
      cancellationFee: 2.00,  
      parkingFineOutsideZone: 5.00  
    },  
    timeBasedRates: [  
      { id: 1, name: '标准时段', startTime: '10:00', endTime: '16:00', multiplier: 1.0, active: true },  
      { id: 2, name: '早高峰', startTime: '07:00', endTime: '10:00', multiplier: 1.25, active: true },  
      { id: 3, name: '晚高峰', startTime: '16:00', endTime: '20:00', multiplier: 1.5, active: true },  
      { id: 4, name: '夜间', startTime: '20:00', endTime: '07:00', multiplier: 0.8, active: true }  
    ],  
    membershipPlans: [  
      { id: 1, name: '月度会员', price: 39.99, discountPercentage: 20, freeUnlocks: 10, description: '每月优惠骑行，包含10次免费解锁', active: true },  
      { id: 2, name: '年度会员', price: 299.99, discountPercentage: 30, freeUnlocks: 200, description: '年度无限次骑行，包含200次免费解锁', active: true },  
      { id: 3, name: '学生套餐', price: 19.99, discountPercentage: 25, freeUnlocks: 5, description: '学生专属月度优惠', active: true }  
    ],  
    promotions: [  
      { id: 1, name: '首次骑行', code: 'FIRST', discountType: 'percentage', discountValue: 100, maxDiscount: 10, startDate: '2023-01-01', endDate: '2023-12-31', active: true },  
      { id: 2, name: '周末特惠', code: 'WEEKEND', discountType: 'percentage', discountValue: 20, maxDiscount: null, startDate: '2023-01-01', endDate: '2023-12-31', active: true },  
      { id: 3, name: '推荐好友', code: 'REFER', discountType: 'fixed', discountValue: 10, maxDiscount: null, startDate: '2023-01-01', endDate: '2023-12-31', active: true }  
    ],  
    specialEvents: [  
      { id: 1, name: '节日特惠', startDate: '2023-11-11', endDate: '2023-11-12', multiplier: 0.7, description: '双十一骑行七折', active: true },  
      { id: 2, name: '春节期间', startDate: '2023-01-21', endDate: '2023-01-27', multiplier: 0.5, description: '春节期间骑行五折', active: true }  
    ],  
    zonePricing: [  
      { id: 1, name: '城市中心', multiplier: 1.2, color: '#FF5733', active: true },  
      { id: 2, name: '商业区', multiplier: 1.1, color: '#33FF57', active: true },  
      { id: 3, name: '郊区', multiplier: 0.9, color: '#3357FF', active: true },  
      { id: 4, name: '学校区域', multiplier: 0.8, color: '#F3FF33', active: true }  
    ]  
  });  
  
  const [activeTab, setActiveTab] = useState('baseRate');  
  const [showHistoryModal, setShowHistoryModal] = useState(false);  
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [itemToDelete, setItemToDelete] = useState(null);  
  const [message, setMessage] = useState({ show: false, type: '', content: '' });  
  const [newItem, setNewItem] = useState(null);  
  const [showNewItemModal, setShowNewItemModal] = useState(false);  
  const [isDirty, setIsDirty] = useState(false);  
  const [confirmedExit, setConfirmedExit] = useState(false);  
  const [showExitModal, setShowExitModal] = useState(false);  
  const [originalConfig, setOriginalConfig] = useState(null);  
  const [priceChangeSummary, setPriceChangeSummary] = useState([]);  
  
  // 模拟价格变更历史记录  
  const pricingHistory = [  
    { id: 1, date: '2023-10-15', user: 'admin', changes: '修改了基础费率: 解锁费 1.5元 -> 2元', type: 'baseRate' },  
    { id: 2, date: '2023-09-01', user: 'manager', changes: '添加了新会员套餐: 学生套餐', type: 'membershipPlans' },  
    { id: 3, date: '2023-08-15', user: 'admin', changes: '修改了高峰时段价格系数: 1.3 -> 1.5', type: 'timeBasedRates' },  
    { id: 4, date: '2023-07-20', user: 'manager', changes: '添加了新促销: 首次骑行免费', type: 'promotions' },  
    { id: 5, date: '2023-06-10', user: 'admin', changes: '添加了区域定价: 城市中心 1.2x', type: 'zonePricing' }  
  ];  
  
  // 保存原始配置用于恢复和比较  
  useEffect(() => {  
    if (!originalConfig) {  
      setOriginalConfig(JSON.parse(JSON.stringify(pricingConfig)));  
    }  
  }, [pricingConfig, originalConfig]);  
  
  // 检测配置更改并更新isDirty状态  
  useEffect(() => {  
    if (originalConfig) {  
      const hasChanges = JSON.stringify(pricingConfig) !== JSON.stringify(originalConfig);  
      setIsDirty(hasChanges);  
      
      if (hasChanges) {  
        generateChangeSummary();  
      } else {  
        setPriceChangeSummary([]);  
      }  
    }  
  }, [pricingConfig, originalConfig]);  
  
  // 生成价格变更摘要  
  const generateChangeSummary = () => {  
    const summary = [];  
    
    // 基础费率变更  
    Object.keys(pricingConfig.baseRate).forEach(key => {  
      if (pricingConfig.baseRate[key] !== originalConfig.baseRate[key]) {  
        const fieldNameMap = {  
          unlockFee: '解锁费',  
          perMinuteRate: '每分钟费率',  
          minimumFare: '最低费用',  
          maximumDailyFare: '每日最高费用',  
          reservationFee: '预订费',  
          cancellationFee: '取消费',  
          parkingFineOutsideZone: '违规停车费'  
        };  
        
        summary.push({  
          category: '基础费率',  
          field: fieldNameMap[key] || key,  
          from: originalConfig.baseRate[key],  
          to: pricingConfig.baseRate[key]  
        });  
      }  
    });  
    
    // 可以添加其他类别的变更检测...  
    
    setPriceChangeSummary(summary);  
  };  
  
  // 处理基础费率变更  
  const handleBaseRateChange = (field, value) => {  
    setPricingConfig({  
      ...pricingConfig,  
      baseRate: {  
        ...pricingConfig.baseRate,  
        [field]: parseFloat(value)  
      }  
    });  
  };  
  
  // 处理时段费率变更  
  const handleTimeBasedRateChange = (id, field, value) => {  
    setPricingConfig({  
      ...pricingConfig,  
      timeBasedRates: pricingConfig.timeBasedRates.map(rate => {  
        if (rate.id === id) {  
          if (field === 'multiplier') {  
            value = parseFloat(value);  
          }  
          if (field === 'active') {  
            value = !rate.active;  
          }  
          return { ...rate, [field]: value };  
        }  
        return rate;  
      })  
    });  
  };  
  
  // 处理会员套餐变更  
  const handleMembershipPlanChange = (id, field, value) => {  
    setPricingConfig({  
      ...pricingConfig,  
      membershipPlans: pricingConfig.membershipPlans.map(plan => {  
        if (plan.id === id) {  
          if (['price', 'discountPercentage', 'freeUnlocks'].includes(field)) {  
            value = parseFloat(value);  
          }  
          if (field === 'active') {  
            value = !plan.active;  
          }  
          return { ...plan, [field]: value };  
        }  
        return plan;  
      })  
    });  
  };  
  
  // 处理促销变更  
  const handlePromotionChange = (id, field, value) => {  
    setPricingConfig({  
      ...pricingConfig,  
      promotions: pricingConfig.promotions.map(promo => {  
        if (promo.id === id) {  
          if (['discountValue', 'maxDiscount'].includes(field) && value !== null) {  
            value = parseFloat(value);  
          }  
          if (field === 'active') {  
            value = !promo.active;  
          }  
          return { ...promo, [field]: value };  
        }  
        return promo;  
      })  
    });  
  };  
  
  // 处理特殊事件变更  
  const handleSpecialEventChange = (id, field, value) => {  
    setPricingConfig({  
      ...pricingConfig,  
      specialEvents: pricingConfig.specialEvents.map(event => {  
        if (event.id === id) {  
          if (field === 'multiplier') {  
            value = parseFloat(value);  
          }  
          if (field === 'active') {  
            value = !event.active;  
          }  
          return { ...event, [field]: value };  
        }  
        return event;  
      })  
    });  
  };  
  
  // 处理区域定价变更  
  const handleZonePricingChange = (id, field, value) => {  
    setPricingConfig({  
      ...pricingConfig,  
      zonePricing: pricingConfig.zonePricing.map(zone => {  
        if (zone.id === id) {  
          if (field === 'multiplier') {  
            value = parseFloat(value);  
          }  
          if (field === 'active') {  
            value = !zone.active;  
          }  
          return { ...zone, [field]: value };  
        }  
        return zone;  
      })  
    });  
  };  
  
  // 处理删除项目  
  const handleDeleteItem = () => {  
    if (!itemToDelete) return;  
    
    const { category, id } = itemToDelete;  
    let updatedConfig = { ...pricingConfig };  
    
    switch (category) {  
      case 'timeBasedRates':  
        updatedConfig.timeBasedRates = updatedConfig.timeBasedRates.filter(item => item.id !== id);  
        break;  
      case 'membershipPlans':  
        updatedConfig.membershipPlans = updatedConfig.membershipPlans.filter(item => item.id !== id);  
        break;  
      case 'promotions':  
        updatedConfig.promotions = updatedConfig.promotions.filter(item => item.id !== id);  
        break;  
      case 'specialEvents':  
        updatedConfig.specialEvents = updatedConfig.specialEvents.filter(item => item.id !== id);  
        break;  
      case 'zonePricing':  
        updatedConfig.zonePricing = updatedConfig.zonePricing.filter(item => item.id !== id);  
        break;  
      default:  
        break;  
    }  
    
    setPricingConfig(updatedConfig);  
    setShowDeleteModal(false);  
    setItemToDelete(null);  
    setMessage({ show: true, type: 'success', content: '项目已成功删除' });  
  };  
  
  // 添加新项目  
  const handleAddNewItem = () => {  
    if (!newItem) return;  
    
    const { category, ...itemData } = newItem;  
    let updatedConfig = { ...pricingConfig };  
    const maxId = Math.max(...updatedConfig[category].map(item => item.id), 0);  
    
    const newItemWithId = {  
      ...itemData,  
      id: maxId + 1,  
      active: true  
    };  
    
    updatedConfig[category] = [...updatedConfig[category], newItemWithId];  
    
    setPricingConfig(updatedConfig);  
    setShowNewItemModal(false);  
    setNewItem(null);  
    setMessage({ show: true, type: 'success', content: '新项目已成功添加' });  
  };  
  
  // 准备添加新项目  
  const prepareNewItem = (category) => {  
    let template = {};  
    
    switch (category) {  
      case 'timeBasedRates':  
        template = { name: '', startTime: '00:00', endTime: '23:59', multiplier: 1.0 };  
        break;  
      case 'membershipPlans':  
        template = { name: '', price: 0, discountPercentage: 0, freeUnlocks: 0, description: '' };  
        break;  
      case 'promotions':  
        template = {   
          name: '',   
          code: '',   
          discountType: 'percentage',   
          discountValue: 0,   
          maxDiscount: null,   
          startDate: new Date().toISOString().split('T')[0],   
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]   
        };  
        break;  
      case 'specialEvents':  
        template = {   
          name: '',   
          startDate: new Date().toISOString().split('T')[0],   
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],   
          multiplier: 1.0,   
          description: ''   
        };  
        break;  
      case 'zonePricing':  
        template = { name: '', multiplier: 1.0, color: '#' + Math.floor(Math.random()*16777215).toString(16) };  
        break;  
      default:  
        break;  
    }  
    
    setNewItem({ category, ...template });  
    setShowNewItemModal(true);  
  };  
  
  // 保存所有更改  
  const handleSave = () => {  
    // 这里应该调用API保存配置  
    setMessage({ show: true, type: 'success', content: '价格设置已成功保存' });  
    setOriginalConfig(JSON.parse(JSON.stringify(pricingConfig)));  
    setIsDirty(false);  
  };  
  
  // 重置所有更改  
  const handleReset = () => {  
    if (originalConfig) {  
      setPricingConfig(JSON.parse(JSON.stringify(originalConfig)));  
      setMessage({ show: true, type: 'info', content: '已重置为上次保存的设置' });  
    }  
  };  
  
  // 格式化货币显示  
  const formatCurrency = (value) => {  
    return `¥${value.toFixed(2)}`;  
  };  
  
  // 处理导航到其他页面前的确认  
  const handleTabChange = (key) => {  
    if (isDirty && !confirmedExit) {  
      setShowExitModal(true);  
      return;  
    }  
    
    setActiveTab(key);  
  };  
  
  // 确认离开  
  const confirmExit = () => {  
    setConfirmedExit(true);  
    setShowExitModal(false);  
    // 此处实际应用中可能需要导航到其他页面  
  };  
  
  // 基础费率表单  
  const BaseRateForm = () => (  
    <Form>  
      <Row>  
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              解锁费  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>用户开始使用滑板车时的一次性费用</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.unlockFee}  
                onChange={(e) => handleBaseRateChange('unlockFee', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
        
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              每分钟费率  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>骑行期间每分钟收取的费用</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.perMinuteRate}  
                onChange={(e) => handleBaseRateChange('perMinuteRate', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
        
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              最低费用  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>每次骑行的最低收费金额</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.minimumFare}  
                onChange={(e) => handleBaseRateChange('minimumFare', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
        
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              每日最高费用  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>每天收费的上限金额</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.maximumDailyFare}  
                onChange={(e) => handleBaseRateChange('maximumDailyFare', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
        
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              预订费  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>预订滑板车的费用</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.reservationFee}  
                onChange={(e) => handleBaseRateChange('reservationFee', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
        
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              取消费  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>取消预订的费用</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.cancellationFee}  
                onChange={(e) => handleBaseRateChange('cancellationFee', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
        
        <Col md={6} lg={4}>  
          <Form.Group className="mb-4">  
            <Form.Label className="d-flex justify-content-between">  
              违规停车费  
              <OverlayTrigger  
                placement="top"  
                overlay={<Tooltip>在非指定区域停放滑板车的罚款</Tooltip>}  
              >  
                <FaInfoCircle className="text-muted" />  
              </OverlayTrigger>  
            </Form.Label>  
            <InputGroup>  
              <InputGroup.Text>¥</InputGroup.Text>  
              <Form.Control  
                type="number"  
                min="0"  
                step="0.01"  
                value={pricingConfig.baseRate.parkingFineOutsideZone}  
                onChange={(e) => handleBaseRateChange('parkingFineOutsideZone', e.target.value)}  
              />  
            </InputGroup>  
          </Form.Group>  
        </Col>  
      </Row>  
      
      <hr className="my-4" />  
      
      <div className="pricing-preview p-3 bg-light rounded mb-4">  
        <h5>价格预览</h5>  
        <p className="mb-1">以下是基于当前设置的价格示例：</p>  
        <Table size="sm" className="bg-white">  
          <thead>  
            <tr>  
              <th>骑行时长</th>  
              <th>总价</th>  
              <th>计算明细</th>  
            </tr>  
          </thead>  
          <tbody>  
            <tr>  
              <td>5分钟</td>  
              <td>{formatCurrency(Math.max(pricingConfig.baseRate.unlockFee + 5 * pricingConfig.baseRate.perMinuteRate, pricingConfig.baseRate.minimumFare))}</td>  
              <td>解锁费 {formatCurrency(pricingConfig.baseRate.unlockFee)} + 5分钟 × {formatCurrency(pricingConfig.baseRate.perMinuteRate)}/分钟</td>  
            </tr>  
            <tr>  
              <td>15分钟</td>  
              <td>{formatCurrency(Math.max(pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate, pricingConfig.baseRate.minimumFare))}</td>  
              <td>解锁费 {formatCurrency(pricingConfig.baseRate.unlockFee)} + 15分钟 × {formatCurrency(pricingConfig.baseRate.perMinuteRate)}/分钟</td>  
            </tr>  
            <tr>  
              <td>30分钟</td>  
              <td>{formatCurrency(Math.max(pricingConfig.baseRate.unlockFee + 30 * pricingConfig.baseRate.perMinuteRate, pricingConfig.baseRate.minimumFare))}</td>  
              <td>解锁费 {formatCurrency(pricingConfig.baseRate.unlockFee)} + 30分钟 × {formatCurrency(pricingConfig.baseRate.perMinuteRate)}/分钟</td>  
            </tr>  
          </tbody>  
        </Table>  
      </div>  
    </Form>  
  );  
  
  // 时段定价表格  
  const TimeBasedRatesTable = () => (  
    <div>  
      <div className="d-flex justify-content-between mb-3">  
        <h5>时段定价设置</h5>  
        <Button variant="outline-primary" size="sm" onClick={() => prepareNewItem('timeBasedRates')}>  
          <FaPlus className="me-1" /> 添加时段  
        </Button>  
      </div>  
      
      <Table responsive hover>  
        <thead>  
          <tr>  
            <th>时段名称</th>  
            <th>开始时间</th>  
            <th>结束时间</th>  
            <th>价格系数</th>  
            <th>状态</th>  
            <th>操作</th>  
          </tr>  
        </thead>  
        <tbody>  
          {pricingConfig.timeBasedRates.map(rate => (  
            <tr key={rate.id} className={!rate.active ? 'text-muted' : ''}>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={rate.name}  
                  onChange={(e) => handleTimeBasedRateChange(rate.id, 'name', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Control  
                  type="time"  
                  value={rate.startTime}  
                  onChange={(e) => handleTimeBasedRateChange(rate.id, 'startTime', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Control  
                  type="time"  
                  value={rate.endTime}  
                  onChange={(e) => handleTimeBasedRateChange(rate.id, 'endTime', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <Form.Control  
                    type="number"  
                    value={rate.multiplier}  
                    onChange={(e) => handleTimeBasedRateChange(rate.id, 'multiplier', e.target.value)}  
                    min="0"  
                    step="0.05"  
                  />  
                  <InputGroup.Text>×</InputGroup.Text>  
                </InputGroup>  
              </td>  
              <td>  
                <Form.Check  
                  type="switch"  
                  id={`time-status-${rate.id}`}  
                  checked={rate.active}  
                  onChange={() => handleTimeBasedRateChange(rate.id, 'active')}  
                  label={rate.active ? '启用' : '禁用'}  
                />  
              </td>  
              <td>  
                <Button  
                  variant="outline-danger"  
                  size="sm"  
                  onClick={() => {  
                    setItemToDelete({ category: 'timeBasedRates', id: rate.id, name: rate.name });  
                    setShowDeleteModal(true);  
                  }}  
                >  
                  <FaTrash />  
                </Button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </Table>  
      
      <div className="pricing-preview p-3 bg-light rounded my-4">  
        <h5>时段价格示例</h5>  
        <p className="mb-3">15分钟骑行在不同时段的价格：</p>  
        <Row>  
          {pricingConfig.timeBasedRates.filter(rate => rate.active).map(rate => {  
            const basePrice = Math.max(  
              pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
              pricingConfig.baseRate.minimumFare  
            );  
            const adjustedPrice = basePrice * rate.multiplier;  
            
            return (  
              <Col key={rate.id} md={6} lg={3} className="mb-3">  
                <Card>  
                  <Card.Body className="p-3">  
                    <h6>{rate.name} ({rate.startTime}-{rate.endTime})</h6>  
                    <div className="fs-5 fw-bold mb-1">{formatCurrency(adjustedPrice)}</div>  
                    <small className="text-muted">  
                      基础价格 {formatCurrency(basePrice)} × {rate.multiplier}  
                    </small>  
                  </Card.Body>  
                </Card>  
              </Col>  
            );  
          })}  
        </Row>  
      </div>  
    </div>  
  );  
  
  // 会员套餐表格  
  const MembershipPlansTable = () => (  
    <div>  
      <div className="d-flex justify-content-between mb-3">  
        <h5>会员套餐设置</h5>  
        <Button variant="outline-primary" size="sm" onClick={() => prepareNewItem('membershipPlans')}>  
          <FaPlus className="me-1" /> 添加套餐  
        </Button>  
      </div>  
      
      <Table responsive hover>  
        <thead>  
          <tr>  
            <th>套餐名称</th>  
            <th>价格</th>  
            <th>折扣比例</th>  
            <th>免费解锁次数</th>  
            <th>描述</th>  
            <th>状态</th>  
            <th>操作</th>  
          </tr>  
        </thead>  
        <tbody>  
          {pricingConfig.membershipPlans.map(plan => (  
            <tr key={plan.id} className={!plan.active ? 'text-muted' : ''}>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={plan.name}  
                  onChange={(e) => handleMembershipPlanChange(plan.id, 'name', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <InputGroup.Text>¥</InputGroup.Text>  
                  <Form.Control  
                    type="number"  
                    value={plan.price}  
                    onChange={(e) => handleMembershipPlanChange(plan.id, 'price', e.target.value)}  
                    min="0"  
                    step="0.01"  
                  />  
                </InputGroup>  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <Form.Control  
                    type="number"  
                    value={plan.discountPercentage}  
                    onChange={(e) => handleMembershipPlanChange(plan.id, 'discountPercentage', e.target.value)}  
                    min="0"  
                    max="100"  
                  />  
                  <InputGroup.Text>%</InputGroup.Text>  
                </InputGroup>  
              </td>  
              <td>  
                <Form.Control  
                  type="number"  
                  value={plan.freeUnlocks}  
                  onChange={(e) => handleMembershipPlanChange(plan.id, 'freeUnlocks', e.target.value)}  
                  min="0"  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={plan.description}  
                  onChange={(e) => handleMembershipPlanChange(plan.id, 'description', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Check  
                  type="switch"  
                  id={`member-status-${plan.id}`}  
                  checked={plan.active}  
                  onChange={() => handleMembershipPlanChange(plan.id, 'active')}  
                  label={plan.active ? '启用' : '禁用'}  
                />  
              </td>  
              <td>  
                <Button  
                  variant="outline-danger"  
                  size="sm"  
                  onClick={() => {  
                    setItemToDelete({ category: 'membershipPlans', id: plan.id, name: plan.name });  
                    setShowDeleteModal(true);  
                  }}  
                >  
                  <FaTrash />  
                </Button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </Table>  
      
      <div className="pricing-preview p-3 bg-light rounded my-4">  
        <h5>会员套餐价值示例</h5>  
        <p className="mb-3">15分钟骑行10次的费用比较：</p>  
        <Row>  
          <Col md={6} lg={3} className="mb-3">  
            <Card>  
              <Card.Body className="p-3">  
                <h6>非会员价格</h6>  
                <div className="fs-5 fw-bold mb-1">  
                  {formatCurrency(10 * Math.max(  
                    pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
                    pricingConfig.baseRate.minimumFare  
                  ))}  
                </div>  
                <small className="text-muted">  
                  {formatCurrency(Math.max(  
                    pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
                    pricingConfig.baseRate.minimumFare  
                  ))} × 10次  
                </small>  
              </Card.Body>  
            </Card>  
          </Col>  
          
          {pricingConfig.membershipPlans.filter(plan => plan.active).map(plan => {  
            const basePrice = Math.max(  
              pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
              pricingConfig.baseRate.minimumFare  
            );  
            
            const freeUnlocksUsed = Math.min(plan.freeUnlocks, 10);  
            const paidRides = 10 - freeUnlocksUsed;  
            
            const discountedBasePrice = basePrice * (1 - plan.discountPercentage / 100);  
            const totalCost = plan.price + paidRides * discountedBasePrice;  
            
            return (  
              <Col key={plan.id} md={6} lg={3} className="mb-3">  
                <Card className="border-primary">  
                  <Card.Body className="p-3">  
                    <h6>{plan.name}</h6>  
                    <div className="fs-5 fw-bold mb-1">{formatCurrency(totalCost)}</div>  
                    <small className="text-muted">  
                      套餐费 {formatCurrency(plan.price)} + {paidRides}次付费骑行  
                      <br />  
                      （已使用{freeUnlocksUsed}次免费解锁）  
                    </small>  
                  </Card.Body>  
                </Card>  
              </Col>  
            );  
          })}  
        </Row>  
      </div>  
    </div>  
  );  
  
  // 促销优惠表格  
  const PromotionsTable = () => (  
    <div>  
      <div className="d-flex justify-content-between mb-3">  
        <h5>促销优惠设置</h5>  
        <Button variant="outline-primary" size="sm" onClick={() => prepareNewItem('promotions')}>  
          <FaPlus className="me-1" /> 添加促销  
        </Button>  
      </div>  
      
      <Table responsive hover>  
        <thead>  
          <tr>  
            <th>促销名称</th>  
            <th>优惠码</th>  
            <th>折扣类型</th>  
            <th>折扣值</th>  
            <th>最高折扣</th>  
            <th>有效期</th>  
            <th>状态</th>  
            <th>操作</th>  
          </tr>  
        </thead>  
        <tbody>  
          {pricingConfig.promotions.map(promo => (  
            <tr key={promo.id} className={!promo.active ? 'text-muted' : ''}>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={promo.name}  
                  onChange={(e) => handlePromotionChange(promo.id, 'name', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={promo.code}  
                  onChange={(e) => handlePromotionChange(promo.id, 'code', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Select  
                  value={promo.discountType}  
                  onChange={(e) => handlePromotionChange(promo.id, 'discountType', e.target.value)}  
                  size="sm"  
                >  
                  <option value="percentage">百分比折扣</option>  
                  <option value="fixed">固定金额</option>  
                </Form.Select>  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <Form.Control  
                    type="number"  
                    value={promo.discountValue}  
                    onChange={(e) => handlePromotionChange(promo.id, 'discountValue', e.target.value)}  
                    min="0"  
                    step={promo.discountType === 'percentage' ? '1' : '0.01'}  
                  />  
                  <InputGroup.Text>{promo.discountType === 'percentage' ? '%' : '¥'}</InputGroup.Text>  
                </InputGroup>  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <Form.Control  
                    type="number"  
                    value={promo.maxDiscount === null ? '' : promo.maxDiscount}  
                    onChange={(e) => handlePromotionChange(promo.id, 'maxDiscount', e.target.value === '' ? null : e.target.value)}  
                    min="0"  
                    step="0.01"  
                    placeholder="无上限"  
                  />  
                  <InputGroup.Text>¥</InputGroup.Text>  
                </InputGroup>  
              </td>  
              <td>  
                <div className="d-flex gap-1">  
                  <Form.Control  
                    type="date"  
                    value={promo.startDate}  
                    onChange={(e) => handlePromotionChange(promo.id, 'startDate', e.target.value)}  
                    size="sm"  
                  />  
                  <span>-</span>  
                  <Form.Control  
                    type="date"  
                    value={promo.endDate}  
                    onChange={(e) => handlePromotionChange(promo.id, 'endDate', e.target.value)}  
                    size="sm"  
                  />  
                </div>  
              </td>  
              <td>  
                <Form.Check  
                  type="switch"  
                  id={`promo-status-${promo.id}`}  
                  checked={promo.active}  
                  onChange={() => handlePromotionChange(promo.id, 'active')}  
                  label={promo.active ? '启用' : '禁用'}  
                />  
              </td>  
              <td>  
                <Button  
                  variant="outline-danger"  
                  size="sm"  
                  onClick={() => {  
                    setItemToDelete({ category: 'promotions', id: promo.id, name: promo.name });  
                    setShowDeleteModal(true);  
                  }}  
                >  
                  <FaTrash />  
                </Button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </Table>  
      
      <div className="pricing-preview p-3 bg-light rounded my-4">  
        <h5>促销优惠效果示例</h5>  
        <p className="mb-3">15分钟骑行的折扣价格：</p>  
        <Row>  
          <Col md={6} lg={3} className="mb-3">  
            <Card>  
              <Card.Body className="p-3">  
                <h6>标准价格</h6>  
                <div className="fs-5 fw-bold mb-1">  
                  {formatCurrency(Math.max(  
                    pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
                    pricingConfig.baseRate.minimumFare  
                  ))}  
                </div>  
                <small className="text-muted">  
                  无折扣  
                </small>  
              </Card.Body>  
            </Card>  
          </Col>  
          
          {pricingConfig.promotions.filter(promo => promo.active).map(promo => {  
            const basePrice = Math.max(  
              pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
              pricingConfig.baseRate.minimumFare  
            );  
            
            let discountAmount;  
            if (promo.discountType === 'percentage') {  
              discountAmount = basePrice * (promo.discountValue / 100);  
            } else {  
              discountAmount = promo.discountValue;  
            }  
            
            // 应用最高折扣限制  
            if (promo.maxDiscount !== null && discountAmount > promo.maxDiscount) {  
              discountAmount = promo.maxDiscount;  
            }  
            
            // 确保折扣不超过原价  
            discountAmount = Math.min(discountAmount, basePrice);  
            
            const finalPrice = basePrice - discountAmount;  
            
            return (  
              <Col key={promo.id} md={6} lg={3} className="mb-3">  
                <Card className="border-success">  
                  <Card.Body className="p-3">  
                    <div className="d-flex justify-content-between">  
                      <h6>{promo.name}</h6>  
                      <Badge bg="success">{promo.code}</Badge>  
                    </div>  
                    <div className="fs-5 fw-bold mb-1">{formatCurrency(finalPrice)}</div>  
                    <small className="text-muted">  
                      {formatCurrency(basePrice)} - {formatCurrency(discountAmount)} 折扣  
                      <br />  
                      {promo.discountType === 'percentage' ?   
                        `${promo.discountValue}% 折扣` :   
                        `固定折扣 ${formatCurrency(promo.discountValue)}`}  
                    </small>  
                  </Card.Body>  
                </Card>  
              </Col>  
            );  
          })}  
        </Row>  
      </div>  
    </div>  
  );  
  
  // 特殊事件表格  
  const SpecialEventsTable = () => (  
    <div>  
      <div className="d-flex justify-content-between mb-3">  
        <h5>特殊事件定价</h5>  
        <Button variant="outline-primary" size="sm" onClick={() => prepareNewItem('specialEvents')}>  
          <FaPlus className="me-1" /> 添加事件  
        </Button>  
      </div>  
      
      <Table responsive hover>  
        <thead>  
          <tr>  
            <th>事件名称</th>  
            <th>开始日期</th>  
            <th>结束日期</th>  
            <th>价格系数</th>  
            <th>描述</th>  
            <th>状态</th>  
            <th>操作</th>  
          </tr>  
        </thead>  
        <tbody>  
          {pricingConfig.specialEvents.map(event => (  
            <tr key={event.id} className={!event.active ? 'text-muted' : ''}>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={event.name}  
                  onChange={(e) => handleSpecialEventChange(event.id, 'name', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Control  
                  type="date"  
                  value={event.startDate}  
                  onChange={(e) => handleSpecialEventChange(event.id, 'startDate', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Control  
                  type="date"  
                  value={event.endDate}  
                  onChange={(e) => handleSpecialEventChange(event.id, 'endDate', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <Form.Control  
                    type="number"  
                    value={event.multiplier}  
                    onChange={(e) => handleSpecialEventChange(event.id, 'multiplier', e.target.value)}  
                    min="0"  
                    step="0.05"  
                  />  
                  <InputGroup.Text>×</InputGroup.Text>  
                </InputGroup>  
              </td>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={event.description}  
                  onChange={(e) => handleSpecialEventChange(event.id, 'description', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <Form.Check  
                  type="switch"  
                  id={`event-status-${event.id}`}  
                  checked={event.active}  
                  onChange={() => handleSpecialEventChange(event.id, 'active')}  
                  label={event.active ? '启用' : '禁用'}  
                />  
              </td>  
              <td>  
                <Button  
                  variant="outline-danger"  
                  size="sm"  
                  onClick={() => {  
                    setItemToDelete({ category: 'specialEvents', id: event.id, name: event.name });  
                    setShowDeleteModal(true);  
                  }}  
                >  
                  <FaTrash />  
                </Button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </Table>  
      
      <div className="pricing-preview p-3 bg-light rounded my-4">  
        <h5>特殊事件价格示例</h5>  
        <p className="mb-3">15分钟骑行在特殊事件期间的价格：</p>  
        <Row>  
          <Col md={6} lg={3} className="mb-3">  
            <Card>  
              <Card.Body className="p-3">  
                <h6>标准价格</h6>  
                <div className="fs-5 fw-bold mb-1">  
                  {formatCurrency(Math.max(  
                    pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
                    pricingConfig.baseRate.minimumFare  
                  ))}  
                </div>  
                <small className="text-muted">  
                  无特殊事件调整  
                </small>  
              </Card.Body>  
            </Card>  
          </Col>  
          
          {pricingConfig.specialEvents.filter(event => event.active).map(event => {  
            const basePrice = Math.max(  
              pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
              pricingConfig.baseRate.minimumFare  
            );  
            const adjustedPrice = basePrice * event.multiplier;  
            
            return (  
              <Col key={event.id} md={6} lg={3} className="mb-3">  
                <Card className="border-warning">  
                  <Card.Body className="p-3">  
                    <h6>{event.name}</h6>  
                    <div className="fs-5 fw-bold mb-1">{formatCurrency(adjustedPrice)}</div>  
                    <small className="text-muted">  
                      基础价格 {formatCurrency(basePrice)} × {event.multiplier}  
                      <br />  
                      有效期: {event.startDate} 至 {event.endDate}  
                    </small>  
                  </Card.Body>  
                </Card>  
              </Col>  
            );  
          })}  
        </Row>  
      </div>  
    </div>  
  );  
  
  // 区域定价表格  
  const ZonePricingTable = () => (  
    <div>  
      <div className="d-flex justify-content-between mb-3">  
        <h5>区域定价设置</h5>  
        <Button variant="outline-primary" size="sm" onClick={() => prepareNewItem('zonePricing')}>  
          <FaPlus className="me-1" /> 添加区域  
        </Button>  
      </div>  
      
      <div className="mb-4 p-3 bg-light rounded">  
        <div className="d-flex align-items-center mb-2">  
          <FaInfoCircle className="text-primary me-2" />  
          <span>区域定价将根据滑板车所在区域调整价格。您可以在地图上定义不同的区域并设置价格系数。</span>  
        </div>  
        <div className="map-placeholder bg-white p-5 text-center rounded">  
          <FaMapMarkedAlt size={32} className="mb-3 text-muted" />  
          <p>此处将显示区域地图设置界面</p>  
        </div>  
      </div>  
      
      <Table responsive hover>  
        <thead>  
          <tr>  
            <th>区域名称</th>  
            <th>价格系数</th>  
            <th>颜色</th>  
            <th>状态</th>  
            <th>操作</th>  
          </tr>  
        </thead>  
        <tbody>  
          {pricingConfig.zonePricing.map(zone => (  
            <tr key={zone.id} className={!zone.active ? 'text-muted' : ''}>  
              <td>  
                <Form.Control  
                  type="text"  
                  value={zone.name}  
                  onChange={(e) => handleZonePricingChange(zone.id, 'name', e.target.value)}  
                  size="sm"  
                />  
              </td>  
              <td>  
                <InputGroup size="sm">  
                  <Form.Control  
                    type="number"  
                    value={zone.multiplier}  
                    onChange={(e) => handleZonePricingChange(zone.id, 'multiplier', e.target.value)}  
                    min="0"  
                    step="0.05"  
                  />  
                  <InputGroup.Text>×</InputGroup.Text>  
                </InputGroup>  
              </td>  
              <td>  
                <Form.Control  
                  type="color"  
                  value={zone.color}  
                  onChange={(e) => handleZonePricingChange(zone.id, 'color', e.target.value)}  
                  title="选择区域颜色"  
                  size="sm"  
                  style={{ width: '60px' }}  
                />  
              </td>  
              <td>  
                <Form.Check  
                  type="switch"  
                  id={`zone-status-${zone.id}`}  
                  checked={zone.active}  
                  onChange={() => handleZonePricingChange(zone.id, 'active')}  
                  label={zone.active ? '启用' : '禁用'}  
                />  
              </td>  
              <td>  
                <Button  
                  variant="outline-danger"  
                  size="sm"  
                  onClick={() => {  
                    setItemToDelete({ category: 'zonePricing', id: zone.id, name: zone.name });  
                    setShowDeleteModal(true);  
                  }}  
                >  
                  <FaTrash />  
                </Button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </Table>  
      
      <div className="pricing-preview p-3 bg-light rounded my-4">  
        <h5>区域价格示例</h5>  
        <p className="mb-3">15分钟骑行在不同区域的价格：</p>  
        <Row>  
          <Col md={6} lg={3} className="mb-3">  
            <Card>  
              <Card.Body className="p-3">  
                <h6>标准区域</h6>  
                <div className="fs-5 fw-bold mb-1">  
                  {formatCurrency(Math.max(  
                    pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
                    pricingConfig.baseRate.minimumFare  
                  ))}  
                </div>  
                <small className="text-muted">  
                  无区域调整  
                </small>  
              </Card.Body>  
            </Card>  
          </Col>  
          
          {pricingConfig.zonePricing.filter(zone => zone.active).map(zone => {  
            const basePrice = Math.max(  
              pricingConfig.baseRate.unlockFee + 15 * pricingConfig.baseRate.perMinuteRate,  
              pricingConfig.baseRate.minimumFare  
            );  
            const adjustedPrice = basePrice * zone.multiplier;  
            
            return (  
              <Col key={zone.id} md={6} lg={3} className="mb-3">  
                <Card style={{ borderColor: zone.color }}>  
                  <Card.Body className="p-3">  
                    <h6 style={{ color: zone.color }}>{zone.name}</h6>  
                    <div className="fs-5 fw-bold mb-1">{formatCurrency(adjustedPrice)}</div>  
                    <small className="text-muted">  
                      基础价格 {formatCurrency(basePrice)} × {zone.multiplier}  
                    </small>  
                  </Card.Body>  
                </Card>  
              </Col>  
            );  
          })}  
        </Row>  
      </div>  
    </div>  
  );  
  
  return (  
    <Container fluid className="py-4">  
      <Row className="mb-4">  
        <Col>  
          <h2 className="mb-1">价格设置</h2>  
          <p className="text-muted">管理滑板车租赁的所有价格策略</p>  
        </Col>  
        <Col xs="auto" className="d-flex gap-2">  
          <Button   
            variant="outline-secondary"   
            onClick={() => setShowHistoryModal(true)}  
          >  
            <FaHistory className="me-1" /> 价格历史  
          </Button>  
          <Button   
            variant="outline-secondary"   
            onClick={handleReset}  
            disabled={!isDirty}  
          >  
            <FaUndo className="me-1" /> 重置更改  
          </Button>  
          <Button   
            variant="primary"   
            onClick={handleSave}  
            disabled={!isDirty}  
          >  
            <FaSave className="me-1" /> 保存设置  
          </Button>  
        </Col>  
      </Row>  
      
      {message.show && (  
        <Alert   
          variant={message.type}   
          onClose={() => setMessage({ ...message, show: false })}   
          dismissible  
          className="mb-4"  
        >  
          {message.content}  
        </Alert>  
      )}  
      
      {isDirty && priceChangeSummary.length > 0 && (  
        <Alert variant="info" className="mb-4">  
          <div className="d-flex">  
            <FaInfoCircle className="me-2 mt-1" />  
            <div>  
              <strong>价格变更摘要：</strong>  
              <ul className="mb-0 mt-1">  
                {priceChangeSummary.map((change, idx) => (  
                  <li key={idx}>  
                    {change.category} - {change.field}：{change.from} → {change.to}  
                  </li>  
                ))}  
              </ul>  
            </div>  
          </div>  
        </Alert>  
      )}  
      
      <Card className="border-0 shadow-sm mb-4">  
        <Card.Body>  
          <Tabs  
            activeKey={activeTab}  
            onSelect={handleTabChange}  
            className="mb-4"  
          >  
            <Tab eventKey="baseRate" title={<span><FaPercentage className="me-1" /> 基础费率</span>}>  
              <BaseRateForm />  
            </Tab>  
            <Tab eventKey="timeBasedRates" title={<span><FaClock className="me-1" /> 时段定价</span>}>  
              <TimeBasedRatesTable />  
            </Tab>  
            <Tab eventKey="membershipPlans" title={<span><FaUserTag className="me-1" /> 会员套餐</span>}>  
              <MembershipPlansTable />  
            </Tab>  
            <Tab eventKey="promotions" title={<span><FaPercentage className="me-1" /> 促销优惠</span>}>  
              <PromotionsTable />  
            </Tab>  
            <Tab eventKey="specialEvents" title={<span><FaCalendarAlt className="me-1" /> 特殊事件</span>}>  
              <SpecialEventsTable />  
            </Tab>  
            <Tab eventKey="zonePricing" title={<span><FaMapMarkedAlt className="me-1" /> 区域定价</span>}>  
              <ZonePricingTable />  
            </Tab>  
          </Tabs>  
        </Card.Body>  
      </Card>  
      
      {/* 历史记录模态框 */}  
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg">  
        <Modal.Header closeButton>  
          <Modal.Title>价格变更历史</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <Table responsive hover>  
            <thead>  
              <tr>  
              <th>日期</th>  
                <th>操作人</th>  
                <th>变更内容</th>  
                <th>类别</th>  
              </tr>  
            </thead>  
            <tbody>  
              {pricingHistory.map(item => (  
                <tr key={item.id}>  
                  <td>{item.date}</td>  
                  <td>{item.user}</td>  
                  <td>{item.changes}</td>  
                  <td>  
                    <Badge bg={  
                      item.type === 'baseRate' ? 'primary' :  
                      item.type === 'timeBasedRates' ? 'info' :  
                      item.type === 'membershipPlans' ? 'success' :  
                      item.type === 'promotions' ? 'warning' :  
                      item.type === 'zonePricing' ? 'danger' : 'secondary'  
                    }>  
                      {  
                        item.type === 'baseRate' ? '基础费率' :  
                        item.type === 'timeBasedRates' ? '时段定价' :  
                        item.type === 'membershipPlans' ? '会员套餐' :  
                        item.type === 'promotions' ? '促销优惠' :  
                        item.type === 'specialEvents' ? '特殊事件' :  
                        item.type === 'zonePricing' ? '区域定价' : '其他'  
                      }  
                    </Badge>  
                  </td>  
                </tr>  
              ))}  
            </tbody>  
          </Table>  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>  
            关闭  
          </Button>  
        </Modal.Footer>  
      </Modal>  
      
      {/* 删除确认模态框 */}  
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>  
        <Modal.Header closeButton>  
          <Modal.Title>确认删除</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <div className="d-flex">  
            <div className="me-3">  
              <FaExclamationTriangle size={24} className="text-warning" />  
            </div>  
            <div>  
              <p>您确定要删除以下项目吗？</p>  
              <p className="fw-bold">{itemToDelete?.name}</p>  
              <p className="mb-0 text-muted">此操作无法撤销，删除后相关价格设置将不再生效。</p>  
            </div>  
          </div>  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>  
            取消  
          </Button>  
          <Button variant="danger" onClick={handleDeleteItem}>  
            确认删除  
          </Button>  
        </Modal.Footer>  
      </Modal>  
      
      {/* 添加新项目模态框 */}  
      <Modal show={showNewItemModal} onHide={() => setShowNewItemModal(false)}>  
        <Modal.Header closeButton>  
          <Modal.Title>  
            添加  
            {newItem?.category === 'timeBasedRates' && '时段定价'}  
            {newItem?.category === 'membershipPlans' && '会员套餐'}  
            {newItem?.category === 'promotions' && '促销优惠'}  
            {newItem?.category === 'specialEvents' && '特殊事件'}  
            {newItem?.category === 'zonePricing' && '区域定价'}  
          </Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          {newItem?.category === 'timeBasedRates' && (  
            <Form>  
              <Form.Group className="mb-3">  
                <Form.Label>时段名称</Form.Label>  
                <Form.Control  
                  type="text"  
                  value={newItem.name}  
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}  
                />  
              </Form.Group>  
              <Row>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>开始时间</Form.Label>  
                    <Form.Control  
                      type="time"  
                      value={newItem.startTime}  
                      onChange={(e) => setNewItem({...newItem, startTime: e.target.value})}  
                    />  
                  </Form.Group>  
                </Col>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>结束时间</Form.Label>  
                    <Form.Control  
                      type="time"  
                      value={newItem.endTime}  
                      onChange={(e) => setNewItem({...newItem, endTime: e.target.value})}  
                    />  
                  </Form.Group>  
                </Col>  
              </Row>  
              <Form.Group className="mb-3">  
                <Form.Label>价格系数</Form.Label>  
                <InputGroup>  
                  <Form.Control  
                    type="number"  
                    value={newItem.multiplier}  
                    onChange={(e) => setNewItem({...newItem, multiplier: parseFloat(e.target.value)})}  
                    min="0"  
                    step="0.05"  
                  />  
                  <InputGroup.Text>×</InputGroup.Text>  
                </InputGroup>  
                <Form.Text className="text-muted">  
                  基础价格将乘以此系数，1.0表示无变化，小于1表示折扣，大于1表示溢价  
                </Form.Text>  
              </Form.Group>  
            </Form>  
          )}  
          
          {newItem?.category === 'membershipPlans' && (  
            <Form>  
              <Form.Group className="mb-3">  
                <Form.Label>套餐名称</Form.Label>  
                <Form.Control  
                  type="text"  
                  value={newItem.name}  
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}  
                />  
              </Form.Group>  
              <Form.Group className="mb-3">  
                <Form.Label>价格</Form.Label>  
                <InputGroup>  
                  <InputGroup.Text>¥</InputGroup.Text>  
                  <Form.Control  
                    type="number"  
                    value={newItem.price}  
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}  
                    min="0"  
                    step="0.01"  
                  />  
                </InputGroup>  
              </Form.Group>  
              <Row>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>折扣比例 (%)</Form.Label>  
                    <InputGroup>  
                      <Form.Control  
                        type="number"  
                        value={newItem.discountPercentage}  
                        onChange={(e) => setNewItem({...newItem, discountPercentage: parseFloat(e.target.value)})}  
                        min="0"  
                        max="100"  
                      />  
                      <InputGroup.Text>%</InputGroup.Text>  
                    </InputGroup>  
                  </Form.Group>  
                </Col>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>免费解锁次数</Form.Label>  
                    <Form.Control  
                      type="number"  
                      value={newItem.freeUnlocks}  
                      onChange={(e) => setNewItem({...newItem, freeUnlocks: parseInt(e.target.value)})}  
                      min="0"  
                    />  
                  </Form.Group>  
                </Col>  
              </Row>  
              <Form.Group className="mb-3">  
                <Form.Label>描述</Form.Label>  
                <Form.Control  
                  as="textarea"  
                  rows={2}  
                  value={newItem.description}  
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}  
                />  
              </Form.Group>  
            </Form>  
          )}  
          
          {newItem?.category === 'promotions' && (  
            <Form>  
              <Form.Group className="mb-3">  
                <Form.Label>促销名称</Form.Label>  
                <Form.Control  
                  type="text"  
                  value={newItem.name}  
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}  
                />  
              </Form.Group>  
              <Form.Group className="mb-3">  
                <Form.Label>优惠码</Form.Label>  
                <Form.Control  
                  type="text"  
                  value={newItem.code}  
                  onChange={(e) => setNewItem({...newItem, code: e.target.value})}  
                />  
                <Form.Text className="text-muted">  
                  用户输入此代码获得折扣，建议使用大写字母和数字  
                </Form.Text>  
              </Form.Group>  
              <Row>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>折扣类型</Form.Label>  
                    <Form.Select  
                      value={newItem.discountType}  
                      onChange={(e) => setNewItem({...newItem, discountType: e.target.value})}  
                    >  
                      <option value="percentage">百分比折扣</option>  
                      <option value="fixed">固定金额</option>  
                    </Form.Select>  
                  </Form.Group>  
                </Col>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>折扣值</Form.Label>  
                    <InputGroup>  
                      <Form.Control  
                        type="number"  
                        value={newItem.discountValue}  
                        onChange={(e) => setNewItem({...newItem, discountValue: parseFloat(e.target.value)})}  
                        min="0"  
                        step={newItem.discountType === 'percentage' ? '1' : '0.01'}  
                      />  
                      <InputGroup.Text>{newItem.discountType === 'percentage' ? '%' : '¥'}</InputGroup.Text>  
                    </InputGroup>  
                  </Form.Group>  
                </Col>  
              </Row>  
              <Form.Group className="mb-3">  
                <Form.Label>最高折扣金额</Form.Label>  
                <InputGroup>  
                  <InputGroup.Text>¥</InputGroup.Text>  
                  <Form.Control  
                    type="number"  
                    value={newItem.maxDiscount === null ? '' : newItem.maxDiscount}  
                    onChange={(e) => setNewItem({...newItem, maxDiscount: e.target.value === '' ? null : parseFloat(e.target.value)})}  
                    min="0"  
                    step="0.01"  
                    placeholder="无上限"  
                  />  
                </InputGroup>  
                <Form.Text className="text-muted">  
                  留空表示没有折扣上限  
                </Form.Text>  
              </Form.Group>  
              <Row>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>开始日期</Form.Label>  
                    <Form.Control  
                      type="date"  
                      value={newItem.startDate}  
                      onChange={(e) => setNewItem({...newItem, startDate: e.target.value})}  
                    />  
                  </Form.Group>  
                </Col>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>结束日期</Form.Label>  
                    <Form.Control  
                      type="date"  
                      value={newItem.endDate}  
                      onChange={(e) => setNewItem({...newItem, endDate: e.target.value})}  
                    />  
                  </Form.Group>  
                </Col>  
              </Row>  
            </Form>  
          )}  
          
          {newItem?.category === 'specialEvents' && (  
            <Form>  
              <Form.Group className="mb-3">  
                <Form.Label>事件名称</Form.Label>  
                <Form.Control  
                  type="text"  
                  value={newItem.name}  
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}  
                />  
              </Form.Group>  
              <Row>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>开始日期</Form.Label>  
                    <Form.Control  
                      type="date"  
                      value={newItem.startDate}  
                      onChange={(e) => setNewItem({...newItem, startDate: e.target.value})}  
                    />  
                  </Form.Group>  
                </Col>  
                <Col>  
                  <Form.Group className="mb-3">  
                    <Form.Label>结束日期</Form.Label>  
                    <Form.Control  
                      type="date"  
                      value={newItem.endDate}  
                      onChange={(e) => setNewItem({...newItem, endDate: e.target.value})}  
                    />  
                  </Form.Group>  
                </Col>  
              </Row>  
              <Form.Group className="mb-3">  
                <Form.Label>价格系数</Form.Label>  
                <InputGroup>  
                  <Form.Control  
                    type="number"  
                    value={newItem.multiplier}  
                    onChange={(e) => setNewItem({...newItem, multiplier: parseFloat(e.target.value)})}  
                    min="0"  
                    step="0.05"  
                  />  
                  <InputGroup.Text>×</InputGroup.Text>  
                </InputGroup>  
                <Form.Text className="text-muted">  
                  基础价格将乘以此系数，小于1表示折扣，大于1表示溢价  
                </Form.Text>  
              </Form.Group>  
              <Form.Group className="mb-3">  
                <Form.Label>描述</Form.Label>  
                <Form.Control  
                  as="textarea"  
                  rows={2}  
                  value={newItem.description}  
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}  
                />  
              </Form.Group>  
            </Form>  
          )}  
          
          {newItem?.category === 'zonePricing' && (  
            <Form>  
              <Form.Group className="mb-3">  
                <Form.Label>区域名称</Form.Label>  
                <Form.Control  
                  type="text"  
                  value={newItem.name}  
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}  
                />  
              </Form.Group>  
              <Form.Group className="mb-3">  
                <Form.Label>价格系数</Form.Label>  
                <InputGroup>  
                  <Form.Control  
                    type="number"  
                    value={newItem.multiplier}  
                    onChange={(e) => setNewItem({...newItem, multiplier: parseFloat(e.target.value)})}  
                    min="0"  
                    step="0.05"  
                  />  
                  <InputGroup.Text>×</InputGroup.Text>  
                </InputGroup>  
                <Form.Text className="text-muted">  
                  基础价格将乘以此系数，小于1表示折扣，大于1表示溢价  
                </Form.Text>  
              </Form.Group>  
              <Form.Group className="mb-3">  
                <Form.Label>区域颜色</Form.Label>  
                <Form.Control  
                  type="color"  
                  value={newItem.color}  
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})}  
                  title="选择区域颜色"  
                />  
                <Form.Text className="text-muted">  
                  此颜色将在地图上用于标识该区域  
                </Form.Text>  
              </Form.Group>  
              <div className="map-placeholder bg-light p-3 text-center rounded mb-3">  
                <small className="text-muted">区域边界将在地图上设置</small>  
              </div>  
            </Form>  
          )}  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="outline-secondary" onClick={() => setShowNewItemModal(false)}>  
            取消  
          </Button>  
          <Button variant="primary" onClick={handleAddNewItem}>  
            添加  
          </Button>  
        </Modal.Footer>  
      </Modal>  
      
      {/* 未保存更改确认模态框 */}  
      <Modal show={showExitModal} onHide={() => setShowExitModal(false)}>  
        <Modal.Header closeButton>  
          <Modal.Title>未保存的更改</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <div className="d-flex">  
            <div className="me-3">  
              <FaExclamationTriangle size={24} className="text-warning" />  
            </div>  
            <div>  
              <p>您有未保存的价格设置更改，离开此页面将丢失这些更改。</p>  
              <p className="mb-0">您确定要离开吗？</p>  
            </div>  
          </div>  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="outline-secondary" onClick={() => setShowExitModal(false)}>  
            留在当前页面  
          </Button>  
          <Button variant="danger" onClick={confirmExit}>  
            离开并放弃更改  
          </Button>  
          <Button variant="primary" onClick={handleSave}>  
            <FaSave className="me-1" /> 保存并离开  
          </Button>  
        </Modal.Footer>  
      </Modal>  
    </Container>  
  );  
};  

export default PricingSettings;