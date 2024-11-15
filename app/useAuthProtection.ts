import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuthProtection = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      router.push('/login-page');
    }
  }, [router]);
};
