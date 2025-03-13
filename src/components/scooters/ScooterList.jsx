import React, { useState, useEffect } from 'react';  
import { Container, Row, Col, Form, Button, Spinner, Alert, Card } from 'react-bootstrap';  
import { FaSearch, FaMapMarkerAlt, FaFilter, FaSortAmountDown } from 'react-icons/fa';  
import { useNavigate } from 'react-router-dom';  
import ScooterItem from './ScooterItem';  
import Map from '../common/Map';  
import ScooterService from '../../services/scooter.service';  
import '../../styles/components/ScooterList.css';  

const ScooterList = () => {  
  const [scooters, setScooters] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [showMap, setShowMap] = useState(false);  
  const [filters, setFilters] = useState({  
    location: '',  
    minBattery: 0,  
    onlyAvailable: true,  
    sortBy: 'distance'  
  });  
  const [selectedScooter, setSelectedScooter] = useState(null);  
  const navigate = useNavigate();  

  useEffect(() => {  
    fetchScooters();  
  }, [filters]);  

  const fetchScooters = async () => {  
    try {  
      setLoading(true);  
      // In a real app, we would send filters to the API  
      const response = await ScooterService.getScooters(filters);  
      setScooters(response.data);  
      setError(null);  
    } catch (err) {  
      console.error('Error fetching scooters:', err);  
      setError('获取滑板车列表失败，请稍后重试。');  
      
      // Mock data for development purposes  
      setScooters([  
        {  
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
          distance: 0.5,  
          imageUrl: '/images/scooter-1.jpg'  
        },  
        {  
          id: 'SC002',  
          model: 'Ninebot Max',  
          batteryLevel: 70,  
          status: 'available',  
          location: '静安寺',  
          coordinates: [31.2335, 121.4483],  
          pricePerHour: 18,  
          pricePerFourHours: 60,  
          pricePerDay: 120,  
          pricePerWeek: 600,  
          distance: 1.2,  
          imageUrl: '/images/scooter-2.jpg'  
        },  
        {  
          id: 'SC003',  
          model: 'Segway ES4',  
          batteryLevel: 45,  
          status: 'available',  
          location: '淮海中路',  
          coordinates: [31.2248, 121.4644],  
          pricePerHour: 20,  
          pricePerFourHours: 70,  
          pricePerDay: 130,  
          pricePerWeek: 650,  
          distance: 1.8,  
          imageUrl: '/images/scooter-3.jpg'  
        },  
        {  
          id: 'SC004',  
          model: 'Xiaomi Essential',  
          batteryLevel: 92,  
          status: 'available',  
          location: '南京东路',  
          coordinates: [31.2364, 121.4783],  
          pricePerHour: 12,  
          pricePerFourHours: 40,  
          pricePerDay: 80,  
          pricePerWeek: 400,  
          distance: 2.1,  
          imageUrl: '/images/scooter-4.jpg'  
        },  
        {  
          id: 'SC005',  
          model: 'Dualtron Eagle',  
          batteryLevel: 65,  
          status: 'in_use',  
          location: '人民广场',  
          coordinates: [31.2303, 121.4703],  
          pricePerHour: 25,  
          pricePerFourHours: 90,  
          pricePerDay: 160,  
          pricePerWeek: 800,  
          distance: 0.3,  
          imageUrl: '/images/scooter-5.jpg'  
        }  
      ]);  
    } finally {  
      setLoading(false);  
    }  
  };  

  const handleFilterChange = (field, value) => {  
    setFilters(prev => ({ ...prev, [field]: value }));  
  };  

  const handleScooterClick = (scooter) => {  
    setSelectedScooter(scooter);  
    navigate(`/scooters/${scooter.id}`);  
  };  

  const handleMapScooterSelect = (scooter) => {  
    setSelectedScooter(scooter);  
  };  

  // Sort scooters based on filter  
  const sortedScooters = [...scooters].sort((a, b) => {  
    switch (filters.sortBy) {  
      case 'distance':  
        return a.distance - b.distance;  
      case 'price':  
        return a.pricePerHour - b.pricePerHour;  
      case 'battery':  
        return b.batteryLevel - a.batteryLevel;  
      default:  
        return 0;  
    }  
  });  

  // Filter available scooters if needed  
  const filteredScooters = filters.onlyAvailable   
    ? sortedScooters.filter(scooter => scooter.status === 'available')   
    : sortedScooters;  

  return (  
    <Container className="scooter-list-container py-5">  
      <h1 className="mb-4">可用滑板车</h1>  
      
      <Row className="mb-4">  
        <Col md={8}>  
          <p className="text-muted">  
            查找附近的电动滑板车，选择最适合您的出行方式  
          </p>  
        </Col>  
        <Col md={4} className="text-end">  
          <Button   
            variant={showMap ? "primary" : "outline-primary"}   
            onClick={() => setShowMap(!showMap)}  
            className="view-toggle-btn"  
          >  
            <FaMapMarkerAlt className="me-2" />  
            {showMap ? "列表视图" : "地图视图"}  
          </Button>  
        </Col>  
      </Row>  
      
      <Row className="mb-4">  
        <Col lg={4} md={6} className="mb-3 mb-md-0">  
          <Form.Group className="search-group">  
            <Form.Control  
              type="text"  
              placeholder="搜索地点..."  
              value={filters.location}  
              onChange={(e) => handleFilterChange('location', e.target.value)}  
              className="search-input"  
            />  
            <FaSearch className="search-icon" />  
          </Form.Group>  
        </Col>  
        
        <Col lg={8} md={6}>  
          <div className="d-flex gap-3 filter-controls">  
            <Form.Group className="flex-grow-1">  
              <Form.Select   
                value={filters.sortBy}  
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}  
              >  
                <option value="distance">按距离排序</option>  
                <option value="price">按价格排序</option>  
                <option value="battery">按电量排序</option>  
              </Form.Select>  
            </Form.Group>  
            
            <Form.Group className="battery-filter d-flex align-items-center">  
              <Form.Label className="me-2 mb-0">最低电量:</Form.Label>  
              <Form.Range  
                min={0}  
                max={100}  
                step={10}  
                value={filters.minBattery}  
                onChange={(e) => handleFilterChange('minBattery', parseInt(e.target.value))}  
                className="me-2"  
              />  
              <span>{filters.minBattery}%</span>  
            </Form.Group>  
            
            <Form.Check  
              type="switch"  
              id="available-switch"  
              label="仅显示可用"  
              checked={filters.onlyAvailable}  
              onChange={(e) => handleFilterChange('onlyAvailable', e.target.checked)}  
              className="available-switch"  
            />  
          </div>  
        </Col>  
      </Row>  
      
      {loading ? (  
        <div className="text-center py-5">  
          <Spinner animation="border" variant="primary" />  
          <p className="mt-3">正在加载滑板车...</p>  
        </div>  
      ) : error ? (  
        <Alert variant="danger">{error}</Alert>  
      ) : (  
        <>  
          {showMap ? (  
            <Card className="map-card">  
              <Card.Body className="p-0">  
                <Map   
                  height="600px"  
                  showAllScooters={true}  
                  onScooterSelect={handleMapScooterSelect}  
                  selectedScooterId={selectedScooter?.id}  
                />  
              </Card.Body>  
            </Card>  
          ) : (  
            <>  
              <div className="scooters-count mb-3">  
                找到 {filteredScooters.length} 个滑板车  
              </div>  
              
              <Row>  
                {filteredScooters.length === 0 ? (  
                  <Col>  
                    <Alert variant="info">  
                      没有找到符合条件的滑板车，请尝试调整筛选条件。  
                    </Alert>  
                  </Col>  
                ) : (  
                  filteredScooters.map(scooter => (  
                    <Col lg={4} md={6} key={scooter.id} className="mb-4">  
                      <ScooterItem   
                        scooter={scooter}   
                        onClick={() => handleScooterClick(scooter)}   
                      />  
                    </Col>  
                  ))  
                )}  
              </Row>  
            </>  
          )}  
        </>  
      )}  
    </Container>  
  );  
};  

export default ScooterList;