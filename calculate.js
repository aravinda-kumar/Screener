const request = require('request');
const screener_url = "https://www.screener.in/api/company/",
      not_found_error = "Not found.";


var calculate_debt_to_equity = function(company){
    net_worth = [];

    share_capital = company.number_set.balancesheet[0][1];

    var key;

    for(key in share_capital){
        net_worth[key] = share_capital[key];
    }

    reserves = company.number_set.balancesheet[1][1];

    for(key in reserves){
        net_worth[key] = net_worth[key] + reserves[key];
    }

    debt = company.number_set.balancesheet[2][1];
    debt_to_equity = {};

    for(key in debt){
        debt_to_equity[key] = debt[key]/net_worth[key];
    }

    var keys = [];

    for(key in debt_to_equity){
        keys.push(key);
    }

    keys.sort();

    for(key of keys){
        console.log(key + ": " + debt_to_equity[key]);
    }

};

/*
    companyName -- Company code.
    done -- Function to call with the response from screener.
*/
var screener_request = function(companyName, done){

    var url = screener_url + companyName;

    var req = {};
    req.url = url;

    request(req, function(err, res, body){
        if(err){
            console.log("Error requesting Screener.");
            console.log(err);
        }
        else{
            var data = JSON.parse(body);
            if(data.detail === not_found_error){
                console.log("Invalid company code, company not found.");
                return;
            }
            done(data);
        }
    });

};

if(process.argv.length < 3){
    console.log("Not enough arguments. Usage \'node calculate.js <Company Code>\'");
    return;
}

// Debt to equity ratio over the years.
screener_request(process.argv[2], calculate_debt_to_equity);
