import 'dotenv/config';
import mongoose from 'mongoose';
import db from '../db.js';

const email = process.argv[2];
const role = process.argv[3];

if (!email || !role) {
    console.log('Usage: node promote.js <email> <role>');
    console.log('Roles: doctor, pharmacist, admin, patient');
    process.exit(1);
}

if (!['doctor', 'pharmacist', 'admin', 'patient'].includes(role)) {
    console.log('Invalid role. Allowed: doctor, pharmacist, admin, patient');
    process.exit(1);
}

async function promote() {
    try {
        await db.connect();
        const User = mongoose.model('User');
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = role;
        await user.save();
        console.log(`✅ Successfully promoted ${user.name} (${email}) to ${role}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

promote();
