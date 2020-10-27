const GREEN = '#00FA9A';
const RED = '#F67280';
const VIOLET = '#D19FE8';
const YELLOW = '#F7DB4F';

// clear the timeId will cause the promise never fullfills,
// so the sorting will freeze in the middle
let timeId = null;   // used for freeze the sorting

// combinate await keyword with a fake promise to simulate sleep function
// it will wait til the async call (the promise) is completed and then move on to next step.
const sleep = (n) => {
  return new Promise(done => timeId = setTimeout(() => done(), n));
}

const incorrectOrder = (cur) => {
  cur.current.style.backgroundColor = RED;
}

const correctOrder = (cur) => {
  cur.current.style.backgroundColor = GREEN;
}

const sorted = (cur) => {
  cur.current.style.backgroundColor = VIOLET;
}

const reset = (cur) => {
  cur.current.style.backgroundColor = '';
}

const asPivot = (cur) => {
  cur.current.style.backgroundColor = YELLOW;
}

// for visualization purposes
const finished = async (nums) => {
  await sleep(500);
  nums.forEach(bar => correctOrder(bar));
  await sleep(900);
  nums.forEach(bar => sorted(bar));
}

/**************************************** Counting Sort *****************************************/
const countingSort = async (nums, update, speed) => {
  let newNums = nums.map(num => parseInt(num.current.textContent));
  let max = Math.max(...newNums)
  let A = new Array(max+1).fill(0);
  for(let i = 0; i < newNums.length; i++) {
    A[newNums[i]]++;
  }

  for(let i = 0; i < nums.length; i++) {
    correctOrder(nums[i]);
    await sleep(speed);
    incorrectOrder(nums[i]);
    await sleep(speed);
    reset(nums[i]);
    update(nums[i], 0);
  }

  let pos = 0;
  for(let i = 0; i < A.length; i++) {
    if(A[i] > 0) {
      update(nums[pos], i);
      correctOrder(nums[pos]);
      await sleep(speed);
      sorted(nums[pos]);
      pos++;
    }
  }

  finished(nums);
  //newNums.forEach(x => console.log(x))
}

/**************************************** Heap Sort *****************************************/
const heapify = async (speed, index, nums, size, update) => {
  let leftChildIndex = 2 * index + 1;
  let rightChildIndex = leftChildIndex + 1;
  if(leftChildIndex < size || rightChildIndex < size) {
    let left = leftChildIndex >= size ? -1 : parseInt(nums[leftChildIndex].current.textContent);
    let right = rightChildIndex >= size ? -1 : parseInt(nums[rightChildIndex].current.textContent);

    let largerChildIndex;
    if(left > right) largerChildIndex = leftChildIndex;
    else largerChildIndex = rightChildIndex;

    let largerChild = parseInt(nums[largerChildIndex].current.textContent);
    let cur = parseInt(nums[index].current.textContent);
    correctOrder(nums[index]);
    correctOrder(nums[largerChildIndex]);
    await sleep(speed);

    if(cur < largerChild) {
      incorrectOrder(nums[index]);
      incorrectOrder(nums[largerChildIndex]);
      await sleep(speed);

      update(nums[largerChildIndex], cur);
      update(nums[index], largerChild);

      reset(nums[index]);
      reset(nums[largerChildIndex]);
      await heapify(speed, largerChildIndex, nums, size, update);
    }
    else {
      reset(nums[index]);
      reset(nums[largerChildIndex]);
    }
  }
}

const heapSort = async (nums, update, speed) => {
  let n = nums.length;
  /* build the max-heap from the array */
  // call heapify on each parent node
  // n/2-1 will give us the right most parent node in the array
  // all the nodes before this node will also be parent nodes.
  for(let i = n/2 - 1; i >= 0; i--) {
    await heapify(speed, i, nums, n, update);
  }

  // get the max num from the heap and swap to the sorted region
  while(n - 1 >= 0) {
    let cur = parseInt(nums[0].current.textContent);
    let last = parseInt(nums[n-1].current.textContent);
    correctOrder(nums[0]);
    correctOrder(nums[n-1]);
    await sleep(speed);

    incorrectOrder(nums[0]);
    incorrectOrder(nums[n-1]);
    await sleep(speed);

    update(nums[0], last);
    update(nums[n-1], cur);

    reset(nums[0]);
    sorted(nums[n-1]);
    n--;
    await heapify(speed, 0, nums, n, update);
  }

  finished(nums);
}

/**************************************** Quick Sort *****************************************/
const partition = async (speed, nums, update, left, right) => {
  // always choose the last element as pivot
  const pivot = parseInt(nums[right].current.textContent);
  asPivot(nums[right]);
  let pivotIndex = left;
  // move all nums that are > the pivot to the left of the pivot
  for(let i = left; i < right; i++) {
    correctOrder(nums[i]);
    await sleep(speed);

    let num = parseInt(nums[i].current.textContent);
    if(num < pivot) {
      incorrectOrder(nums[i]);
      await sleep(speed);
      let val = parseInt(nums[pivotIndex].current.textContent);
      update(nums[i], val);
      update(nums[pivotIndex], num);
      pivotIndex++;
    }

    reset(nums[i]);
  }

  // move the pivot to the correct pos
  let pivotNum = parseInt(nums[pivotIndex].current.textContent);
  let lastNum = parseInt(nums[right].current.textContent);
  correctOrder(nums[pivotIndex]);
  correctOrder(nums[right]);
  await sleep(speed);

  update(nums[right], pivotNum);
  update(nums[pivotIndex], lastNum);

  reset(nums[pivotIndex]);
  reset(nums[right]);
  return pivotIndex;
}

