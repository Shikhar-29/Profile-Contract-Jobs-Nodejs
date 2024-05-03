const { Op, sequelize } = require('sequelize');
const { Job, Profile, Contract } = require('../model');

exports.getBestProfession = async (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const jobs = await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [{
            model: Contract,
            include: [{
                model: Profile,
                as: 'Contractor',
                attributes: ['profession']
            }]
        }]
    });

    const professionEarningsMap = new Map();
    jobs.forEach(job => {
        const profession = job.Contract.Contractor.profession;
        const earnings = job.price;
        if (!professionEarningsMap.has(profession)) {
            professionEarningsMap.set(profession, earnings);
        } else {
            professionEarningsMap.set(profession, professionEarningsMap.get(profession) + earnings);
        }
    });

    let bestProfession = null;
    let maxEarnings = 0;
    for (const [profession, earnings] of professionEarningsMap) {
        if (earnings > maxEarnings) {
            maxEarnings = earnings;
            bestProfession = profession;
        }
    }

    return { bestProfession, earnings: maxEarnings };
};

exports.getBestClients = async (start, end, limit = 2) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const jobs = await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [{
            model: Contract,
            include: [{
                model: Profile,
                as: 'Client'
            }]
        }]
    });

    const clientPaymentsMap = new Map();
    jobs.forEach(job => {
        const client = job.Contract.Client;
        const payment = job.price;
        if (!clientPaymentsMap.has(client.id)) {
            clientPaymentsMap.set(client.id, payment);
        } else {
            clientPaymentsMap.set(client.id, clientPaymentsMap.get(client.id) + payment);
        }
    });

    const sortedClients = Array.from(clientPaymentsMap.entries()).sort((a, b) => b[1] - a[1]);
    const topClients = sortedClients.slice(0, limit);

    const clientDetails = await Promise.all(topClients.map(async ([clientId, payment]) => {
        const client = await Profile.findByPk(clientId);
        return { id: clientId, firstName: client.firstName, lastName: client.lastName, payment };
    }));

    return clientDetails;
};
