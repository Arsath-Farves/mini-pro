const { verifyUser } = require('../server/services/blockchainAdapter');
const crypto = require('crypto');

const userId = process.argv[2];

if (!userId) {
    console.error('Usage: node verify_alumnus.js <USER_ID>');
    process.exit(1);
}

// Generate a mock certificate hash
const certificateHash = crypto.createHash('sha256').update(`DEGREE_CERT_${userId}`).digest('hex');

console.log(`🔗 Minting verification for user: ${userId}...`);
const success = verifyUser(userId, certificateHash);

if (success) {
    console.log('✅ Success! Alumnus verified on TrustSetu Smart Contract.');
    console.log(`📜 Hash: 0x${certificateHash}`);
} else {
    console.log('❌ Failed to verify alumnus.');
}
