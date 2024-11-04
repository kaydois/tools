/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var mkdirCmd = &cobra.Command{
	Use:   "mkdir",
	Short: "makes a directory",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		var dirName = args[0]
		directory, err := os.Getwd()
		fmt.Println("Making a directory in", directory, "with name '"+dirName+"'")
		os.Mkdir(dirName, os.ModePerm)
		if err != nil {
			return
		}
		fmt.Println(args)
	},
}

func init() {
	rootCmd.AddCommand(mkdirCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// mkdirCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// mkdirCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
