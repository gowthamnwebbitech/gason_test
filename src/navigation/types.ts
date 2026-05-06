export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
};

// 1. Screens for Authentication
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
  Success: undefined;
  ProductDetail: { product: Product };
};

// 2. Screens inside the Bottom Tab Bar
export type AppTabsParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  Services: undefined;
  Profile: undefined;
};

// 3. The Main App Stack (Holds the Tabs + Full-screen overlays like ProductDetail)
export type AppStackParamList = {
  MainTabs: undefined;
  ProductDetail: { product: Product };
  Checkout: undefined;
  Survey: undefined;
  Emergency: undefined;
  Delivery: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Orders: undefined;
  Addresses: undefined;
  Payments: undefined;
  Notifications: undefined;
  Security: undefined;
  Support: undefined;
  Success: undefined;
};
