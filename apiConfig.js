const API_BASE_URL = 'http://172.20.10.2:3000';

export const API_URLS = {
  registerUser: `${API_BASE_URL}/api/users/register`,
  loginUser: `${API_BASE_URL}/api/users/login`,
  sendOrder: `${API_BASE_URL}/api/orders`,
  getUserHistory: `${API_BASE_URL}/api/user`,
  getDriverOrders: `${API_BASE_URL}/api/driver`,
  updateOrderStatus: `${API_BASE_URL}/api/edit-orders`,
  getDriverHistory: `${API_BASE_URL}/api/driver-history`,
  updateArrivalStatus: `${API_BASE_URL}/api/orders-arrival`,
};
