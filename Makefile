SHELL := /bin/bash

# COMMANDS
run: jekyll serve --watch

css:
	compass watch .