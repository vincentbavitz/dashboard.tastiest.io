export enum LocalEndpoint {
  GET_RESTAURANT_DATA = '/api/getRestaurantData',

  GET_BOOKINGS = '/api/getBookings',
  GET_BALANCE = '/api/getBalance',
  UPDATE_BOOKING = '/api/updateBooking',

  // Metrics
  GET_QUIET_TIMES = '/api/getQuietTimes',
  SET_QUIET_TIMES = '/api/setQuietTimes',
  GET_BOOKING_SLOTS = '/api/getBookingSlots',
  SET_BOOKING_SLOTS = '/api/setBookingSlots',

  // Emails
  GET_EMAIL_TEMPLATES = '/api/getEmailTemplates',
  SAVE_EMAIL_TEMPLATE = '/api/saveEmailTemplate',
  DELETE_EMAIL_TEMPLATE = '/api/deleteEmailTemplate',
}
