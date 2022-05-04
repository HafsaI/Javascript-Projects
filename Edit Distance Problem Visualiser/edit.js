
// returns minimum of three parameters
function min(x,y,z)
{
    if (x <= y && x <= z)
            return x;
        if (y <= x && y <= z)
            return y;
        else
            return z;
}
 
// algorithm generating table
// dynamic programming
function editDistDP(str1,str2,m,n)
{

    var myTable = `<table><tr> <th>${""}</th> <th>''</th> `;


    for (i = 0; i < str2.length; i++) {
        myTable += `<th>${str2[i]}</th>`;

    }
    let dp = new Array(m + 1);
    for(let i=0;i<m+1;i++)
    {
        dp[i]=new Array(n+1);
        for(let j=0;j<n+1;j++)
        {
            dp[i][j]=0;
        }
    }

    for (let i = 0; i <= m; i++) {
        if (i == 0){
            myTable += `</tr><th>''</th>`;
        }
        else{
            myTable += `<th>${str1[i - 1]}</th>`;
        }
        for (let j = 0; j <= n; j++) {

            if (i == 0){
                dp[i][j] = j; // Min. operations = j
                myTable += `<td>${dp[i][j]}</td>`;
            }

            else if (j == 0){
                dp[i][j] = i; // Min. operations = i
                myTable += `<td>${dp[i][j]}</td>`;
            }

            else if (str1[i - 1] == str2[j - 1]){
                
                dp[i][j] = dp[i - 1][j - 1];
                myTable += `<td>  <img src="arrow-up-left.svg" alt="up-left"></img> ${ dp[i][j]}</td>`;
            }


            else{
                dp[i][j] = 1
                            + min(dp[i][j - 1], // Insert
                                    dp[i - 1][j], // Remove
                                    dp[i - 1]
                                    [j - 1]); // Replace
                myTable += `<td> ${
                arrow(dp[i][j - 1], 
                dp[i - 1][j],
                dp[i - 1][j - 1])}
                ${dp[i][j]}</td>`;
            }
        }
        if (i == m){
            myTable += "</tr>";
            console.log("Here")
        }
        else{
            myTable += "</tr><tr>";
        }
    }
    myTable += "</table>";

    return myTable;
}
 
function arrow(x, y, z){
    if (x == min(x, y, z))
    return `<img src="arrow-left.svg" alt="left"></img>`
    else if (y == min(x, y, z)){
        return `<img src="arrow-up.svg" alt="up"></img>`
    }
    else{
        return `<img src="arrow-up-left.svg" alt="up-left"></img>`
    }
}


// initialising
let str1 = "there";
let str2 = "dare";
var myTable = editDistDP(str1, str2, str1.length, str2.length);

// function called on button click
function visualise() {
  
    str1 = document.getElementById("string1").value;
    str2 = document.getElementById("string2").value;
    myTable = editDistDP(str1, str2, str1.length, str2.length);
    document.getElementById("container").innerHTML = myTable;
}


document.getElementById("container").innerHTML = myTable;




