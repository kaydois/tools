class a{
    constructor(a) {
        this.a = a;
        this.aa = "aaa"
    }
}

class b extends a {
    constructor(b) {
        super();
        this.b = a.a;
        this.c = a;
    }
}

let aa = new a("1")
let bb = new b("a.", "b")

console.log(aa)
console.warn(bb)