const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '../data/blockchain_state.json');

const getBlockchainState = () => {
    try {
        if (!fs.existsSync(STATE_FILE)) {
            return { verified_users: {} };
        }
        const data = fs.readFileSync(STATE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading blockchain state:', error);
        return { verified_users: {} };
    }
};

const saveBlockchainState = (state) => {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving blockchain state:', error);
        return false;
    }
};

/**
 * Checks if a user is verified on the simulated blockchain.
 */
const isUserVerified = (userId) => {
    const state = getBlockchainState();
    return !!state.verified_users[userId];
};

/**
 * Simulates the verifyAlumnus smart contract call.
 */
const verifyUser = (userId, certificateHash) => {
    const state = getBlockchainState();
    state.verified_users[userId] = {
        verified: true,
        hash: certificateHash,
        timestamp: new Date().toISOString()
    };
    return saveBlockchainState(state);
};

module.exports = {
    isUserVerified,
    verifyUser
};
