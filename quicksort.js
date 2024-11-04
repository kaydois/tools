function partition(array, startIndex, endIndex) {
    let index = startIndex;
    let value = array[endIndex];

    for(let i = startIndex; i < endIndex; i++) {
        if(array[i] < value) {
            swap(i, index, array);
            index++;
        }
    }

    swap(index, endIndex, array);
    return index;
}

function sort(array, startIndex, endIndex) {
    if(startIndex >= endIndex) return;

    let index = partition(array, startIndex, endIndex);
    sort(array, startIndex, index - 1);
    sort(array, index + 1, endIndex);
}

function swap(a, b, array) {
    let temp = array[a];

    array[a] = array[b];
    array[b] = temp;
}