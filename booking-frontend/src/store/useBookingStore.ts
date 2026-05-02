import { create } from 'zustand';

interface Slot {
  slot_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_capacity: number;
  total_capacity: number;
  status: string;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  description: string;
  price: number;
}

interface BookingState {
  selectedService: Service | null;
  selectedSlot: Slot | null;
  setSelectedService: (service: Service | null) => void;
  setSelectedSlot: (slot: Slot | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedService: null,
  selectedSlot: null,
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  resetBooking: () => set({ selectedService: null, selectedSlot: null }),
}));
