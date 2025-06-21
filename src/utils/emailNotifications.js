// Email notification templates and mock email service for Wattson AI
// In production, this would integrate with SendGrid, Mailgun, or similar services

export class EmailNotificationService {
  constructor() {
    this.templates = {
      criticalAlert: {
        subject: '🚨 Critical Alert: {alertTitle}',
        template: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f0f0f; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #f59e0b); padding: 30px; border-radius: 16px 16px 0 0; text-align: center; }
        .content { background: #1a1a1a; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #333; }
        .alert-critical { color: #ef4444; font-weight: bold; }
        .alert-warning { color: #f59e0b; font-weight: bold; }
        .alert-info { color: #10b981; font-weight: bold; }
        .metrics { background: #0a0a0a; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #333; }
        .button { display: inline-block; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; color: white;">🧠 Wattson AI Alert</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9);">Critical System Notification</p>
        </div>
        <div class="content">
            <h2 class="alert-{severity}">{alertTitle}</h2>
            <p>{alertMessage}</p>
            
            <div class="metrics">
                <h3>📊 Current Metrics</h3>
                <p><strong>Confidence Level:</strong> {confidence}%</p>
                <p><strong>Timestamp:</strong> {timestamp}</p>
                <p><strong>Affected Systems:</strong> {affectedSystems}</p>
            </div>
            
            <p><strong>Recommended Action:</strong> {recommendedAction}</p>
            
            <a href="{dashboardUrl}" class="button">View Dashboard →</a>
        </div>
        <div class="footer">
            <p>This is an automated message from Wattson AI. For support, contact your system administrator.</p>
        </div>
    </div>
</body>
</html>`
      },

      profitReport: {
        subject: '💰 Weekly Profit Report - {dateRange}',
        template: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f0f0f; color: #ffffff; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 30px; border-radius: 16px 16px 0 0; text-align: center; }
        .content { background: #1a1a1a; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #333; }
        .revenue-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .revenue-card { background: #0a0a0a; padding: 20px; border-radius: 12px; border: 1px solid #333; text-align: center; }
        .profit-positive { color: #10b981; }
        .profit-negative { color: #ef4444; }
        .highlight { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1)); padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; }
        .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; color: white;">💰 Profit Report</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9);">{dateRange}</p>
        </div>
        <div class="content">
            <div class="highlight">
                <h2 style="margin: 0 0 10px 0;">Total Revenue: <span class="profit-positive">$\{totalRevenue}</span></h2>
                <p style="margin: 0;">Profit Margin: \{profitMargin}% | Growth: +\{growthRate}%</p>
            </div>
            
            <div class="revenue-grid">
                <div class="revenue-card">
                    <h3 style="color: #3b82f6;">Mining Operations</h3>
                    <p class="profit-positive">$\{miningRevenue}</p>
                    <small>\{miningPercentage}% of total</small>
                </div>
                <div class="revenue-card">
                    <h3 style="color: #10b981;">AI Inference</h3>
                    <p class="profit-positive">$\{inferenceRevenue}</p>
                    <small>\{inferencePercentage}% of total</small>
                </div>
                <div class="revenue-card">
                    <h3 style="color: #f59e0b;">Energy Arbitrage</h3>
                    <p class="profit-positive">$\{arbitrageRevenue}</p>
                    <small>\{arbitragePercentage}% of total</small>
                </div>
            </div>
            
            <h3>📈 Key Performance Metrics</h3>
            <ul>
                <li><strong>EBITDA:</strong> $\{ebitda} (\{ebitdaMargin}% margin)</li>
                <li><strong>ROI:</strong> \{roi}% annualized</li>
                <li><strong>Power Usage Effectiveness:</strong> \{pue}</li>
                <li><strong>Fleet Efficiency:</strong> \{fleetEfficiency}%</li>
            </ul>
            
            <h3>🏢 Top Performing Facilities</h3>
            \{facilitiesTable}
            
            <a href="\{reportUrl}" class="button">View Full Report →</a>
        </div>
        <div class="footer">
            <p>Generated by Wattson AI | Confidential Business Information</p>
        </div>
    </div>
</body>
</html>`
      },

      systemOptimization: {
        subject: '⚡ System Optimization Complete - {action}',
        template: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f0f0f; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 16px 16px 0 0; text-align: center; }
        .content { background: #1a1a1a; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #333; }
        .success-badge { background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        .impact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .impact-card { background: #0a0a0a; padding: 15px; border-radius: 12px; border: 1px solid #333; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; color: white;">⚡ Optimization Complete</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9);">System Enhancement Notification</p>
        </div>
        <div class="content">
            <div class="success-badge">✅ {action} Completed Successfully</div>
            
            <h2>{optimizationTitle}</h2>
            <p>{optimizationDescription}</p>
            
            <h3>📊 Performance Impact</h3>
            <div class="impact-grid">
                <div class="impact-card">
                    <h4 style="color: #10b981;">Revenue Impact</h4>
                    <p><strong>{revenueImpact}</strong></p>
                </div>
                <div class="impact-card">
                    <h4 style="color: #f59e0b;">Efficiency Gain</h4>
                    <p><strong>{efficiencyImpact}</strong></p>
                </div>
                <div class="impact-card">
                    <h4 style="color: #06b6d4;">Carbon Reduction</h4>
                    <p><strong>{carbonImpact}</strong></p>
                </div>
            </div>
            
            <h3>🎯 Next Recommendations</h3>
            <ul>
                {nextRecommendations}
            </ul>
            
            <a href="{dashboardUrl}" class="button">Monitor Progress →</a>
        </div>
        <div class="footer">
            <p>Automated optimization by Wattson AI | {timestamp}</p>
        </div>
    </div>
</body>
</html>`
      }
    };
  }

  // Mock email sending function - in production would integrate with email service
  async sendEmail(templateType, recipientEmail, templateData) {
    try {
      const template = this.templates[templateType];
      if (!template) {
        throw new Error(`Template ${templateType} not found`);
      }

      // Simulate email processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Replace template variables
      let emailContent = template.template;
      let emailSubject = template.subject;

      Object.entries(templateData).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        emailContent = emailContent.replace(regex, value);
        emailSubject = emailSubject.replace(regex, value);
      });

      // Mock successful email send
      console.log('📧 Email sent successfully:', {
        to: recipientEmail,
        subject: emailSubject,
        template: templateType,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        recipient: recipientEmail,
        subject: emailSubject
      };

    } catch (error) {
      console.error('Email send failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Send critical alert email
  async sendCriticalAlert(alertData, recipients = ['admin@company.com', 'ops@company.com']) {
    const templateData = {
      alertTitle: alertData.title,
      alertMessage: alertData.message,
      severity: alertData.severity || 'critical',
      confidence: alertData.confidence || 95,
      timestamp: new Date().toLocaleString(),
      affectedSystems: alertData.affectedSystems || 'Mining Fleet, Energy Systems',
      recommendedAction: alertData.recommendedAction || 'Review dashboard and execute recommended optimizations',
      dashboardUrl: 'https://mara-wattson.ai/dashboard'
    };

    const results = [];
    for (const recipient of recipients) {
      const result = await this.sendEmail('criticalAlert', recipient, templateData);
      results.push(result);
    }

    return results;
  }

  // Send profit report email
  async sendProfitReport(reportData, recipients = ['finance@company.com', 'executives@company.com']) {
    const templateData = {
      dateRange: reportData.dateRange || 'Last 7 Days',
      totalRevenue: reportData.totalRevenue?.toLocaleString() || '459,100',
      profitMargin: reportData.profitMargin || '68.4',
      growthRate: reportData.growthRate || '12.8',
      miningRevenue: reportData.miningRevenue?.toLocaleString() || '308,440',
      miningPercentage: reportData.miningPercentage || '67.2',
      inferenceRevenue: reportData.inferenceRevenue?.toLocaleString() || '127,680',
      inferencePercentage: reportData.inferencePercentage || '27.8',
      arbitrageRevenue: reportData.arbitrageRevenue?.toLocaleString() || '22,980',
      arbitragePercentage: reportData.arbitragePercentage || '5.0',
      ebitda: reportData.ebitda?.toLocaleString() || '312,847',
      ebitdaMargin: reportData.ebitdaMargin || '68.1',
      roi: reportData.roi || '127',
      pue: reportData.pue || '1.09',
      fleetEfficiency: reportData.fleetEfficiency || '96.7',
      facilitiesTable: this.generateFacilitiesTable(reportData.facilities),
      reportUrl: 'https://mara-wattson.ai/reports/profit'
    };

    const results = [];
    for (const recipient of recipients) {
      const result = await this.sendEmail('profitReport', recipient, templateData);
      results.push(result);
    }

    return results;
  }

  // Send system optimization email
  async sendOptimizationUpdate(optimizationData, recipients = ['ops@company.com']) {
    const templateData = {
      action: optimizationData.action,
      optimizationTitle: optimizationData.title,
      optimizationDescription: optimizationData.description,
      revenueImpact: optimizationData.revenueImpact || '+$2,450/hour',
      efficiencyImpact: optimizationData.efficiencyImpact || '+3.2%',
      carbonImpact: optimizationData.carbonImpact || '-1.2 tCO2e',
      nextRecommendations: this.formatRecommendations(optimizationData.nextRecommendations),
      timestamp: new Date().toLocaleString(),
      dashboardUrl: 'https://mara-wattson.ai/dashboard'
    };

    const results = [];
    for (const recipient of recipients) {
      const result = await this.sendEmail('systemOptimization', recipient, templateData);
      results.push(result);
    }

    return results;
  }

  // Helper function to generate facilities table HTML
  generateFacilitiesTable(facilities) {
    if (!facilities || facilities.length === 0) {
      return '<p>No facility data available</p>';
    }

    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">';
    tableHtml += '<tr style="background: #0a0a0a;"><th style="padding: 10px; border: 1px solid #333;">Facility</th><th style="padding: 10px; border: 1px solid #333;">Revenue</th><th style="padding: 10px; border: 1px solid #333;">Efficiency</th></tr>';
    
    facilities.forEach(facility => {
      tableHtml += `<tr><td style="padding: 10px; border: 1px solid #333;">${facility.name}</td><td style="padding: 10px; border: 1px solid #333; color: #10b981;">$${facility.revenue?.toLocaleString()}</td><td style="padding: 10px; border: 1px solid #333;">${facility.efficiency}%</td></tr>`;
    });
    
    tableHtml += '</table>';
    return tableHtml;
  }

  // Helper function to format recommendations list
  formatRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return '<li>Continue monitoring current optimizations</li>';
    }

    return recommendations.map(rec => `<li>${rec}</li>`).join('');
  }
}

// Create singleton instance
export const emailService = new EmailNotificationService();

// Export default
export default emailService;