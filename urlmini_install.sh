#
# 'URLmini' - is a rest api service for url minification
#
# Copyright (C) 2014 Christopher Kelley <tsukumokun(at)icloud.com>
#
# This work is licensed under the
# Creative Commons Attribution-NoDerivatives 4.0 International
# License. To view a copy of this license, visit
# http:#creativecommons.org/licenses/by-nc-nd/4.0/deed.en_US.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
#

if [ -t 1 ]; then

    ncolors=$(tput colors)

    if test -n "$ncolors" && test $ncolors -ge 8; then
        BOLD="$(tput bold)"
        UNDERLINE="$(tput smul)"
        STANDOUT="$(tput smso)"
        NORMAL="$(tput sgr0)"
        BLACK="$(tput setaf 0)"
        RED="$(tput setaf 1)"
        GREEN="$(tput setaf 2)"
        YELLOW="$(tput setaf 3)"
        BLUE="$(tput setaf 4)"
        MAGENTA="$(tput setaf 5)"
        CYAN="$(tput setaf 6)"
        WHITE="$(tput setaf 7)"
    fi
fi

echo_color()
{
    if [ "$#" -lt 1 ]; then
        echo -n
    elif [ "$#" -lt 2 ]; then
        echo $1
    else
        echo "${1}${2}${NORMAL}"
    fi
}

program_is_installed() {
  local found=1
  type $1 >/dev/null 2>&1 || { local found=0; }
  echo "$found"
}

# Check for root priveledges
if [ "$(id -u)" != "0" ]; then
  echo_color $RED "Must have root priveledges to install."
  echo_color $BLUE "Hint: Run: sudo path/to/jim-install"
  exit 1
fi

# Check for node
if [ $(program_is_installed node) == 0 ]; then
    echo_color $YELLOW "Node not found, installing..."
    hash git >/dev/null && /usr/bin/env git clone -q https://github.com/joyent/node.git /tmp/node/ || {
      echo_color $RED "Not Found: git - install git and retry."
      exit 1
    }
    # Store pwd for later
    cwd=$(pwd)
    # Move into the new node folder
    cd /tmp/node/
    # Make the build
    echo_color $BLUE "Making node..."
    ./configure >/dev/null
    make >/dev/null
    make install >/dev/null
    # Return to previous directory
    cd $(cwd)
    echo_color $YELLOW "Node is installed..."
fi

# Clone repository into temporary file
echo_color $BLUE "Retrieving URLmini files..."

hash git >/dev/null && /usr/bin/env git clone -q https://github.com/Tsukumokun/urlmini.git . || {
  echo_color $RED "Not Found: git - install git and retry."
  exit 1
}

# Install dependencies
echo_color $BLUE "Installing dependencies..."

npm install -loglevel error >/dev/null


# Remove extraneous files
echo_color $BLUE "Cleaning up directory..."

rm -rf .git/
rm  -f .gitignore
rm  -f urlmini_install.sh
rm -rf /tmp/node


echo_color $YELLOW "
██╗   ██╗██████╗ ██╗     ███╗   ███╗██╗███╗   ██╗██╗
██║   ██║██╔══██╗██║     ████╗ ████║██║████╗  ██║██║
██║   ██║██████╔╝██║     ██╔████╔██║██║██╔██╗ ██║██║
██║   ██║██╔══██╗██║     ██║╚██╔╝██║██║██║╚██╗██║██║
╚██████╔╝██║  ██║███████╗██║ ╚═╝ ██║██║██║ ╚████║██║
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝
installed sucessfully..."
