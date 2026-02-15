// C:\Users\Islam\Desktop\Development\OMNIRENT\omnirent-core\backend\src\services\identity\identity.mock.js

const verify = async (fullName, tcNo) => {
    // Professional Mock: Simulating a 500ms API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[MOCK SERVICE] Verifying: ${fullName} with TC: ${tcNo}`);

            // Logic: Let's make it fail if the TC starts with "0" (common validation rule)
            // or if it's a specific "test failure" number.
            if (tcNo.startsWith('0')) {
                return resolve({ 
                    success: false, 
                    message: "Invalid TC Number. Official records show this number cannot start with zero." 
                });
            }

            // Default success for any other 11-digit number
            resolve({ 
                success: true, 
                status: 'VERIFIED_MOCK',
                provider: 'OmniRent Mock KPS'
            });
        }, 500);
    });
};

module.exports = { verify };