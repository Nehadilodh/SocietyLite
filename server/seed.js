const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Notice = require('./models/Notice');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected for Seeding...');

        // Clear existing Users and Notices
        await User.deleteMany();
        await Notice.deleteMany();

        // Create Default Users
        const salt = await bcrypt.genSalt(10);

        const adminPassword = await bcrypt.hash('admin123', salt);
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@society.com',
            password: adminPassword,
            role: 'admin',
            phone: '1234567890'
        });

        const guardPassword = await bcrypt.hash('guard123', salt);
        const guardUser = new User({
            name: 'Guard',
            email: 'guard@society.com',
            password: guardPassword,
            role: 'guard',
            phone: '0987654321'
        });

        const residentPassword = await bcrypt.hash('resident123', salt);
        const residentUser = new User({
            name: 'Resident',
            email: 'resident@society.com',
            password: residentPassword,
            role: 'resident',
            flatNo: 'A-101',
            phone: '1122334455'
        });

        await adminUser.save();
        await guardUser.save();
        await residentUser.save();
        console.log('Users seeded');

        // Create Default Notices
        const notice1 = new Notice({
            title: 'Monthly Society Meeting',
            description: 'Please attend the monthly meeting at the clubhouse.',
            type: 'meeting',
            priority: 'Normal',
            createdBy: adminUser._id
        });

        const notice2 = new Notice({
            title: 'Water Supply Interruption',
            description: 'Water supply will be interrupted tomorrow from 10 AM to 2 PM.',
            type: 'general',
            priority: 'Urgent',
            createdBy: adminUser._id
        });

        await notice1.save();
        await notice2.save();
        console.log('Notices seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
