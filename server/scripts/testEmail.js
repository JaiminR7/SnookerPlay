import dotenv from 'dotenv';
import { sendTestEmail, testEmailConfig } from '../utils/emailService.js';

dotenv.config();

const testEmail = async () => {
  console.log('🔧 Testing email configuration...');
  
  // Test SMTP configuration
  const configTest = await testEmailConfig();
  if (!configTest) {
    console.log('❌ SMTP configuration failed');
    return;
  }
  
  // Send test email
  console.log('📧 Sending test email...');
  const testResult = await sendTestEmail(process.env.EMAIL_USER);
  
  if (testResult) {
    console.log('✅ Test email sent successfully!');
  } else {
    console.log('❌ Test email failed');
  }
};

testEmail().catch(console.error);
