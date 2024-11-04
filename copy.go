/*
	TODO:
		make this work for directories too
		do the rest of the flags
*/

package cmd

import (
	"bufio"
	"fmt"
	"github.com/spf13/cobra"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"syscall"
)

var copyCmd = &cobra.Command{
	Use:   "copy",
	Short: "copies stuff",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 2 {
			fmt.Println("Please specify a source path and destination path")
			return
		}

		if makeShortcut {
			fmt.Println("dont use shortcut parameter its not done")
		} else {
			files, err := os.ReadDir(args[0])
			if err != nil && !suppressErrors {
				fmt.Println(err)
				return
			}

			Finfo, err := os.Stat(args[0])
			if err != nil && !suppressErrors {
				fmt.Println(err)
				return
			}

			c := true
			if askToConfirm {
				c = askForConfirmation("Are you sure you want to proceed to copy?")
			} else if askForInputBeforeCopying {
				c = askForUserInput("Press any key to continue")
			}

			if !c {
				return
			}

			for _, f := range files {
				file := f.Name()

				if genListOnly {
					fmt.Println("copy \"" + filepath.Join(args[0], file) + "\" \"" + filepath.Join(args[1], file) + "\"")
				} else {
					if !f.IsDir() {
						if isHiddenFile(Finfo) && !copyHidden {
							continue
						}

						if logFileNames {
							fmt.Println(file)
						}

						err := copyFile(filepath.Join(args[0], file), filepath.Join(args[1], file))

						if err != nil && !suppressErrors {
							fmt.Println(err)
							return
						}
					} else {
						continue
					}
				}
			}
		}
	},
}

var copyHidden bool = false
var suppressErrors bool = false
var askToConfirm bool
var askForInputBeforeCopying bool
var logFileNames bool
var genListOnly bool
var copyEVERYTHING bool
var copyEVERYTHINGIfHasContent bool
var onlyReadOnly bool
var makeShortcut bool // not done -- make sure to do!!!!!!!

func init() {
	rootCmd.AddCommand(copyCmd)

	copyCmd.Flags().BoolVarP(&copyHidden, "hidden", "n", false, "Copies hidden files")
	copyCmd.Flags().BoolVarP(&suppressErrors, "suppresserrors", "c", false, "Suppresses all error messages")
	copyCmd.Flags().BoolVarP(&askToConfirm, "confirm", "p", false, "Don't ask to confirm")
	copyCmd.Flags().BoolVarP(&logFileNames, "log", "f", false, "Logs source and destination paths")
	copyCmd.Flags().BoolVarP(&genListOnly, "list", "l", false, "Generates a list of files that are to be copied, but doesn't actively copy the files")
	copyCmd.Flags().BoolVarP(&makeShortcut, "shortcut", "t", false, "Makes shortcuts that link to the original files")
	copyCmd.Flags().BoolVarP(&askForInputBeforeCopying, "input", "i", false, "Requires any input before proceeding")
}

func copyFile(src, dst string) error {
	input, err := os.Open(src)
	if err != nil {
		return err
	}
	defer input.Close()

	output, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer output.Close()

	_, err = io.Copy(output, input)
	return err
}

func isHiddenFile(info os.FileInfo) bool {
	if info == nil {
		return false
	}

	// windows check
	if stat, ok := info.Sys().(*syscall.Win32FileAttributeData); ok {
		return (stat.FileAttributes & syscall.FILE_ATTRIBUTE_HIDDEN) != 0
	}

	// unix check
	return info.Name()[0] == '.'
}

func askForUserInput(s string) bool {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Printf(s)

		response, err := reader.ReadString('\n')
		if err != nil {
			log.Fatal(err)
		}

		response = strings.ToLower(strings.TrimSpace(response))

		if response != "" {
			return true
		} else {
			return false
		}
	}
}
