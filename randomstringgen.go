package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	fmt.Println(getRandomString(r, 64))
	fmt.Println(getRandomString(r, 64))
	fmt.Println(getRandomString(r, 64))
}

func getRandomNumber(r *rand.Rand, max int) int {
	return r.Intn(max)
}

var characters string = "!@#$%^&*()_+-={}|[]./>?<,'`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

func getRandomString(r *rand.Rand, leng int) string {
	var result string

	for i := 0; i < leng; i++ {
		result += string(characters[getRandomNumber(r, len(characters))])
	}

	return result
}
