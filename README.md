# fast-spell-check
Python language support for [Pulsar editor](https://pulsar-edit.dev/), powered by [Pyrefly](https://pyrefly.org/) - an extremely fast language server and type checker for Python.

## Setup
Just install [Pyrefly](https://pyrefly.org/en/docs/installation/).  
If its not in the PATH then provide path to executable in the package config.  
Then install [atom-ide-base](https://github.com/atom-community/atom-ide-base) umbrella package to integrate LSP functionality to Pulsar. get it from [Pulsar Packages](https://packages.pulsar-edit.dev/packages/atom-ide-base). This is not an requirement, you can install only some individual packages from `atom-ide-` family.

### Recommended IDE and Python related Pulsar packages
- [linter-ruff](https://github.com/asiloisad/pulsar-linter-ruff) - Wrapper around ruff - an extremely fast linter for Python
- [language-cython](https://github.com/PierrickKoch/language-cython) - If you write cython code
- [python-vprof](https://github.com/sparklost/pulsar-python-vprof) - Show [vprof](https://github.com/nvdv/vprof) heatmap in editor gutter
- [pulsar-refactor](https://github.com/savetheclocktower/pulsar-refactor) - Perform project-wide renaming of symbols
- [fast-spell-check](https://github.com/sparklost/pulsar-fast-spell-check) - High-performance spell-checker

## Configuration
Other Pyrefly-related settings can be configured per-project in `pyrefly.toml` or in `pyproject.toml`. More details [here](https://pyrefly.org/en/docs/configuration/).

