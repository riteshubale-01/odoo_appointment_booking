export const MOCK_SERVICES = [
  {
    id: 's1',
    name: 'Consultation',
    duration_minutes: 30,
    description: 'General professional consultation',
    price: 500,
  },
  {
    id: 's2',
    name: 'Therapy Session',
    duration_minutes: 60,
    description: 'Individual counseling session',
    price: 1500,
  },
  {
    id: 's3',
    name: 'Career Coaching',
    duration_minutes: 45,
    description: 'Career path guidance and resume review',
    price: 1000,
  },
];

export const MOCK_SLOTS = [
  {
    slot_id: 'slot1',
    service_id: 's1',
    date: '2026-05-02',
    start_time: '10:00',
    end_time: '10:30',
    available_capacity: 2,
    total_capacity: 3,
    status: 'available',
  },
  {
    slot_id: 'slot2',
    service_id: 's1',
    date: '2026-05-02',
    start_time: '11:00',
    end_time: '11:30',
    available_capacity: 0,
    total_capacity: 3,
    status: 'full',
  },
  {
    slot_id: 'slot3',
    service_id: 's2',
    date: '2026-05-02',
    start_time: '14:00',
    end_time: '15:00',
    available_capacity: 1,
    total_capacity: 1,
    status: 'available',
  },
];

export const MOCK_BOOKINGS = [
  {
    booking_id: 'b1',
    status: 'confirmed',
    slot_id: 'slot1',
    service_id: 's1',
    user_id: 'u1',
    date: '2026-05-02',
    service_name: 'Consultation',
    time: '10:00 - 10:30',
  },
];
