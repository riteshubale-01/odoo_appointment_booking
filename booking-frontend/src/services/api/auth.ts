import { useAuthStore } from '@/store/useAuthStore';

export const authService = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response matching Person 1's contract
    return {
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token',
        user: {
          user_id: 'u1',
          name: 'John Doe',
          email: email,
          role: 'customer',
        },
      },
      error: null,
    };
  },
  signup: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Signup successful. Please verify OTP.',
      data: { user_id: 'u1' },
      error: null,
    };
  },
  verifyOtp: async (email: string, otp: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'OTP verified successfully',
      data: null,
      error: null,
    };
  },
};
