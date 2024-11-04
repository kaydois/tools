/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

type DirEntry = os.DirEntry

// lsCmd represents the ls command
var lsCmd = &cobra.Command{
	Use:   "ls",
	Short: "lists all sub-directories and files in a given directory",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("not done yet")
		return
	},
}

var all bool = false

func init() {
	rootCmd.AddCommand(lsCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// lsCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	lsCmd.Flags().BoolVarP(&all, "all", "a", false, "list ALL entries including hidden files")
}
