// also known as a priority queue
class MinHeap {
    constructor(capacity) {
        this.items = [];
        this.size = 0;
        this.capacity = capacity;
    }

    getParent(item) {
        return Math.floor((item - 1) / 2);
    }

    getChild(direction, item) {
        return (item * 2) + 1 + (direction == "right"); //super weird antics, works since true == 1 and false == 0
    }

    insert(item) {
        if(this.size >= this.capacity) return "heap capacity reached";
    
        this.size++;
        let i = this.size - 1;
        this.items[i] = item;
    
        while(i != 0 && this.items[this.getParent(i)] > this.items[i]) {
            let parent = this.getParent(i);
            swap(i, parent, this.items);
            i = parent;
        }
    }
    
    retrieveAndDestroyMin() {
        if(!this.size) return null;

        if(this.size == 1) {
            this.size--;
            return this.items[0];
        }

        let root = this.items[0];
        this.items[0] = this.items[this.size - 1];
        this.size--;

        this.heapifyMin(0);

        return root;
    }

    heapifyMin(item) {
        let smallest = item;
        while (true) {
            let left = this.getChild("left", smallest), right = this.getChild("right", smallest);
            
            if (left < this.size && this.items[left] < this.items[smallest]) {
                smallest = left;
            }
    
            if (right < this.size && this.items[right] < this.items[smallest]) {
                smallest = right;
            }
    
            if (smallest != item) {
                this.swap(smallest, item);
                item = smallest;
            } else {
                break;
            }
        }
    }
        
    getMin() {
        return this.items[0];
    }
}

function swap(a, b, arr) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}