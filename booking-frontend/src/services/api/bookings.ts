import { MOCK_BOOKINGS } from './mockData';

export const bookingsService = {
  createBooking: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate payment required mock (Person 2's contract)
    const requiresPayment = true; 

    if (requiresPayment) {
      return {
        success: true,
        message: 'Payment required',
        data: {
          payment_required: true,
          payment_order_id: 'order_98765',
          amount: 500,
          currency: 'INR',
        },
        error: null,
      };
    }

    return {
      success: true,
      message: 'Booking confirmed',
      data: {
        booking_id: 'new-b-id',
        status: 'confirmed',
        slot_id: data.slot_id,
        service_id: data.service_id,
        user_id: 'u1',
      },
      error: null,
    };
  },
  getMyBookings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Bookings retrieved successfully',
      data: MOCK_BOOKINGS,
      error: null,
    };
  },
};
