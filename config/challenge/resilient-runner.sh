#!/bin/bash

# a bash function that checks if a file exists and return 0 if it does or 1 if it doesn't
function file_exists {
    if [ -f $1 ]; then
        return 0
    else
        return 1
    fi
}

FILES=("./src/server.js" "./src/index.js" "src/app.js" "src/servidor.js" "./index.js" "./server.js" "./app.js" "./servidor.js")

# sleep 5s # wait 5 seconds for the postgres to start

# tries to run each file in the array. If one of them is found, stop looping
for file in ${FILES[@]}; do
    echo "Checking if $file exists"
    if file_exists $file; then
        echo "Found $file"
        node $file
        break
    else
        echo "File $file not found"
        echo "------------------------"
    fi
done