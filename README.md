# Technical test

### How to launch
* `npm install && npm run start`

### Info
This is test app for company home excersise.
Made from scratch without any help of starter packs.

### Excersise description
Create a simple micro-lending web application, where client can choose amount and term for the loan to apply. Similar to one of our existing products.
 
Requirements
User can apply for loan, on a homepage visitor is shown with a form:
* text field to enter amount: limited to up 400 euro
* text field with date: limited to up 30 days from today (may be provided by some calendar picker or just use plain number of days)
* text showing the amount he’ll need to pay back on desired date - recalculated dynamically as amount or date change using 10% fixed rate
* submit button to save applied load to application state / browser storage
 
Application should perform risk assessment based on following rules:
Risk is considered too high if:
* the attempt to take loan is made faster than 30 seconds from page load with max possible amount
* reached max applications (e.g. 3) per 1 minute from a browser session
If the risk is high, user should be displayed a popup with the “We’re sorry” message
Otherwise - display the status of loan application and update the table with loans history  
 
Client should be able to extend a loan. Loan term gets extended for one week, interest gets increased by a factor of 1.5.
 
The whole history of loans is visible for clients, including loan extensions.
 
* Backend - not required, but may use for persistence any api like self-hosted or firebase etc. - Frontend - React.js required, Flux is optional, but welcome to use
* Code is covered with unit tests is a plus
* Acceptance tests for the happy path scenario is a big plus
 
What gets evaluated
* Requirements
* Code quality
* How simple is to run and/or deploy application       
