// src/services/RazorpayService.ts
import RazorpayCheckout from 'react-native-razorpay';
import Config from 'react-native-config';

export interface PaymentOptions {
  email: string;
  contact: string;
  name: string;
  amount: string; 
  description?: string;
  themeColor?: string;
}

class RazorpayService {
  static async initiatePayment(options: PaymentOptions): Promise<any> {
    const RAZORPAY_KEY = Config.RAZORPAY_KEY || '';

    if (!RAZORPAY_KEY || RAZORPAY_KEY.trim() === '') {
      throw new Error('MISSING_API_KEY');
    }

    const razorpayOptions = {
      description: options.description || 'My Gason Premium Membership',
      image: 'https://your-app-logo-url.png',
      currency: 'INR',
      key: RAZORPAY_KEY,
      amount: options.amount,
      name: 'My Gason',
      prefill: {
        email: options.email,
        contact: options.contact,
        name: options.name,
      },
      theme: {
        color: options.themeColor || '#00C26F',
        hide_topbar: false,
      },
    };

    return await RazorpayCheckout.open(razorpayOptions);
  }
}

export default RazorpayService;