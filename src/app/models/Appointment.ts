import User from './User';
import AppointmentStatus from './AppointmentStatus';

export default interface Appointment {
  id?: number;
  bookedDate: string;
  requestingUserId: string;
  requestingUser: User;
  requestedUserId: string;
  requestedUser: User;
  appointmentStatusId: number;
  appointmentStatus: AppointmentStatus;
}