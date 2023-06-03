#!/bin/bash

# Function to lowercase files and directories
lowercase(){
  # IFS (Internal Field Separator) set to newline to handle filenames with spaces
  IFS=$'\n'
  
  # loop through files and directories
  for file in `find $1 -depth`
  do
    # convert to lowercase
    lower_file=`echo $file | tr '[:upper:]' '[:lower:]'`
    
    # Check if renaming is necessary
    if [ "$file" != "$lower_file" ]
    then
      # Rename
      mv -i "$file" "$lower_file"
    fi
  done
}

# Call function on current directory
lowercase .