const qSort = async (speed, nums, update, left, right) => {
  if(left < right) {
      let index = await partition(speed, nums, update, left, right);
      sorted(nums[index]);
      await qSort(speed, nums, update, left, index - 1);
      await qSort(speed, nums, update, index + 1, right);
  }
}

const quickSort = async (nums, update, speed) => {
  await qSort(speed, nums, update, 0, nums.length-1);
  finished(nums);
}

/**************************************** Merge Sort *****************************************/
// len is used to tell us if we reach the final merging stage
const merge = async (speed, len, update, left, right) => {
  let A = left.concat(right);

  let li = 0, ri = left.length;
  let final = A.length === len; // final stage or not
  while(li < A.length && ri < A.length) {
    let num1 = parseInt(A[li].current.textContent);
    let num2 = parseInt(A[ri].current.textContent);
    if(num1 === num2) break;
    else if(num1 < num2) {
      // currently comparing
      correctOrder(A[li]);
      correctOrder(A[ri]);
      await sleep(speed);

      reset(A[li]);
      reset(A[ri]);

      if(final) sorted(A[li]);
      li++;
    }
    //not in order
    else {
      // currently comparing
      correctOrder(A[li]);
      correctOrder(A[ri]);
      await sleep(speed);

      incorrectOrder(A[li]);
      incorrectOrder(A[ri]);
      await sleep(speed);
      // shifting elements
      let i = ri, j = li;
      while(i > j && parseInt(A[i].current.textContent) < parseInt(A[i-1].current.textContent)) {
        let n1 = parseInt(A[i].current.textContent);
        let n2 = parseInt(A[i-1].current.textContent);
        update(A[i], n2);
        update(A[i-1], n1);
        i--;
      }

      // no need to set A[li] to incorrect order because it's already set above.
      // and A[i+1] is the new A[ri] after shifting elements, so we reset the old A[ri]
      reset(A[ri]);
      incorrectOrder(A[i+1]);
      await sleep(speed);

      correctOrder(A[i+1]);
      correctOrder(A[li]);
      await sleep(speed);

      reset(A[i+1]);
      reset(A[li]);

      if(final) sorted(A[li]);
      li++;
      ri++;
    }
  }

  return A;
}

// divide
const divide = async (speed, nums, update, low, high) => {
    if(low >= high) return [nums[low]];
    let mid = Math.floor((low + high) / 2);
    // make is synchronous, sort the left half then the right half
    let left = await divide(speed, nums, update, low, mid);
    let right = await divide(speed, nums, update, mid+1, high);
    return merge(speed, nums.length, update, left, right);
}

const mergeSort = async (nums, update, speed) => {
  await divide(speed, nums, update, 0, nums.length-1);
  finished(nums);
}

/**************************************** Bubble Sort *****************************************/
const bubbleSort = async (nums, update, speed) => {
  let n = nums.length

  for(let i = 0; i < n; i++) {
    // each pass we will move the largest to the end
    // so we only need to run length-i-1 times.
    for(let j = 0; j < n-i-1; j++) {
      let num1 = parseInt(nums[j].current.textContent);
      let num2 = parseInt(nums[j+1].current.textContent);

      // currently comparing, assume in order
      correctOrder(nums[j]);
      correctOrder(nums[j+1]);
      await sleep(speed);

      if(num1 > num2) {
        // incorrect order
        incorrectOrder(nums[j]);
        incorrectOrder(nums[j+1]);
        await sleep(speed);
        // swap elements
        update(nums[j], num2);
        update(nums[j+1], num1);
        // correct order
        correctOrder(nums[j]);
        correctOrder(nums[j+1]);
        await sleep(speed);
      }

      // reset color
      reset(nums[j]);
      reset(nums[j+1]);
    }
    // sorted
    sorted(nums[n-i-1]);
  }

  finished(nums);
}

/**************************************** Insertion Sort *****************************************/
const insertionSort = async (nums, update, speed) => {
  for(let i = 1; i < nums.length; i++) {
    let j = i-1;
    let prev = parseInt(nums[j].current.textContent);
    let cur = parseInt(nums[j+1].current.textContent);

    if(j < 0 || cur >= prev) {
      correctOrder(nums[j]);
      correctOrder(nums[j+1]);
      await sleep(speed);
      reset(nums[j]);
      reset(nums[j+1]);
    }

    while(j >= 0 && cur < prev) {
      correctOrder(nums[j]);
      correctOrder(nums[j+1]);
      await sleep(speed);

      incorrectOrder(nums[j]);
      incorrectOrder(nums[j+1]);

      update(nums[j], cur);
      update(nums[j+1], prev);
      await sleep(speed);

      reset(nums[j]);
      reset(nums[j+1]);
      j--;
      if(j < 0) break;
      prev = parseInt(nums[j].current.textContent);
      cur = parseInt(nums[j+1].current.textContent);
    }
  }

  finished(nums);
}

export { countingSort, heapSort, quickSort, mergeSort, bubbleSort, insertionSort, reset, timeId };
