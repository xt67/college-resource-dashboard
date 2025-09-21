import { toast } from 'react-toastify';

export const notificationService = {
  // Success notifications
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Error notifications
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Info notifications
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Warning notifications
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Booking specific notifications
  bookingConfirmed: (resourceName, dateTime) => {
    toast.success(`✅ Booking confirmed for ${resourceName} on ${dateTime}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  bookingCancelled: (resourceName) => {
    toast.info(`🗑️ Booking for ${resourceName} has been cancelled`, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  bookingConflict: (resourceName, conflictTime) => {
    toast.error(`⚠️ Booking conflict for ${resourceName} at ${conflictTime}. Please choose a different time.`, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  maintenanceScheduled: (resourceName, maintenanceDate) => {
    toast.warning(`🔧 Maintenance scheduled for ${resourceName} on ${maintenanceDate}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

export default notificationService;