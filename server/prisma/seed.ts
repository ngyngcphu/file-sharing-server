import { hashSync } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const user = {
    username: 'filesharingp2p',
    password: '123456789',
    fullName: 'Baby Panther'
};

async function generateSampleData() {
    const hashPassword = hashSync(user.password, SALT_ROUNDS);
    const sampleUser = await prisma.user.create({
        data: {
            username: user.username,
            password: hashPassword,
            fullName: user.fullName
        }
    });
    console.log(sampleUser);
    process.exit(0);
}

generateSampleData();
