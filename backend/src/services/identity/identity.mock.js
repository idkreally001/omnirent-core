// C:\Users\Islam\Desktop\Development\OMNIRENT\omnirent-core\backend\src\services\identity\identity.mock.js

const verify = async (fullName, tcNo) => {
    // Simulating API delay for realism
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[IDENTITY SERVICE] Verifying mathematically: ${fullName} with TC: ${tcNo}`);

            if (!tcNo || tcNo.length !== 11 || isNaN(tcNo)) {
                return resolve({ 
                    success: false, 
                    message: "Invalid TC Number format. Must be 11 numeric digits." 
                });
            }

            if (tcNo[0] === '0') {
                return resolve({ 
                    success: false, 
                    message: "Invalid TC Number. Official records show this number cannot start with zero." 
                });
            }

            const digits = tcNo.split('').map(Number);
            
            // Validation Algorithm Part 1 (10th digit check)
            const sumOdds = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
            const sumEvens = digits[1] + digits[3] + digits[5] + digits[7];
            
            const calcDigit10 = ((sumOdds * 7) - sumEvens) % 10;
            if (calcDigit10 !== digits[9]) {
                return resolve({
                    success: false,
                    message: "Identity Algorithm Mismatch. The TC number provided is cryptographically invalid (Digit 10 fail)."
                });
            }

            // Validation Algorithm Part 2 (11th digit check)
            const sumFirst10 = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
            const calcDigit11 = sumFirst10 % 10;

            if (calcDigit11 !== digits[10]) {
                return resolve({
                    success: false,
                    message: "Identity Algorithm Mismatch. The TC number provided is cryptographically invalid (Digit 11 fail)."
                });
            }

            // If it passes all math rules, we accept it
            resolve({ 
                success: true, 
                status: 'VERIFIED_MATHEMATICAL',
                provider: 'OmniRent Math Algorithm'
            });
        }, 800); // 800ms to feel realistic
    });
};

module.exports = { verify };