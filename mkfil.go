package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

// mkfilCmd represents the mkfil command
var mkfilCmd = &cobra.Command{
	Use:   "mkfil",
	Short: ``,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			fmt.Println("Please provide a name for the file")
			return
		}

		newFile, err := os.Create(args[0])
		if err != nil {
			fmt.Println(err)
			fmt.Println("Couldn't create file", args[0], "- FATAL")
			return
		}
		dir, err := os.Getwd()
		if err != nil {
			fmt.Println(err)
			fmt.Println("Couldn't get current directory - FATAL")
			return
		}
		fmt.Println("Made new file", newFile.Name(), "in directory", dir)
	},
}

func init() {
	rootCmd.AddCommand(mkfilCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// mkfilCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// mkfilCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
