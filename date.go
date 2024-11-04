/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"
)

// dateCmd represents the date command
var dateCmd = &cobra.Command{
	Use:   "date",
	Short: "returns the current date",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		if edit && len(args) < 1 {
			fmt.Println("Please specify a new date")
			return
		}

		if edit {

		} else {
			fmt.Println(time.Now())
		}
	},
}

var edit bool

func init() {
	rootCmd.AddCommand(dateCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// dateCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// dateCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")

	dateCmd.Flags().BoolVarP(&edit, "edit", "s", false, "sets the date")
}
