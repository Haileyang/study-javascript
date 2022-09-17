/*
 * @param {number} x
 * @return {boolean}
 */

/* ** Given Question **
    Given an integer x, return true if x is palindrome integer.
    An integer is a palindrome when it reads the same backward as forward.
*/

/* ** Given Example **
   Input: x = 121
   Output: true
   Explanation: 121 reads as 121 from left to right and from right to left.
*/

/* ** Given Function **
    var isPalindrome = function(x) {};
*/

/* ** Solution 01 **
    1) convert x from number to string 
    2) make a function with for loop reversed the order
*/

var isPalindrome = function(x) {
    x = x + ''
    let reverseX 

    for(let i=x.length-1; i >= 0; i--){
        reverseX = x[i]
    }

    if(x == reverseX){
        return true
    }else{
        return false
    } 
};

/* Test */
isPalindrome(121)
isPalindrome(-121)
isPalindrome(10)