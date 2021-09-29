export default {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'appium.json',
  type: 'object',
  title: 'Appium Configuration',
  description: 'A schema for Appium configuration files',
  properties: {
    server: {
      $id: '#/properties/server',
      type: 'object',
      title: 'server config',
      description: 'Configuration when running Appium as a server',
      properties: {
        address: {
          $comment: 'I think hostname covers both DNS and IPv4...could be wrong',
          $id: '#/properties/server/properties/address',
          appiumCliAliases: ['a'],
          default: '0.0.0.0',
          description: 'IP address to listen on',
          format: 'hostname',
          title: 'address config',
          type: 'string'
        },
        'allow-cors': {
          $id: '#/properties/server/properties/allow-cors',
          default: false,
          description: 'Whether the Appium server should allow web browser connections from any host',
          title: 'allow-cors config',
          type: 'boolean'
        },
        'allow-insecure': {
          $id: '#/properties/server/properties/allow-insecure',
          default: [],
          description: 'Set which insecure features are allowed to run in this server\'s sessions. Features are defined on a driver level; see documentation for more details. Note that features defined via "deny-insecure" will be disabled, even if also listed here. If string, a path to a text file containing policy or a comma-delimited list.',
          items: {
            type: 'string'
          },
          title: 'allow-insecure config',
          type: ['array', 'string'],
          uniqueItems: true
        },
        'base-path': {
          $id: '#/properties/server/properties/base-path',
          appiumCliAliases: ['pa'],
          default: '',
          description: 'Base path to use as the prefix for all webdriver routes running on the server',
          title: 'base-path config',
          type: 'string'
        },
        'callback-address': {
          $id: '#/properties/server/properties/callback-address',
          appiumCliAliases: ['ca'],
          description: 'Callback IP address (default: same as "address")',
          title: 'callback-address config',
          type: 'string'
        },
        'callback-port': {
          $id: '#/properties/server/properties/callback-port',
          appiumCliAliases: ['cp'],
          default: 4723,
          description: 'Callback port (default: same as "port")',
          maximum: 65535,
          minimum: 1,
          title: 'callback-port config',
          type: 'integer'
        },
        'debug-log-spacing': {
          $id: '#/properties/server/properties/debug-log-spacing',
          default: false,
          description: 'Add exaggerated spacing in logs to help with visual inspection',
          title: 'debug-log-spacing config',
          type: 'boolean'
        },
        'default-capabilities': {
          $comment: 'TODO',
          $id: '#/properties/server/properties/default-capabilities',
          appiumCliAliases: ['dc'],
          description: 'Set the default desired capabilities, which will be set on each session unless overridden by received capabilities. If a string, a path to a JSON file containing the capabilities, or raw JSON.',
          title: 'default-capabilities config',
          type: ['object', 'string']
        },
        'deny-insecure': {
          $comment: 'Allowed values are defined by drivers',
          $id: '#/properties/server/properties/deny-insecure',
          default: [],
          description: 'Set which insecure features are not allowed to run in this server\'s sessions. Features are defined on a driver level; see documentation for more details. Features listed here will not be enabled even if also listed in "allow-insecure", and even if "relaxed-security" is enabled. If string, a path to a text file containing policy or a comma-delimited list.',
          items: {
            type: 'string'
          },
          title: 'deny-insecure config',
          type: ['array', 'string'],
          uniqueItems: true
        },
        drivers: {
          $id: '#/properties/server/properties/drivers',
          default: '',
          description: 'A list of drivers to activate. By default, all installed drivers will be activated.  If a string, must be valid JSON',
          items: {
            type: 'string'
          },
          title: 'drivers config',
          type: ['string', 'array']
        },
        'keep-alive-timeout': {
          $id: '#/properties/server/properties/keep-alive-timeout',
          appiumCliAliases: ['ka'],
          default: 600,
          description: 'Number of seconds the Appium server should apply as both the keep-alive timeout and the connection timeout for all requests. A value of 0 disables the timeout.',
          minimum: 0,
          title: 'keep-alive-timeout config',
          type: 'integer'
        },
        'local-timezone': {
          $id: '#/properties/server/properties/local-timezone',
          default: false,
          description: 'Use local timezone for timestamps',
          title: 'local-timezone config',
          type: 'boolean'
        },
        log: {
          $id: '#/properties/server/properties/log',
          appiumCliAliases: ['g'],
          appiumCliDest: 'logFile',
          description: 'Also send log output to this file',
          title: 'log config',
          type: 'string'
        },
        'log-filters': {
          $comment: 'TODO',
          $id: '#/properties/log-filters',
          description: 'One or more log filtering rules',
          items: {
            type: 'string'
          },
          title: 'log-filters config',
          type: 'array'
        },
        'log-level': {
          $id: '#/properties/server/properties/log-level',
          appiumCliDest: 'loglevel',
          default: 'debug',
          description: 'Log level (console[:file])',
          enum: ['info', 'info:debug', 'info:info', 'info:warn', 'info:error', 'warn', 'warn:debug', 'warn:info', 'warn:warn', 'warn:error', 'error', 'error:debug', 'error:info', 'error:warn', 'error:error', 'debug', 'debug:debug', 'debug:info', 'debug:warn', 'debug:error'],
          title: 'log-level config',
          type: 'string'
        },
        'log-no-colors': {
          $id: '#/properties/server/properties/log-no-colors',
          default: false,
          description: 'Do not use color in console output',
          title: 'log-no-colors config',
          type: 'boolean'
        },
        'log-timestamp': {
          $id: '#/properties/server/properties/log-timestamp',
          default: false,
          description: 'Show timestamps in console output',
          title: 'log-timestamp config',
          type: 'boolean'
        },
        'long-stacktrace': {
          $id: '#/properties/server/properties/long-stacktrace',
          default: false,
          description: 'Add long stack traces to log entries. Recommended for debugging only.',
          title: 'long-stacktrace config',
          type: 'boolean'
        },
        'no-perms-check': {
          $id: '#/properties/server/properties/no-perms-check',
          default: false,
          description: 'Do not check that needed files are readable and/or writable',
          title: 'no-perms-check config',
          type: 'boolean'
        },
        nodeconfig: {
          $comment: 'Selenium Grid 3 is unmaintained and Selenium Grid 4 no longer supports this file.',
          $id: '#/properties/server/properties/nodeconfig',
          default: '',
          description: 'Path to configuration JSON file to register Appium as a node with Selenium Grid 3; otherwise the configuration itself',
          title: 'nodeconfig config',
          type: ['object', 'string']
        },
        plugins: {
          $id: '#/properties/server/properties/plugins',
          default: '',
          description: 'A list of plugins to activate. To activate all plugins, use the single string "all". If a string, can otherwise be valid JSON.',
          items: {
            type: 'string'
          },
          title: 'plugins config',
          type: ['string', 'array']
        },
        port: {
          $id: '#/properties/server/properties/port',
          appiumCliAliases: ['p'],
          default: 4723,
          description: 'Port to listen on',
          maximum: 65535,
          minimum: 1,
          title: 'port config',
          type: 'integer'
        },
        'relaxed-security': {
          $id: '#/properties/server/properties/relaxed-security',
          default: false,
          description: 'Disable additional security checks, so it is possible to use some advanced features, provided by drivers supporting this option. Only enable it if all the clients are in the trusted network and it\'s not the case if a client could potentially break out of the session sandbox. Specific features can be overridden by using "deny-insecure"',
          title: 'relaxed-security config',
          type: 'boolean'
        },
        'session-override': {
          $id: '#/properties/server/properties/session-override',
          default: false,
          description: 'Enables session override (clobbering)',
          title: 'session-override config',
          type: 'boolean'
        },
        'strict-caps': {
          $id: '#/properties/server/properties/strict-caps',
          default: false,
          description: 'Cause sessions to fail if desired caps are sent in that Appium does not recognize as valid for the selected device',
          title: 'strict-caps config',
          type: 'boolean'
        },
        tmp: {
          $id: '#/properties/server/properties/tmp',
          description: 'Absolute path to directory Appium can use to manage temp files. Defaults to C:\\Windows\\Temp on Windows and /tmp otherwise.',
          title: 'tmp config',
          type: 'string'
        },
        'trace-dir': {
          $id: '#/properties/server/properties/trace-dir',
          description: 'Absolute path to directory Appium can use to save iOS instrument traces; defaults to <tmp>/appium-instruments',
          title: 'trace-dir config',
          type: 'string'
        },
        webhook: {
          $comment: 'This should probably use a uri-template format to restrict the protocol to http/https',
          $id: '#/properties/server/properties/webhook',
          appiumCliAliases: ['G'],
          description: 'Also send log output to this http listener',
          format: 'uri',
          title: 'webhook config',
          type: 'string'
        }
      },
      additionalProperties: false,
    },
    driver: {
      $id: '#/properties/driver',
      type: 'object',
      title: 'driver config',
      description:
        'Driver-specific configuration. Keys should correspond to driver package names',
      properties: {}
    },
    plugin: {
      $id: '#/properties/plugin',
      type: 'object',
      title: 'plugin config',
      description:
        'Plugin-specific configuration. Keys should correspond to plugin package names',
      properties: {}
    },
  },
  additionalProperties: false,
};