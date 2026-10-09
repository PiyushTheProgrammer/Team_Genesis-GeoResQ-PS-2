export const formatNumber = (val: number, decimals: number = 2): string => {
  if (val === undefined || val === null || isNaN(val)) return 'Not available';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCoordinate = (lat: number, lng: number): string => {
  if (lat === undefined || lng === undefined) return 'Not available';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
};

export const formatConfidence = (score: number): string => {
  if (score === undefined || score === null) return 'Not available';
  return `${Math.round(score * 100)}%`;
};

export const formatCategoryName = (category: string): string => {
  switch (category) {
    case 'flooded_area':
      return 'Flooded Area';
    case 'damaged_building':
      return 'Damaged Building';
    case 'road_affected':
      return 'Road Affected';
    case 'vehicle':
      return 'Vehicle';
    case 'other_asset':
      return 'Other Asset';
    default:
      return category.replace(/_/g, ' ');
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'flooded_area':
      return '#2B5B84';
    case 'damaged_building':
      return '#A64B4B';
    case 'road_affected':
      return '#C88A2B';
    case 'vehicle':
      return '#5B8A68';
    case 'other_asset':
      return '#64748B';
    default:
      return '#64748B';
  }
};

export const getSeverityBadgeStyle = (severity: string): { bg: string; text: string; border: string } => {
  switch (severity) {
    case 'high':
      return { bg: '#FDF2F2', text: '#A64B4B', border: '#F5C6C6' };
    case 'medium':
      return { bg: '#FEFCE8', text: '#C88A2B', border: '#FDE047' };
    case 'low':
      return { bg: '#F0FDF4', text: '#5B8A68', border: '#BBF7D0' };
    default:
      return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
  }
};

export const getStatusBadgeStyle = (status: string): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'completed':
      return { bg: '#EBF4EE', text: '#173F35', border: '#C2DEC9' };
    case 'processing':
      return { bg: '#EFF6FF', text: '#2B5B84', border: '#BFDBFE' };
    case 'failed':
      return { bg: '#FDF2F2', text: '#A64B4B', border: '#F5C6C6' };
    case 'queued':
      return { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' };
    default:
      return { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' };
  }
};
