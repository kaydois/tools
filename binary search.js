// ok so this technically isnt a sorting algorithm but rather a searching algortihm to find something in an array
// but im not making another folder for like 1 file


// original search function
function find(A, n, T) {
    let length = 0;
    let index = n - 1;

    while (length <= index) {
        let m = Math.floor(length + index) / 2;

        if(A[m] < T) length = m + 1;
        else if (A[m] > T) length = m - 1;
        else return m;
    }

    return null;
};

// optimised search function
function optimisedFind(A, n, T) {
    let length = 0;
    let index = n - 1;

    while (length != index) {
        let m = Math.ceil((length + index) / 2);

        if(A[m] > T) index = m - 1;
        else length = m;
    }

    if(A[length] == T) return length;

    return null;
}