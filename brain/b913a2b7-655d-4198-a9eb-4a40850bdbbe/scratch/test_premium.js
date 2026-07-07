const http = require('http');

const request = (method, path, token, data) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            rawData: body
          });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

(async () => {
  try {
    console.log('1. Logging in via Google Mock Login...');
    const loginRes = await request('POST', '/api/auth/google', null, { token: 'mock-google-token' });
    const token = loginRes.data.data.token;
    const userId = loginRes.data.data._id;
    console.log(`   Logged in! User ID: ${userId}`);

    console.log('\n2. Updating email to whitelisted admin email...');
    const updateEmailRes = await request('PUT', '/api/auth/profile', token, { 
      name: 'Google Test Candidate', 
      email: 'karuppuduraikece@gmail.com'
    });
    console.log('   Status Code:', updateEmailRes.statusCode);
    console.log('   User Email:', updateEmailRes.data?.data?.email);

    console.log('\n3. Requesting PREMIUM Access...');
    const requestPremiumRes = await request('POST', '/api/auth/premium-request', token);
    console.log('   Status Code:', requestPremiumRes.statusCode);
    console.log('   Response message:', requestPremiumRes.data?.message);
    console.log('   Updated User Premium Status:', requestPremiumRes.data?.data?.premiumStatus);
    if (requestPremiumRes.data?.data?.premiumStatus !== 'requested') {
      throw new Error('Premium request failed to update status to "requested"');
    }

    console.log('\n4. Elevating self to ADMIN to process the request...');
    const promoteAdminRes = await request('PUT', '/api/auth/profile', token, { 
      name: 'Google Test Candidate', 
      email: 'karuppuduraikece@gmail.com', 
      role: 'admin' 
    });
    console.log('   Status Code:', promoteAdminRes.statusCode);
    console.log('   User Role:', promoteAdminRes.data?.data?.role);

    console.log('\n5. Approving user premium request via ADMIN API...');
    const approveRes = await request('PUT', `/api/admin/users/${userId}`, token, {
      name: 'Google Test Candidate',
      email: 'karuppuduraikece@gmail.com',
      role: 'user', // demote back to user but with approved premium status
      premiumStatus: 'approved'
    });
    console.log('   Status Code:', approveRes.statusCode);
    console.log('   Approved User Premium Status:', approveRes.data?.data?.premiumStatus);
    console.log('   Approved User Role:', approveRes.data?.data?.role);
    if (approveRes.data?.data?.premiumStatus !== 'approved') {
      throw new Error('Admin approval failed');
    }

    console.log('\n6. Fetching own profile to verify premium status persistence...');
    const profileRes = await request('GET', '/api/auth/profile', token);
    console.log('   User Premium Status:', profileRes.data?.data?.premiumStatus);
    if (profileRes.data?.data?.premiumStatus !== 'approved') {
      throw new Error('Premium status check failed');
    }

    console.log('\n>>> ALL PREMIUM REQUEST AND APPROVAL API TESTS PASSED SUCCESSFULLY! <<<');
  } catch (err) {
    console.error('\n❌ Premium testing failed:', err.message);
  }
})();
