import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { checkValidateToken } from './services/apiService';

export const useAuthProtection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('accessToken');
      if (!token || !(await checkValidateToken(token))) {
        router.push('/login-page');
      } else {
        setIsLoading(false); 
      }
    };

    checkAuth();
  }, [router]);

  return isLoading; 
};
