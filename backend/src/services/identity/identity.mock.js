const verify = async (fullName, tcNo) => {
    // Professional Mock: Simulating a 500ms API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[MOCK SERVICE] Verifying: ${fullName}`);
            resolve({ success: true, status: 'VERIFIED_MOCK' });
        }, 500);
    });
};

module.exports = { verify };