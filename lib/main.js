const { AutoLanguageClient } = require("@savetheclocktower/atom-languageclient")

class PythonLanguageClient extends AutoLanguageClient {
  activate() {
    super.activate()
  }

  getPackageName() {
    return "pulsar-ide-python-pyrefly"
  }

  getGrammarScopes() {
    return ["source.python", "python"]
  }

  getLanguageName() {
    return "Python"
  }

  getServerName() {
    return "pyrefly"
  }

  async startServerProcess(projectPath) {
    const executable = atom.config.get("pulsar-ide-python-pyrefly.executablePath") || "pyrefly"
    const threads = atom.config.get("pulsar-ide-python-pyrefly.threads")
    const args = ["lsp"]
    if (typeof threads === "number") {
      args.push("-j", threads.toString())
    }
    const childProcess = super.spawn(executable, args, { cwd: projectPath })
    return childProcess
  }

  getInitializationOptions(projectPath) {
    return {
      pythonPath: atom.config.get("pulsar-ide-python-pyrefly.pythonPath"),
      commentFoldingRanges: atom.config.get("pulsar-ide-python-pyrefly.commentFoldingRanges"),
      pyrefly: {
        ...atom.config.get("pulsar-ide-python-pyrefly.pyrefly"),
        analysis: {
          ...atom.config.get("pulsar-ide-python-pyrefly.analysis"),
          inlayHints: atom.config.get("pulsar-ide-python-pyrefly.inlayHints")
        },
        disabledLanguageServices: atom.config.get("pulsar-ide-python-pyrefly.disabledLanguageServices")
      }
    }
  }

  onSpawnError(err) {
    const executable = atom.config.get("pulsar-ide-python-pyrefly.executablePath") || "pyrefly"
    atom.notifications.addError("Pyrefly Language Server: Failed to spawn process", {
      dismissable: true,
      detail: err.message,
      description: `Could not start the language server from path \`${executable}\`.`
    })
  }
  onSpawnClose(code, signal) {
    if (code !== 0 && signal === null) {
      atom.notifications.addError("Pyrefly Language Server: Terminated Unexpectedly", {
        dismissable: true,
        detail: `Exit code: ${code}`,
        description: `Pyrefly process closed with a non-zero exit code.\n` +
                     `This typically points to an invalid configuration. Please check the developer console for additional stack logs.`
      })
    }
  }

  deactivate() {
    return Promise.race([super.deactivate(), this.createTimeoutPromise(2000)])
  }

  getLanguageClientCapabilities() {
    const capabilities = super.getLanguageClientCapabilities()
    capabilities.textDocument.completion.completionItem.snippetSupport = true
    return capabilities
  }

  createTimeoutPromise(milliseconds) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        resolve()
      }, milliseconds)
    })
  }
}

const pythonClient = new PythonLanguageClient()


pythonClient.config = {
  executablePath: {
    title: "Pyrefly Executable Path",
    description: "The absolute path or command name to execute the Pyrefly server.",
    type: "string",
    default: "pyrefly",
    order: 1
  },
  threads: {
    title: "Threads Count",
    description: "Number of threads for Pyrefly processing. Set to 0 for auto.",
    type: "integer",
    default: 0,
    order: 2
  },
  pythonPath: {
    title: "Python Path",
    description: "The path targeting the environment's python execution engine.",
    type: "string",
    default: "/usr/bin/python3",
    order: 3
  },
  pyrefly: {
    type: "object",
    title: "Pyrefly Core Configurations",
    order: 5,
    properties: {
      typeCheckingMode: {
        description: "Select the type checking level for files not covered by `pyrefly.toml` or `[tool.pyrefly]` section.",
        type: "string",
        default: "auto",
        enum: ["auto", "off", "basic", "legacy", "default", "strict"]
      },
      disableTypeErrors: {type: "boolean", default: false},
      disableLanguageServices: {type: "boolean", default: false},
    }
  },
  analysis: {
    type: "object",
    title: "Analysis & Scopes",
    order: 6,
    properties: {
      diagnosticMode: {
          description: "Whether to run diagnostics only on currently open files, or on entire project.",
          type: "string",
          default: "workspace",
          enum: ["openFilesOnly", "workspace"]
      },
      showHoverGoToLinks: {
          type: "boolean",
          description: "Controls whether hover tooltips include `Go to definition` links.",
          default: true
      }
    }
  },
  disabledLanguageServices: {
    type: "object",
    title: "Disable Individual Language Services",
    description: "Toggle individual features off if you prefer using other tools for them.",
    order: 8,
    properties: {
      hover: { type: "boolean", default: false },
      documentSymbol: { type: "boolean", default: false },
      workspaceSymbol: { type: "boolean", default: false },
      inlayHint: { type: "boolean", default: false },
      completion: { type: "boolean", default: false },
      codeAction: { type: "boolean", default: false },
      definition: { type: "boolean", default: false },
      declaration: { type: "boolean", default: false },
      typeDefinition: { type: "boolean", default: false },
      references: { type: "boolean", default: false },
      documentHighlight: { type: "boolean", default: false },
      rename: { type: "boolean", default: false },
      codeLens: { type: "boolean", default: false },
      semanticTokens: { type: "boolean", default: false },
      signatureHelp: { type: "boolean", default: false },
      implementation: { type: "boolean", default: false },
      callHierarchy: { type: "boolean", default: false }
    }
  }
}

module.exports = pythonClient
