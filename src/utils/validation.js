/**  
 * Validation functions for the scooter rental application  
 */  

// Email validation  
export const validateEmail = (email) => {  
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!email) return '请输入邮箱地址';  
    if (!regex.test(email)) return '请输入有效的邮箱地址';  
    return null;  
  };  
  
  // Password validation - at least 8 characters, must contain letters and numbers  
  export const validatePassword = (password) => {  
    if (!password) return '请输入密码';  
    if (password.length < 8) return '密码长度至少为8个字符';  
    if (!/[A-Za-z]/.test(password)) return '密码必须包含字母';  
    if (!/[0-9]/.test(password)) return '密码必须包含数字';  
    return null;  
  };  
  
  // Confirm password validation  
  export const validateConfirmPassword = (password, confirmPassword) => {  
    if (!confirmPassword) return '请确认密码';  
    if (password !== confirmPassword) return '两次输入的密码不一致';  
    return null;  
  };  
  
  // Phone number validation (Chinese format)  
  export const validatePhone = (phone) => {  
    const regex = /^1[3-9]\d{9}$/;  
    if (!phone) return '请输入手机号码';  
    if (!regex.test(phone)) return '请输入有效的手机号码';  
    return null;  
  };  
  
  // Name validation  
  export const validateName = (name) => {  
    if (!name) return '请输入姓名';  
    if (name.length < 2) return '姓名长度至少为2个字符';  
    return null;  
  };  
  
  // ID Card validation (Chinese format)  
  export const validateIdCard = (idCard) => {  
    const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
    if (!idCard) return '请输入身份证号码';  
    if (!regex.test(idCard)) return '请输入有效的身份证号码';  
    return null;  
  };  
  
  // Credit card number validation  
  export const validateCardNumber = (cardNumber) => {  
    // Remove spaces  
    const number = cardNumber.replace(/\s+/g, '');  
    
    if (!number) return '请输入卡号';  
    if (!/^\d{13,19}$/.test(number)) return '请输入有效的卡号';  
    
    // Luhn algorithm for card number validation  
    let sum = 0;  
    let shouldDouble = false;  
    
    // Loop through values starting from the rightmost digit  
    for (let i = number.length - 1; i >= 0; i--) {  
      let digit = parseInt(number.charAt(i));  
      
      if (shouldDouble) {  
        digit *= 2;  
        if (digit > 9) digit -= 9;  
      }  
      
      sum += digit;  
      shouldDouble = !shouldDouble;  
    }  
    
    // If the sum is divisible by 10, the number is valid  
    return (sum % 10) === 0 ? null : '请输入有效的卡号';  
  };  
  
  // Credit card CVV validation  
  export const validateCVV = (cvv) => {  
    if (!cvv) return '请输入安全码';  
    if (!/^\d{3,4}$/.test(cvv)) return '请输入有效的安全码';  
    return null;  
  };  
  
  // Credit card expiry date validation (MM/YY format)  
  export const validateExpiry = (expiry) => {  
    if (!expiry) return '请输入到期日期';  
    
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;  
    if (!regex.test(expiry)) return '请使用MM/YY格式';  
    
    const [month, year] = expiry.split('/');  
    const currentDate = new Date();  
    const currentYear = currentDate.getFullYear() % 100;  
    const currentMonth = currentDate.getMonth() + 1;  
    
    const expiryMonth = parseInt(month, 10);  
    const expiryYear = parseInt(year, 10);  
    
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {  
      return '卡片已过期';  
    }  
    
    return null;  
  };  
  
  // Date validation for future dates  
  export const validateFutureDate = (dateString) => {  
    if (!dateString) return '请选择日期';  
    
    const selectedDate = new Date(dateString);  
    const currentDate = new Date();  
    
    // Remove time part for comparison  
    currentDate.setHours(0, 0, 0, 0);  
    
    if (selectedDate < currentDate) {  
      return '请选择未来的日期';  
    }  
    
    return null;  
  };  
  
  // Rental duration validation (minimum duration)  
  export const validateRentalDuration = (durationInMinutes, minimumDuration = 15) => {  
    if (!durationInMinutes) return '请输入租赁时长';  
    if (isNaN(durationInMinutes)) return '请输入有效的租赁时长';  
    if (durationInMinutes < minimumDuration) {  
      return `最短租赁时间为 ${minimumDuration} 分钟`;  
    }  
    return null;  
  };  
  
  // Validate scooter battery level for rental  
  export const validateBatteryForRental = (batteryLevel, rentalDurationInMinutes) => {  
    // Assume scooter can run for 120 minutes on 100% battery  
    const estimatedRange = batteryLevel * 1.2;  
    
    // Add 15 minute buffer  
    if (estimatedRange < rentalDurationInMinutes + 15) {  
      return '电量不足以完成此次租赁，请选择其他滑板车';  
    }  
    
    return null;  
  };  
  
  // Validate form inputs  
  export const validateForm = (formData, validationRules) => {  
    const errors = {};  
    let isValid = true;  
    
    Object.keys(validationRules).forEach(field => {  
      const value = formData[field];  
      const validationFunction = validationRules[field];  
      
      // If validation function is an array, run all functions  
      if (Array.isArray(validationFunction)) {  
        for (const func of validationFunction) {  
          const error = func(value, formData);  
          if (error) {  
            errors[field] = error;  
            isValid = false;  
            break;  
          }  
        }  
      } else {  
        // Run single validation function  
        const error = validationFunction(value, formData);  
        if (error) {  
          errors[field] = error;  
          isValid = false;  
        }  
      }  
    });  
    
    return { isValid, errors };  
  };