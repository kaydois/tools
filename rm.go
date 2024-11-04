package cmd

import (
	"bufio"
	"fmt"
	"github.com/spf13/cobra"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func askForConfirmation(s string) bool {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Printf("%s [Y/n]: ", s)

		response, err := reader.ReadString('\n')
		if err != nil {
			log.Fatal(err)
		}

		response = strings.ToLower(strings.TrimSpace(response))

		if response == "y" || response == "yes" || response == "Y" {
			return true
		} else if response == "n" || response == "no" || response == "N" {
			return false
		}
	}
}

var rmCmd = &cobra.Command{
	Use:   "rm",
	Short: "removes a file or directory",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		//fmt.Println(args)
		if len(args) < 1 {
			fmt.Println("please enter a file or directory name")
			return
		}
		var dirName = args[0]
		directory, err := os.Getwd()

		if err != nil {
			fmt.Println(err)
			fmt.Println("Couldn't get current directory - FATAL")
			return
		}

		path := filepath.Join(directory, dirName)
		info, err := os.Stat(path)
		if err != nil {
			fmt.Println(err)
			fmt.Println("Couldn't get file info - FATAL")
			return
		}
		if info.IsDir() {
			removeDirectory(args[0], recursive, force)
		} else {
			removeFile(args[0], recursive, force)
		}
		//fmt.Println(path)
	},
}

func removeFile(dir string, delAll, force bool) {
	c := true
	if !force {
		c = askForConfirmation(fmt.Sprintf("Are you sure you want to remove %s?", dir))
	}
	if !c {
		return
	} else {
		if delAll {
			fmt.Println("Removing all files similar to", dir)
			err := os.RemoveAll(dir)
			if err != nil {
				fmt.Println(err)
				fmt.Println("Couldn't remove all files similar to", dir)
			}
		} else {
			fmt.Println("Removing file at", dir)
			err := os.Remove(dir)
			if err != nil {
				fmt.Println(err)
				fmt.Println("Couldn't remove file at", dir)
			}
		}
	}
}

func removeDirectory(dir string, delAll, force bool) {
	c := true
	if !force {
		c = askForConfirmation(fmt.Sprintf("Are you sure you want to remove %s?", dir))
	}
	if !c {
		return
	} else {
		if delAll {
			fmt.Println("Removing all directories similar to", dir)
			err := os.RemoveAll(dir)
			if err != nil {
				fmt.Println(err)
				fmt.Println("Couldn't remove all directories")
			}
		} else {
			fmt.Println("Removing directory at", dir)
			err := os.Remove(dir)
			if err != nil {
				fmt.Println(err)
				fmt.Println("Couldn't remove directory", dir)
			}
		}
	}
}

var recursive bool
var force bool

func init() {
	rmCmd.Flags().BoolVarP(&recursive, "recursive", "r", false, "Delete recursively")
	rmCmd.Flags().BoolVarP(&force, "force", "f", false, "Don't ask for confirmation")
	rootCmd.AddCommand(rmCmd)
}
