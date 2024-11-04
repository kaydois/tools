function merge(left, mid, right, arr, temparr, compare) {
    let i = left, j = mid, k = left;
    
    while (i < mid && j < right) {
        temparr[k++] = compare(arr[i], arr[j]) <= 0 ? arr[i++] : arr[j++];
    }
    while (i < mid) {
        temparr[k++] = arr[i++];
    }
    while (j < right) {
        temparr[k++] = arr[j++];
    }
    
    for (let index = left; index < right; index++) {
        arr[index] = temparr[index];
    }
}

function sort(left, right, arr, temparr, compare) {
    if (right - left < 2) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid, arr, temparr, compare);
    sort(mid, right, arr, temparr, compare);
    merge(left, mid, right, arr, temparr, compare);
}

Array.prototype.mergesort = function(compare = (a, b) => a - b) {
    let temparr = new Array(this.length);
    
    sort(0, this.length, this, temparr, compare);
    return this;
};