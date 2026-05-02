import { MOCK_SLOTS } from './mockData';

export const slotsService = {
  getSlots: async (service_id: string, date: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Filter by service_id and date in real world
    const filteredSlots = MOCK_SLOTS.filter(s => s.service_id === service_id && s.date === date);

    return {
      success: true,
      message: 'Slots retrieved successfully',
      data: {
        slots: filteredSlots.length > 0 ? filteredSlots : MOCK_SLOTS.filter(s => s.service_id === service_id),
      },
      error: null,
    };
  },
};
