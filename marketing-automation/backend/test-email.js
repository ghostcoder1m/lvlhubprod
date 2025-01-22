require('dotenv').config();
const Mailgun = require('mailgun.js');
const formData = require('form-data');

async function setupCustomDomain() {
  try {
    console.log('Checking Custom Domain Setup...\n');
    
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
      url: 'https://api.mailgun.net'
    });

    // List all domains to check if custom domain exists
    const domains = await mg.domains.list();
    console.log('Current Domains:');
    domains.items.forEach(domain => {
      console.log(`- ${domain.name} (${domain.state})`);
    });

    console.log('\nTo enable unrestricted email sending:');
    console.log('1. Purchase a custom domain if you don\'t have one');
    console.log('2. Go to Mailgun dashboard -> Domains -> Add New Domain');
    console.log('3. Enter your custom domain (e.g., mail.yourdomain.com)');
    console.log('4. Add these DNS records to your domain:');

    try {
      // Try to get custom domain info if it exists
      const domainInfo = await mg.domains.get(process.env.MAILGUN_DOMAIN);
      
      console.log('\nDNS Records needed:');
      console.log('-------------------');
      
      // Show TXT Records
      const txtRecords = domainInfo.domain.sending_dns_records.filter(r => r.record_type === 'TXT');
      console.log('\nTXT Records:');
      txtRecords.forEach(record => {
        console.log(`\nName: ${record.name}`);
        console.log(`Value: ${record.value}`);
        console.log(`Status: ${record.valid === 'valid' ? '✓ Verified' : '✗ Not Verified'}`);
      });

      // Show MX Records
      const mxRecords = domainInfo.domain.sending_dns_records.filter(r => r.record_type === 'MX');
      console.log('\nMX Records:');
      mxRecords.forEach(record => {
        console.log(`\nName: ${record.name}`);
        console.log(`Value: ${record.value}`);
        console.log(`Status: ${record.valid === 'valid' ? '✓ Verified' : '✗ Not Verified'}`);
      });

      // Show CNAME Records
      const cnameRecords = domainInfo.domain.sending_dns_records.filter(r => r.record_type === 'CNAME');
      console.log('\nCNAME Records:');
      cnameRecords.forEach(record => {
        console.log(`\nName: ${record.name}`);
        console.log(`Value: ${record.value}`);
        console.log(`Status: ${record.valid === 'valid' ? '✓ Verified' : '✗ Not Verified'}`);
      });

      console.log('\nDomain Status:', domainInfo.domain.state);
      if (domainInfo.domain.state === 'active') {
        console.log('✓ Domain is verified and active');
        console.log('\nNext steps:');
        console.log('1. Update your .env file with:');
        console.log(`MAILGUN_DOMAIN=your-custom-domain`);
        console.log(`MAILGUN_SENDER_EMAIL=noreply@your-custom-domain`);
      } else {
        console.log('✗ Domain is not fully verified');
        console.log('\nPlease:');
        console.log('1. Add all DNS records shown above to your domain');
        console.log('2. Wait up to 24-48 hours for DNS propagation');
        console.log('3. Run this script again to check verification status');
      }

    } catch (error) {
      if (error.status === 404) {
        console.log('\nNo custom domain found.');
        console.log('Please add your custom domain in Mailgun dashboard first.');
      } else {
        console.error('\nError checking domain:', error.message);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupCustomDomain(); 