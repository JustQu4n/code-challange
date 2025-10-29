// Approach 1: Iterative loop
    // Time Complexity: O(n) - we iterate from 1 to n
    // Space Complexity: O(1) - use only 1 sum variable
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Approach 2: Mathematical formula
  // Time Complexity: O(1) - direct arithmetic calculation
  // Space Complexity: O(1) - no additional memory used
  // Formula: sum = n * (n + 1) / 2
function sum_to_n_b(n: number): number {
   return n * (n + 1) / 2;
}

// Approach 3: Recursive function
  // Time Complexity: O(n) - recursive calls decrease n until 1
  // Space Complexity: O(n) - call stack grows with recursion depth
  // Note: Can cause stack overflow if n is too large
function sum_to_n_c(n: number): number {
    if (n <= 1) return n;
    return n+ sum_to_n_c(n-1);
}

// Test cases
sum_to_n_a(5);
sum_to_n_b(5);
sum_to_n_c(5);