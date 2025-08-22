import React, { useState } from 'react';
import { 
  InfoCircleOutlined, 
  CalculatorOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { calculateSchedulePoints, getPointCalculationDetails } from '../services/pointCalculationService';

/**
 * Component hiển thị thông tin tính điểm cho giao dịch
 */
const PointCalculationDisplay = ({ transaction, lichXeData }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Tính điểm nếu có lịch xe
  const calculatedPoints = lichXeData ? calculateSchedulePoints(lichXeData) : null;
  const pointDetails = lichXeData ? getPointCalculationDetails(lichXeData) : null;
  
  // Nếu không có lịch xe hoặc không có điểm, không hiển thị gì
  if (!lichXeData && !transaction.diem) {
    return null;
  }
  
  // Xác định điểm cuối cùng
  const finalPoints = transaction.diem || calculatedPoints;
  
  // Xác định trạng thái điểm
  const getPointStatus = () => {
    if (finalPoints === 'manual') {
      return {
        icon: <ExclamationCircleOutlined className="text-orange-500" />,
        text: 'Tính thủ công',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }
    
    if (finalPoints === 0) {
      return {
        icon: <InfoCircleOutlined className="text-gray-500" />,
        text: 'Không tính điểm',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    }
    
    return {
      icon: <CheckCircleOutlined className="text-green-500" />,
      text: `${finalPoints} điểm`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  };
  
  const pointStatus = getPointStatus();
  
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-800 flex items-center">
          <CalculatorOutlined className="mr-2" />
          Thông tin tính điểm
        </h4>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          <QuestionCircleOutlined className="mr-1" />
          {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </button>
      </div>
      
      {/* Hiển thị điểm chính */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {pointStatus.icon}
          <span className={`font-semibold ${pointStatus.color}`}>
            {pointStatus.text}
          </span>
        </div>
        
        {/* Badge trạng thái */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${pointStatus.bgColor} ${pointStatus.color} ${pointStatus.borderColor}`}>
          {pointStatus.text}
        </span>
      </div>
      
      {/* Chi tiết tính điểm */}
      {showDetails && pointDetails && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Loại xe:</span>
                <p className="font-medium text-blue-700">
                  {pointDetails.vehicleType} chỗ
                </p>
              </div>
              <div>
                <span className="text-gray-600">Giá vé:</span>
                <p className="font-medium text-blue-700">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(pointDetails.price)}
                </p>
              </div>
            </div>
            
            <div>
              <span className="text-gray-600">Loại tuyến:</span>
              <p className="font-medium text-blue-700">
                {getRouteTypeLabel(pointDetails.routeType)}
              </p>
            </div>
            
            <div>
              <span className="text-gray-600">Phương pháp tính:</span>
              <p className="font-medium text-blue-700">
                {pointDetails.calculationMethod}
              </p>
            </div>
            
            {pointDetails.notes.length > 0 && (
              <div>
                <span className="text-gray-600">Ghi chú:</span>
                <ul className="mt-1 space-y-1">
                  {pointDetails.notes.map((note, index) => (
                    <li key={index} className="text-blue-700 text-sm flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Thông tin khung giờ nếu có */}
            {lichXeData?.thoi_gian_bat_dau_don && (
              <div>
                <span className="text-gray-600">Khung giờ:</span>
                <p className="font-medium text-blue-700">
                  {getTimeRangeLabel(lichXeData.thoi_gian_bat_dau_don)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Thông tin điểm từ giao dịch */}
      {transaction.diem && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="text-sm">
            <span className="text-gray-600">Điểm đã được tính:</span>
            <p className="font-medium text-green-700">
              {transaction.diem} điểm
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Điểm này đã được tính sẵn trong hệ thống
            </p>
          </div>
        </div>
      )}
      
      {/* Cảnh báo nếu cần tính thủ công */}
      {finalPoints === 'manual' && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationCircleOutlined className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">Cần tính điểm thủ công</p>
              <p className="text-xs mt-1">
                Lịch này có giá cao hoặc là xe đặc biệt (16, 29, 45 chỗ). 
                Vui lòng liên hệ admin để được hỗ trợ tính điểm.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
function getRouteTypeLabel(routeType) {
  const labels = {
    'don_san_bay': 'Đón từ sân bay',
    'tien_san_bay': 'Tiễn đến sân bay',
    'tinh_huyen': 'Lịch tỉnh/huyện',
    'pho': 'Lịch phố'
  };
  return labels[routeType] || 'Không xác định';
}

function getTimeRangeLabel(time) {
  const hour = new Date(time).getHours();
  
  if (hour >= 5 && hour < 12) return '5h00 - 11h59 (Sáng)';
  if (hour >= 12 && hour < 5) return '12h00 - 4h59 (Đêm)';
  if (hour >= 0 && hour < 9) return '00h - 8h59 (Đêm)';
  if (hour >= 9 && hour < 24) return '9h00 - 23h59 (Ngày)';
  
  return 'Không xác định';
}

export default PointCalculationDisplay;
