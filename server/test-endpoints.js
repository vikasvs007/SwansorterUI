// Test script for all endpoints
const BASE_URL = 'http://localhost:5001/client';

// Test function to make HTTP requests
async function makeRequest(url, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(`${method} ${url}:`, response.status, data);
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error in ${method} ${url}:`, error.message);
    }
}

async function testAllEndpoints() {
    console.log('Testing all endpoints...\n');

    // Test Products endpoints
    console.log('=== Testing Products Endpoints ===');
    const product = await makeRequest(`${BASE_URL}/products`, 'POST', {
        name: "Test Product",
        price: 99.99,
        description: "Test description",
        category: "Test Category",
        rating: 4.5,
        supply: 100
    });
    
    await makeRequest(`${BASE_URL}/products`);
    
    if (product?.data?._id) {
        await makeRequest(`${BASE_URL}/products/${product.data._id}`, 'PUT', {
            name: "Updated Product",
            price: 149.99
        });
        
        await makeRequest(`${BASE_URL}/products/${product.data._id}`, 'DELETE');
    }

    // Test Customers endpoints
    console.log('\n=== Testing Customers Endpoints ===');
    const customer = await makeRequest(`${BASE_URL}/customers`, 'POST', {
        name: "Test Customer",
        email: `test${Date.now()}@example.com`,
        password: "testpass123",
        city: "Test City",
        state: "Test State",
        country: "US",
        occupation: "Developer",
        phoneNumber: "1234567890",
        role: "user"
    });
    
    await makeRequest(`${BASE_URL}/customers`);
    
    if (customer?.data?._id) {
        await makeRequest(`${BASE_URL}/customers/${customer.data._id}`, 'PUT', {
            name: "Updated Customer",
            city: "Updated City"
        });
        
        await makeRequest(`${BASE_URL}/customers/${customer.data._id}`, 'DELETE');
    }

    // Test Transactions endpoints
    console.log('\n=== Testing Transactions Endpoints ===');
    const transaction = await makeRequest(`${BASE_URL}/transactions`, 'POST', {
        userId: "63701cc1f03239c72c00017f",
        cost: 99.99,
        products: ["63701d24f03239c72c000181"]
    });
    
    await makeRequest(`${BASE_URL}/transactions`);
    
    if (transaction?.data?._id) {
        await makeRequest(`${BASE_URL}/transactions/${transaction.data._id}`, 'PUT', {
            cost: 149.99
        });
        
        await makeRequest(`${BASE_URL}/transactions/${transaction.data._id}`, 'DELETE');
    }

    // Test Geography endpoints
    console.log('\n=== Testing Geography Endpoints ===');
    await makeRequest(`${BASE_URL}/geography`);
    
    const geoUser = await makeRequest(`${BASE_URL}/geography`, 'POST', {
        country: "GB"
    });
    
    if (geoUser?.data?.length > 0) {
        await makeRequest(`${BASE_URL}/geography`, 'PUT', {
            userId: "63701cc1f03239c72c00017f",
            country: "FR"
        });
    }

    console.log('\nAll endpoint tests completed!');
}

// Run the tests
testAllEndpoints().catch(console.error);
