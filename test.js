// current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();
let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;
// prints date & time in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);