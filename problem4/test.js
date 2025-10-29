// Approach 1: Iterative loop
// Time Complexity: O(n) - we iterate from 1 to n
// Space Complexity: O(1) - use only 1 sum variable
function sum_to_n_a(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
sum_to_n_a(5);
// Approach 2: Mathematical formula
// Time Complexity: O(1) - direct arithmetic calculation
// Space Complexity: O(1) - no additional memory used
// Formula: sum = n * (n + 1) / 2
function sum_to_n_b(n) {
    return n * (n + 1) / 2;
}
sum_to_n_b(5);
console.log(sum_to_n_b(5));
function sum_to_n_c(n) {
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_c(n - 1);
}
sum_to_n_c(5);
console.log(sum_to_n_c(5));
