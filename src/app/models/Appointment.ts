import User from './User';
import AppointmentStatus from './AppointmentStatus';

export default interface Appointment {
  id: number;
  bookedDate: string;
  requestingUserId?: string;
  requestingUserFullName?: string;
  requestedUserId?: string;
  requestedUserFullName?: string;
  appointmentStatusId: number;
  appointmentStatusName: string;
}