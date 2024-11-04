function double(a) {
    return a * a;
}

function fastHypot(a, b) {
    return double(a.x - b.x) + double(a.y - b.y);
}