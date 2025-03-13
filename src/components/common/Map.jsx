import React, { useState, useEffect, useRef } from 'react';  
import { Button, Spinner, Badge, Offcanvas, Form } from 'react-bootstrap';  
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';  
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css';  
import { FaLocationArrow, FaFlagCheckered, FaFilter, FaBatteryThreeQuarters, FaTimesCircle, FaParking, FaWalking } from 'react-icons/fa';  
import { useNavigate } from 'react-router-dom';  
import ScooterService from '../../services/scooter.service';  
import './Map.css';  

// Fix Leaflet icon issue  
delete L.Icon.Default.prototype._getIconUrl;  
L.Icon.Default.mergeOptions({  
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',  
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',  
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',  
});  

// Custom marker icons  
const scooterIcon = new L.Icon({  
  iconUrl: '/images/scooter-marker.png',  
  iconSize: [32, 32],  
  iconAnchor: [16, 32],  
  popupAnchor: [0, -32]  
});  

// Component to recenter map on user location  
const FlyToUserLocation = ({ position, zoom }) => {  
  const map = useMap();  
  
  useEffect(() => {  
    if (position) {  
      map.flyTo(position, zoom);  
    }  
  }, [map, position, zoom]);  
  
  return null;  
};  

const Map = ({   
  width = '100%',   
  height = '500px',   
  center = [31.2304, 121.4737], // Default Shanghai center  
  zoom = 14,  
  showControls = true,  
  onScooterSelect,  
  selectedScooterId = null,  
  showAllScooters = true  
}) => {  
  const [scooters, setScooters] = useState([]);  
  const [userLocation, setUserLocation] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [showFilters, setShowFilters] = useState(false);  
  const [filters, setFilters] = useState({  
    minBattery: 0,  
    maxDistance: 2000, // in meters  
    onlyAvailable: true  
  });  
  const [selectedMarker, setSelectedMarker] = useState(null);  
  const mapRef = useRef(null);  
  const navigate = useNavigate();  
  
  // Get user's location  
  useEffect(() => {  
    if (navigator.geolocation) {  
      navigator.geolocation.getCurrentPosition(  
        (position) => {  
          const { latitude, longitude } = position.coords;  
          setUserLocation([latitude, longitude]);  
        },  
        (err) => {  
          console.error('Error getting location:', err);  
          setError('无法获取您的位置，请确保已授予定位权限。');  
        }  
      );  
    } else {  
      setError('您的浏览器不支持地理定位功能。');  
    }  
  }, []);  
  
  // Fetch scooters data  
  useEffect(() => {  
    const fetchScooters = async () => {  
      try {  
        setLoading(true);  
        // In a real app, we would send user location and filters to the API  
        const response = await ScooterService.getNearbyScooters(userLocation, filters);  
        setScooters(response.data);  
        setError(null);  
      } catch (err) {  
        console.error('Error fetching scooters:', err);  
        setError('获取附近车辆信息失败，请稍后重试。');  
        // For demo purposes, let's add some mock scooters  
        setScooters([  
          {  
            id: 'SC-1001',  
            location: [31.2304, 121.4737],  
            batteryLevel: 85,  
            status: 'available',  
            model: 'Xiaomi Pro 2',  
            pricePerMinute: 1.5,  
            distance: 120 // meters  
          },  
          {  
            id: 'SC-1002',  
            location: [31.2334, 121.4697],  
            batteryLevel: 62,  
            status: 'available',  
            model: 'Ninebot Max',  
            pricePerMinute: 1.8,  
            distance: 450 // meters  
          },  
          {  
            id: 'SC-1003',  
            location: [31.2284, 121.4777],  
            batteryLevel: 29,  
            status: 'available',  
            model: 'Xiaomi Essential',  
            pricePerMinute: 1.2,  
            distance: 380 // meters  
          },  
          {  
            id: 'SC-1004',  
            location: [31.2324, 121.4817],  
            batteryLevel: 92,  
            status: 'in_use',  
            model: 'Segway Ninebot ES4',  
            pricePerMinute: 2.0,  
            distance: 670 // meters  
          }  
        ]);  
      } finally {  
        setLoading(false);  
      }  
    };  

    if (showAllScooters && (userLocation || !navigator.geolocation)) {  
      fetchScooters();  
    }  
  }, [userLocation, filters, showAllScooters]);  
  
  // Apply filters  
  const filteredScooters = scooters.filter(scooter => {  
    if (filters.onlyAvailable && scooter.status !== 'available') return false;  
    if (scooter.batteryLevel < filters.minBattery) return false;  
    if (userLocation && scooter.distance > filters.maxDistance) return false;  
    return true;  
  });  
  
  // Handle scooter selection  
  useEffect(() => {  
    if (selectedScooterId) {  
      const scooter = scooters.find(s => s.id === selectedScooterId);  
      if (scooter) {  
        setSelectedMarker(scooter);  
        if (mapRef.current) {  
          mapRef.current.flyTo(scooter.location, 18);  
        }  
      }  
    }  
  }, [selectedScooterId, scooters]);  

  // Handle marker click  
  const handleMarkerClick = (scooter) => {  
    setSelectedMarker(scooter);  
    if (onScooterSelect) {  
      onScooterSelect(scooter);  
    }  
  };  
  
  // Status badge renderer  
  const renderStatusBadge = (status) => {  
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
        return <Badge bg="light" text="dark">{status}</Badge>;  
    }  
  };  
  
  // Battery level color  
  const getBatteryColor = (level) => {  
    if (level >= 70) return 'success';  
    if (level >= 30) return 'warning';  
    return 'danger';  
  };  
  
  // Handle filter changes  
  const handleFilterChange = (field, value) => {  
    setFilters(prev => ({ ...prev, [field]: value }));  
  };  

  // Handle "Rent this scooter" button click  
  const handleRentClick = (scooterId) => {  
    navigate(`/scooters/${scooterId}/rent`);  
  };  
  
  return (  
    <div className="map-container" style={{ width, height, position: 'relative' }}>  
      {loading && (  
        <div className="map-loading-overlay">  
          <Spinner animation="border" variant="primary" />  
          <p className="mt-2">加载中...</p>  
        </div>  
      )}  
      
      {error && (  
        <div className="map-error-overlay">  
          <FaTimesCircle size={32} className="text-danger mb-2" />  
          <p>{error}</p>  
        </div>  
      )}  
      
      <MapContainer   
        center={userLocation || center}   
        zoom={zoom}   
        style={{ width: '100%', height: '100%' }}  
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}  
      >  
        <TileLayer  
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
        />  
        
        {/* User location marker */}  
        {userLocation && (  
          <>  
            <Marker position={userLocation}>  
              <Popup>  
                <div className="text-center">  
                  <strong>您的位置</strong>  
                </div>  
              </Popup>  
            </Marker>  
            <Circle   
              center={userLocation}   
              radius={filters.maxDistance}   
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}  
            />  
          </>  
        )}  
        
        {/* Scooter markers */}  
        {filteredScooters.map(scooter => (  
          <Marker   
            key={scooter.id}   
            position={scooter.location}  
            icon={scooterIcon}  
            eventHandlers={{  
              click: () => handleMarkerClick(scooter)  
            }}  
          >  
            <Popup>  
              <div className="scooter-popup">  
                <h6 className="d-flex justify-content-between align-items-center">  
                  {scooter.id}  
                  {renderStatusBadge(scooter.status)}  
                </h6>  
                
                <div className="scooter-details">  
                  <div className="detail-item">  
                    <span className="label">型号:</span>  
                    <span className="value">{scooter.model}</span>  
                  </div>  
                  
                  <div className="detail-item">  
                    <span className="label">电量:</span>  
                    <div className="battery-indicator">  
                      <FaBatteryThreeQuarters className={`text-${getBatteryColor(scooter.batteryLevel)}`} />  
                      <span className="ms-1">{scooter.batteryLevel}%</span>  
                    </div>  
                  </div>  
                  
                  <div className="detail-item">  
                    <span className="label">费率:</span>  
                    <span className="value">¥{scooter.pricePerMinute}/分钟</span>  
                  </div>  
                  
                  {userLocation && (  
                    <div className="detail-item">  
                      <span className="label">距离:</span>  
                      <span className="value">  
                        <FaWalking className="me-1" />  
                        {scooter.distance < 1000   
                          ? `${scooter.distance}米`   
                          : `${(scooter.distance / 1000).toFixed(1)}公里`}  
                      </span>  
                    </div>  
                  )}  
                </div>  
                
                {scooter.status === 'available' && (  
                  <Button   
                    variant="success"   
                    className="w-100 mt-2"  
                    onClick={() => handleRentClick(scooter.id)}  
                  >  
                    <FaFlagCheckered className="me-1" /> 租用此车  
                  </Button>  
                )}  
              </div>  
            </Popup>  
          </Marker>  
        ))}  
        
        {/* Auto center on user location */}  
        {userLocation && <FlyToUserLocation position={userLocation} zoom={15} />}  
      </MapContainer>  
      
      {/* Map controls */}  
      {showControls && (  
        <div className="map-controls">  
          <Button   
            variant="light"   
            className="control-btn"   
            onClick={() => userLocation && mapRef.current.flyTo(userLocation, 16)}  
            disabled={!userLocation}  
            title="定位到我的位置"  
          >  
            <FaLocationArrow />  
          </Button>  
          
          <Button   
            variant="light"   
            className="control-btn"  
            onClick={() => setShowFilters(true)}  
            title="筛选车辆"  
          >  
            <FaFilter />  
          </Button>  
          
          <Button   
            variant="light"   
            className="control-btn"  
            title="查找停车区"  
          >  
            <FaParking />  
          </Button>  
        </div>  
      )}  
      
      {/* Scooter count summary */}  
      <div className="scooter-count">  
        <Badge bg="primary" className="px-3 py-2">  
          附近可用车辆: {filteredScooters.filter(s => s.status === 'available').length}  
        </Badge>  
      </div>  
      
      {/* Filters offcanvas */}  
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">  
        <Offcanvas.Header closeButton>  
          <Offcanvas.Title>筛选车辆</Offcanvas.Title>  
        </Offcanvas.Header>  
        <Offcanvas.Body>  
          <Form>  
            <Form.Group className="mb-4">  
              <Form.Label>最低电量: {filters.minBattery}%</Form.Label>  
              <Form.Range   
                min={0}   
                max={100}   
                step={5}  
                value={filters.minBattery}  
                onChange={(e) => handleFilterChange('minBattery', parseInt(e.target.value))}  
              />  
              <div className="d-flex justify-content-between">  
                <span className="text-muted small">0%</span>  
                <span className="text-muted small">50%</span>  
                <span className="text-muted small">100%</span>  
              </div>  
            </Form.Group>  
            
            <Form.Group className="mb-4">  
              <Form.Label>最大距离: {filters.maxDistance < 1000 ? `${filters.maxDistance}米` : `${filters.maxDistance/1000}公里`}</Form.Label>  
              <Form.Range   
                min={100}   
                max={5000}   
                step={100}  
                value={filters.maxDistance}  
                onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}  
              />  
              <div className="d-flex justify-content-between">  
                <span className="text-muted small">100米</span>  
                <span className="text-muted small">2.5公里</span>  
                <span className="text-muted small">5公里</span>  
              </div>  
            </Form.Group>  
            
            <Form.Check   
              type="switch"  
              id="available-switch"  
              label="只显示可用车辆"  
              checked={filters.onlyAvailable}  
              onChange={(e) => handleFilterChange('onlyAvailable', e.target.checked)}  
              className="mb-4"  
            />  
            
            <div className="d-grid gap-2">  
              <Button   
                variant="outline-secondary"   
                onClick={() => setFilters({  
                  minBattery: 0,  
                  maxDistance: 2000,  
                  onlyAvailable: true  
                })}  
              >  
                重置筛选条件  
              </Button>  
              <Button   
                variant="primary"   
                onClick={() => setShowFilters(false)}  
              >  
                应用筛选条件  
              </Button>  
            </div>  
          </Form>  
        </Offcanvas.Body>  
      </Offcanvas>  
    </div>  
  );  
};  

export default Map;