SHELL := /bin/bash
# VARIABLES

# COMMANDS
all: run

run: jekyll serve --watch

css:
	compass watch .