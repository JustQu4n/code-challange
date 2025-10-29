# Problem 4: Three ways to sum to n
# Task

Provide 3 unique implementations of the following function in TypeScript.

- Comment on the complexity or efficiency of each function.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## ✅ Approach 1: Iterative Loop

* **Idea:** Increase sum in a loop from 1 to n
* **Time Complexity:** O(n)
* **Space Complexity:** O(1)
* Simple and efficient for most cases

```typescript
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
```

---

## ✅ Approach 2: Mathematical Formula

* **Formula:** `sum = n * (n + 1) / 2`
* **Time Complexity:** O(1) → faster than looping
* **Space Complexity:** O(1)
* Uses math instead of iteration

```typescript
function sum_to_n_b(n: number): number {
   return n * (n + 1) / 2;
}
```
---

## ✅ Approach 3: Recursion

* **Idea:** Sum using recursive calls until n = 1
* **Time Complexity:** O(n)
* **Space Complexity:** O(n) → due to call stack
* Not recommended for large n (stack overflow risk)

```typescript
function sum_to_n_c(n: number): number {
    if (n <= 1) return n;
    return n+ sum_to_n_c(n-1);
}
```

---

## ▶️ Example Test (n = 5)

All approaches return the same result:

```
1 + 2 + 3 + 4 + 5 = 15
```

---

### Conclusion

* Best performance: Mathematical formula (O(1))
* Easiest to understand: Loop
* Recursion works but not efficient for large n
