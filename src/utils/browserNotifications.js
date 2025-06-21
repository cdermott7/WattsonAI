// Browser notification utility for Wattson AI
// Handles desktop notifications for critical events and system updates

export class BrowserNotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.notificationQueue = [];
    this.activeNotifications = new Map();
    
    // Initialize notification icons
    this.icons = {
      critical: '/favicon.ico', // Replace with actual icon path
      warning: '/favicon.ico',
      success: '/favicon.ico',
      info: '/favicon.ico'
    };
  }

  // Request notification permission from user
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Browser notifications are not supported');
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      throw new Error('Notification permission previously denied. Please enable in browser settings.');
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    
    return permission === 'granted';
  }

  // Check if notifications are available and permitted
  isAvailable() {
    return this.isSupported && this.permission === 'granted';
  }

  // Create and show a notification
  async showNotification(options) {
    try {
      // Ensure we have permission
      if (!this.isAvailable()) {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
          console.warn('Browser notifications not available - permission denied');
          return null;
        }
      }

      const {
        title,
        message,
        type = 'info',
        duration = 8000,
        requireInteraction = false,
        actions = [],
        data = {},
        onClick = null,
        onClose = null
      } = options;

      // Create notification options
      const notificationOptions = {
        body: message,
        icon: this.icons[type] || this.icons.info,
        badge: this.icons[type] || this.icons.info,
        tag: `wattson-${type}-${Date.now()}`,
        requireInteraction: requireInteraction || type === 'critical',
        silent: false,
        timestamp: Date.now(),
        data: {
          ...data,
          type,
          timestamp: Date.now()
        }
      };

      // Add actions if supported
      if (actions.length > 0 && 'serviceWorker' in navigator) {
        notificationOptions.actions = actions.map(action => ({
          action: action.id,
          title: action.title,
          icon: action.icon || this.icons.info
        }));
      }

      // Create the notification
      const notification = new Notification(title, notificationOptions);
      
      // Store reference to active notification
      this.activeNotifications.set(notification.tag, notification);

      // Set up event listeners
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus(); // Focus the window
        if (onClick) onClick(event);
        notification.close();
      };

      notification.onclose = (event) => {
        this.activeNotifications.delete(notification.tag);
        if (onClose) onClose(event);
      };

      notification.onerror = (event) => {
        console.error('Notification error:', event);
        this.activeNotifications.delete(notification.tag);
      };

      // Auto-close after duration (unless requireInteraction is true)
      if (!requireInteraction && duration > 0) {
        setTimeout(() => {
          if (this.activeNotifications.has(notification.tag)) {
            notification.close();
          }
        }, duration);
      }

      return notification;

    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  // Show critical alert notification
  async showCriticalAlert(alertData) {
    return await this.showNotification({
      title: `🚨 Critical Alert: ${alertData.title}`,
      message: `${alertData.message} (Confidence: ${alertData.confidence}%)`,
      type: 'critical',
      requireInteraction: true,
      duration: 0, // Never auto-close
      actions: [
        { id: 'view', title: 'View Dashboard' },
        { id: 'dismiss', title: 'Dismiss' }
      ],
      data: { alertData },
      onClick: () => {
        // Focus window and navigate to appropriate section
        window.focus();
        // In a real app, you'd navigate to the alerts section
      }
    });
  }

  // Show system optimization notification
  async showOptimizationUpdate(optimizationData) {
    return await this.showNotification({
      title: `⚡ Optimization Complete: ${optimizationData.action}`,
      message: `${optimizationData.title} - Revenue Impact: ${optimizationData.revenueImpact}`,
      type: 'success',
      duration: 6000,
      actions: [
        { id: 'view', title: 'View Results' },
        { id: 'dismiss', title: 'OK' }
      ],
      data: { optimizationData },
      onClick: () => {
        window.focus();
      }
    });
  }

  // Show profit milestone notification
  async showProfitMilestone(milestoneData) {
    return await this.showNotification({
      title: `💰 Profit Milestone Reached!`,
      message: `${milestoneData.description} - Total: $${milestoneData.amount.toLocaleString()}`,
      type: 'success',
      duration: 8000,
      actions: [
        { id: 'report', title: 'View Report' },
        { id: 'share', title: 'Share' }
      ],
      data: { milestoneData },
      onClick: () => {
        window.focus();
      }
    });
  }

  // Show energy opportunity notification
  async showEnergyOpportunity(opportunityData) {
    return await this.showNotification({
      title: `⚡ Energy Arbitrage Opportunity`,
      message: `${opportunityData.description} - Potential: ${opportunityData.potential}`,
      type: 'warning',
      duration: 10000,
      requireInteraction: true,
      actions: [
        { id: 'execute', title: 'Execute' },
        { id: 'analyze', title: 'Analyze' },
        { id: 'dismiss', title: 'Dismiss' }
      ],
      data: { opportunityData },
      onClick: () => {
        window.focus();
      }
    });
  }

  // Show system status notification
  async showSystemStatus(statusData) {
    const isHealthy = statusData.status === 'healthy';
    return await this.showNotification({
      title: `🖥️ System Status: ${statusData.status.toUpperCase()}`,
      message: `${statusData.message} - Efficiency: ${statusData.efficiency}%`,
      type: isHealthy ? 'success' : 'warning',
      duration: isHealthy ? 5000 : 12000,
      requireInteraction: !isHealthy,
      data: { statusData },
      onClick: () => {
        window.focus();
      }
    });
  }

  // Show market alert notification
  async showMarketAlert(marketData) {
    return await this.showNotification({
      title: `📈 Market Alert: ${marketData.type}`,
      message: `${marketData.description} - Impact: ${marketData.impact}`,
      type: marketData.severity || 'info',
      duration: 8000,
      actions: [
        { id: 'analyze', title: 'Analyze' },
        { id: 'execute', title: 'Execute Strategy' }
      ],
      data: { marketData },
      onClick: () => {
        window.focus();
      }
    });
  }

  // Batch notification for multiple events
  async showBatchNotification(events) {
    if (events.length === 1) {
      return await this.showNotification(events[0]);
    }

    return await this.showNotification({
      title: `📊 Multiple Updates (${events.length})`,
      message: `${events.length} system events require attention. Click to review.`,
      type: 'info',
      duration: 10000,
      actions: [
        { id: 'review', title: 'Review All' },
        { id: 'dismiss', title: 'Dismiss' }
      ],
      data: { events },
      onClick: () => {
        window.focus();
      }
    });
  }

  // Close specific notification
  closeNotification(tag) {
    const notification = this.activeNotifications.get(tag);
    if (notification) {
      notification.close();
    }
  }

  // Close all active notifications
  closeAllNotifications() {
    this.activeNotifications.forEach(notification => {
      notification.close();
    });
    this.activeNotifications.clear();
  }

  // Get notification statistics
  getStats() {
    return {
      isSupported: this.isSupported,
      permission: this.permission,
      activeCount: this.activeNotifications.size,
      queuedCount: this.notificationQueue.length
    };
  }

  // Test notification system
  async testNotification() {
    return await this.showNotification({
      title: '🧪 Notification Test',
      message: 'Browser notifications are working correctly for Wattson AI!',
      type: 'success',
      duration: 5000,
      onClick: () => {
        console.log('Test notification clicked');
      }
    });
  }
}

// Create singleton instance
export const browserNotificationService = new BrowserNotificationService();

// Export default
export default browserNotificationService;