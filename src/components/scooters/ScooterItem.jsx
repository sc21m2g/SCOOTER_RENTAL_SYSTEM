import React from 'react';  
import { Card, Badge, Button, ProgressBar } from 'react-bootstrap';  
import { FaBatteryThreeQuarters, FaMapMarkerAlt, FaClock, FaInfoCircle } from 'react-icons/fa';  
import { useNavigate } from 'react-router-dom';  
import '../../styles/components/ScooterItem.css';  

const ScooterItem = ({ scooter, onClick, showDetailButton = true }) => {  
  const navigate = useNavigate();  
  
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
  
  const formatDistance = (distance) => {  
    if (distance < 1) {  
      return `${(distance * 1000).toFixed(0)}米`;  
    }  
    return `${distance.toFixed(1)}公里`;  
  };  
  
  const handleViewDetails = (e) => {  
    e.stopPropagation();  
    navigate(`/scooters/${scooter.id}`);  
  };  
  
  const handleRentNow = (e) => {  
    e.stopPropagation();  
    navigate(`/scooters/${scooter.id}/rent`);  
  };  

  return (  
    <Card   
      className={`scooter-item ${scooter.status !== 'available' ? 'unavailable' : ''}`}   
      onClick={onClick}  
    >  
      <div className="scooter-image">  
        <img   
          src={scooter.imageUrl || '/images/default-scooter.jpg'}   
          alt={`${scooter.model} 电动滑板车`}   
        />  
        <div className="scooter-status">  
          {getStatusBadge(scooter.status)}  
        </div>  
      </div>  
      
      <Card.Body>  
        <div className="d-flex justify-content-between align-items-start mb-2">  
          <Card.Title className="mb-0">{scooter.model}</Card.Title>  
          <span className="scooter-id">{scooter.id}</span>  
        </div>  
        
        <div className="scooter-location mb-3">  
          <FaMapMarkerAlt className="location-icon" />  
          <span>{scooter.location}</span>  
          {scooter.distance && (  
            <span className="distance">· {formatDistance(scooter.distance)}</span>  
          )}  
        </div>  
        
        <div className="battery-info mb-3">  
          <div className="d-flex justify-content-between align-items-center mb-1">  
            <span className="battery-label">  
              <FaBatteryThreeQuarters className="me-1" /> 电量  
            </span>  
            <span className="battery-percentage">{scooter.batteryLevel}%</span>  
          </div>  
          <ProgressBar   
            variant={getBatteryVariant(scooter.batteryLevel)}   
            now={scooter.batteryLevel}   
          />  
        </div>  
        
        <div className="pricing-info">  
          <div className="d-flex justify-content-between pricing-row">  
            <span className="price-label"><FaClock className="me-1" /> 1小时</span>  
            <span className="price-value">¥{scooter.pricePerHour}</span>  
          </div>  
          <div className="d-flex justify-content-between pricing-row">  
            <span className="price-label"><FaClock className="me-1" /> 4小时</span>  
            <span className="price-value">¥{scooter.pricePerFourHours}</span>  
          </div>  
          <div className="d-flex justify-content-between pricing-row">  
            <span className="price-label"><FaClock className="me-1" /> 1天</span>  
            <span className="price-value">¥{scooter.pricePerDay}</span>  
          </div>  
          <div className="d-flex justify-content-between pricing-row">  
            <span className="price-label"><FaClock className="me-1" /> 1周</span>  
            <span className="price-value">¥{scooter.pricePerWeek}</span>  
          </div>  
        </div>  
      </Card.Body>  
      
      <Card.Footer className="d-flex justify-content-between">  
        {showDetailButton && (  
          <Button   
            variant="outline-primary"   
            size="sm"  
            onClick={handleViewDetails}  
            className="flex-grow-1 me-2"  
          >  
            <FaInfoCircle className="me-1" /> 查看详情  
          </Button>  
        )}  
        
        <Button   
          variant="primary"   
          size="sm"  
          onClick={handleRentNow}  
          className="flex-grow-1"  
          disabled={scooter.status !== 'available'}  
        >  
          {scooter.status === 'available' ? '立即租用' : '不可用'}  
        </Button>  
      </Card.Footer>  
    </Card>  
  );  
};  

export default ScooterItem;