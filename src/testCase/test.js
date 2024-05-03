const request = require('supertest');
const app = require('./app');

describe('GET /contracts/:id', () => {
    it('should return a contract belonging to the calling profile', async () => {
        const response = await request(app)
            .get('/contracts/1')
            .set('profile_id', '1')
            .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('terms');
    });

    it('should return a 404 error if the contract does not exist', async () => {
        const response = await request(app)
            .get('/contracts/999')
            .set('profile_id', '1')
            .expect(404);

        expect(response.body.error).toBe("Contract not found");
    });
});

describe('GET /contracts', () => {
    it('should return a list of active contracts belonging to the calling profile', async () => {
        const response = await request(app)
            .get('/contracts')
            .set('profile_id', '1')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('POST /jobs/:job_id/pay', () => {
    it('should pay for a job if the client has sufficient balance', async () => {
        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Payment successful');
    });

    it('should return a 400 error if the client has insufficient balance', async () => {
        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(400);

        expect(response.body.error).toBe("Insufficient balance");
    });
});

describe('POST /balances/deposit/:userId', () => {
    it('should deposit money into the client\'s balance if within the limit', async () => {
        const response = await request(app)
            .post('/balances/deposit/1')
            .set('profile_id', '1')
            .send({ amount: 100 })
            .expect(200);

        expect(response.body).toHaveProperty('balance', 150);
    });

    it('should return a 400 error if the deposit exceeds the limit', async () => {
        const response = await request(app)
            .post('/balances/deposit/1')
            .set('profile_id', '1')
            .send({ amount: 1000 })
            .expect(400);

        expect(response.body.error).toBe("Deposit amount exceeds maximum allowed");
    });
});

describe('GET /admin/best-profession', () => {
    it('should return the profession that earned the most money within the specified time range', async () => {
        // Assuming valid start and end dates in the query parameters
        const response = await request(app)
            .get('/admin/best-profession')
            .query({ start: '2020-01-01', end: '2020-12-31' })
            .expect(200);

        // Validate response structure and data
        expect(response.body).toHaveProperty('bestProfession');
        expect(response.body).toHaveProperty('earnings');
    });
});

describe('GET /admin/best-clients', () => {
    it('should return the top clients within the specified time range', async () => {
        // Assuming valid start and end dates in the query parameters
        const response = await request(app)
            .get('/admin/best-clients')
            .query({ start: '2020-01-01', end: '2020-12-31' })
            .expect(200);

        // Validate response structure and data
        expect(Array.isArray(response.body)).toBe(true);
    });
});
