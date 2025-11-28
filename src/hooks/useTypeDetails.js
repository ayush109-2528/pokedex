import { useState, useEffect, useCallback } from 'react';

export const useTypeDetails = (typesData) => {
  const [currentTypeData, setCurrentTypeData] = useState(null);
  const [showTypeDetails, setShowTypeDetails] = useState(true);

  const fetchTypeData = useCallback(async (type) => {
    if (typesData[type]) {
      try {
        const res = await fetch(typesData[type]);
        const data = await res.json();
        setCurrentTypeData(data);
        return data;
      } catch (error) {
        console.error('Error fetching type:', error);
      }
    }
    return null;
  }, [typesData]);

  return {
    currentTypeData,
    setCurrentTypeData,
    showTypeDetails,
    setShowTypeDetails,
    fetchTypeData
  };
};
