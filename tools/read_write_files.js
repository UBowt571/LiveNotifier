const fs = require('fs');

let account_details = JSON.parse(fs.readFileSync('params/twitter_accounts.json'));

// let student = { 
//   name: 'Mike',
//   age: 23, 
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda' 
// };

// let data = JSON.stringify(student);
// fs.writeFileSync('student-2.json', data);