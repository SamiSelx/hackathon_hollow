function isEmailValid(email: string): boolean {
     const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return emailRegex.test(email);
   }
   interface PasswordStrengthConditions {
    hasLower: boolean;
    hasUpper: boolean;
    hasDigit: boolean;
    hasSpecial: boolean;
    minimumLength: boolean;
  }
  
  function checkPasswordStrength(password: string): string {
    const conditions: PasswordStrengthConditions = {
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?`~]/.test(password),
      minimumLength: password.length >= 8, // You can adjust the minimum length requirement
    };
  
    const unmetConditions: string[] = [];
  
    // Use for...in loop to iterate over object properties
    for (const [condition, value] of Object.entries(conditions)) {
      if (!value) {
        unmetConditions.push(condition.replace(/([A-Z])/g, ' $1')); // Makes condition names more readable
      }
    }
  
    if (unmetConditions.length === 0) {
      return 'Strong password!';
    } else {
      return `Password is weak: Missing ${unmetConditions.join(', ')}`;
    }
  }
  
export {isEmailValid,checkPasswordStrength}
   