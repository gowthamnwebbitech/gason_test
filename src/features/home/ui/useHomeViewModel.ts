import { useEffect, useState, useCallback, useMemo } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchHomeData } from '../store/homeThunks';
import RazorpayService from '@/services/RazorpayService';
import { colors } from '@/theme';
import { Product } from '../store/homeTypes';

export const useHomeViewModel = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { data, isLoading, isRefreshing } = useAppSelector(state => state.home);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeData(false));
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    try {
      await dispatch(fetchHomeData(true)).unwrap();
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    }
  }, [dispatch]);

  // ==========================================
  // SUBSCRIPTION & CARD LOGIC
  // ==========================================
  const subscriptionData = data?.user;

  const displayPrice = useMemo(() => {
    return subscriptionData?.subscription_cost || '499';
  }, [subscriptionData?.subscription_cost]);

  const hasValidSubscription = useMemo(() => {
    if (!subscriptionData || subscriptionData.subscription_status === 0) {
      return false; // User has not paid yet
    }

    if (subscriptionData.subscription_end_date) {
      const endDate = new Date(subscriptionData.subscription_end_date);
      const today = new Date();
      return endDate >= today; 
    }
    return true; 
  }, [subscriptionData]);

  const isRenewal = subscriptionData?.subscription_status === 1 && !hasValidSubscription;

  // ==========================================
  // PAYMENT HANDLER
  // ==========================================
  const handleRazorpayPayment = async () => {
    if (isPaymentProcessing) return;
    setIsPaymentProcessing(true);

    const validContact = user?.phone && user.phone.length >= 10 ? user.phone : '9999999999';
    const razorpayAmountInPaise = (parseFloat(displayPrice) * 100).toString();

    try {
      const paymentData = await RazorpayService.initiatePayment({
        email: user?.email || 'guest@mygason.com',
        contact: validContact,
        name: user?.name || 'My Gason Member',
        amount: razorpayAmountInPaise, 
        themeColor: colors.primary,
        description: isRenewal ? 'My Gason Premium Renewal' : 'My Gason Premium Membership',
      });

      console.log('Razorpay Success:', paymentData);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Alert.alert('Success', `Successfully ${isRenewal ? 'Renewed' : 'Subscribed to'} My Gason Premium!`);
      
      await dispatch(fetchHomeData(true)).unwrap();
      
    } catch (error: any) {
      console.error('Razorpay Error:', error);
      if (error.message === 'MISSING_API_KEY') {
        Alert.alert('Setup Required', 'Razorpay API key is missing. Please check your .env file.');
      } else if (error.code) {
        Alert.alert(`Payment Error (${error.code})`, error.description || 'Payment was not completed.');
      } else {
        Alert.alert('Notice', 'Payment process was cancelled.');
      }
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const featuredProducts: Product[] = useMemo(() => {
    if (data?.distributor_products && data.distributor_products.length > 0) {
      return data.distributor_products.map(dp => ({
        ...dp.product,
        id: dp.id, 
        price: dp.actual_amount,
      }));
    }
    return data?.featured_products || [];
  }, [data?.distributor_products, data?.featured_products]);

  return {
    user,
    data,
    subscriptionData, // Passed directly to the View now
    isLoading,
    isRefreshing,
    hasValidSubscription,
    isRenewal,
    displayPrice,
    featuredProducts,
    onRefresh,
    handleRazorpayPayment,
  };
};