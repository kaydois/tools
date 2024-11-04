/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"github.com/shirou/gopsutil/v3/process"
	"github.com/spf13/cobra"
)

// killCmd represents the kill command
var killCmd = &cobra.Command{
	Use:   "kill",
	Short: "kills a process",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		var foundProcessCount int = 0
		if len(args) < 1 && !ListProcesses {
			fmt.Println("Please provide a task to kill")
			return
		}

		processes, err := process.Processes()
		if err != nil {
			fmt.Println(err)
			fmt.Println("Couldn't get processes - FATAL")
			return
		}

		if len(processes) < 1 {
			fmt.Println("No processes found")
			return
		}

		for i := 0; i < len(processes); i++ {
			name, err := processes[i].Name()
			if err != nil {
				continue
			}

			if ListProcesses {
				fmt.Println(name)
			} else {
				if name == args[0] {
					foundProcessCount++
					processes[i].Kill()
					name, err = processes[i].Name()
					if err != nil {
						fmt.Println("Killed process", processes[i])
					} else {
						fmt.Println("Killed process", name)
					}
					if !KillAllProcesses {
						return
					}
				}
			}
		}

		if ListProcesses {
			fmt.Println()
			fmt.Println("Found", len(processes), "processes")
		}
		if foundProcessCount < 1 && !ListProcesses {
			if len(args) < 1 {
				fmt.Println("No processes found")
			} else {
				fmt.Println("No processes found with name", args[0])
			}
		}
	},
}

var ListProcesses bool
var KillAllProcesses bool

func init() {
	rootCmd.AddCommand(killCmd)

	killCmd.Flags().BoolVarP(&ListProcesses, "list", "l", false, "List all processes")
	killCmd.Flags().BoolVarP(&KillAllProcesses, "recursive", "r", false, "Remove all processes with given name")
}
