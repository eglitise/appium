import _ from 'lodash';
import {
  DRIVER_TYPE,
  PLUGIN_TYPE,
  EXT_SUBCOMMAND_INSTALL,
  EXT_SUBCOMMAND_LIST,
  EXT_SUBCOMMAND_RUN,
  EXT_SUBCOMMAND_UNINSTALL,
  EXT_SUBCOMMAND_UPDATE,
  EXT_SUBCOMMAND_DOCTOR,
} from '../constants';
import {INSTALL_TYPES} from '../extension/extension-config';
import {toParserArgs} from '../schema/cli-args';
const DRIVER_EXAMPLE = 'xcuitest';
const PLUGIN_EXAMPLE = 'images';

/**
 * This is necessary because we pass the array into `argparse`. `argparse` is bad and mutates things. We don't want that.
 * Bad `argparse`! Bad!
 */
const INSTALL_TYPES_ARRAY = [...INSTALL_TYPES];

/** @type {Set<ExtensionType>} */
const EXTENSION_TYPES = new Set([DRIVER_TYPE, PLUGIN_TYPE]);

// this set of args works for both drivers and plugins ('extensions')
/** @type {ArgumentDefinitions} */
const globalExtensionArgs = new Map([
  [
    ['--json'],
    {
      required: false,
      default: false,
      action: 'store_true',
      help: 'Return output in JSON format',
      dest: 'json',
    },
  ],
]);

/**
 * Builds a Record of extension types to a Record of subcommands to their argument definitions
 */
const getExtensionArgs = _.memoize(function getExtensionArgs() {
  const extensionArgs = {};
  for (const type of EXTENSION_TYPES) {
    extensionArgs[type] = {
      [EXT_SUBCOMMAND_LIST]: makeListArgs(type),
      [EXT_SUBCOMMAND_INSTALL]: makeInstallArgs(type),
      [EXT_SUBCOMMAND_UNINSTALL]: makeUninstallArgs(type),
      [EXT_SUBCOMMAND_UPDATE]: makeUpdateArgs(type),
      [EXT_SUBCOMMAND_RUN]: makeRunArgs(type),
      [EXT_SUBCOMMAND_DOCTOR]: makeDoctorArgs(type),
    };
  }
  return /** @type {Record<ExtensionType, Record<import('appium/types').CliExtensionSubcommand,ArgumentDefinitions>>} */ (
    extensionArgs
  );
});

/**
 * Makes the opts for the `list` subcommand for each extension type.
 * @param {ExtensionType} type
 * @returns {ArgumentDefinitions}
 */
function makeListArgs(type) {
  return new Map([
    ...globalExtensionArgs,
    [
      ['--installed'],
      {
        required: false,
        default: false,
        action: 'store_true',
        help: `List only installed ${type}s`,
        dest: 'showInstalled',
      },
    ],
    [
      ['--updates'],
      {
        required: false,
        default: false,
        action: 'store_true',
        help: `Show information about available ${type} updates`,
        dest: 'showUpdates',
      },
    ],
    [
      ['--verbose'],
      {
        required: false,
        default: false,
        action: 'store_true',
        help: `Show more information about each ${type}`,
        dest: 'verbose',
      },
    ],
  ]);
}

/**
 * Makes the opts for the `install` subcommand for each extension type
 * @param {ExtensionType} type
 * @returns {ArgumentDefinitions}
 */
function makeInstallArgs(type) {
  return new Map([
    ...globalExtensionArgs,
    [
      [type],
      {
        type: 'str',
        help:
          `Name of the ${type} to install, for example: ` +
          (type === DRIVER_TYPE ? DRIVER_EXAMPLE : PLUGIN_EXAMPLE),
      },
    ],
    [
      ['--source'],
      {
        required: false,
        default: null,
        choices: INSTALL_TYPES_ARRAY,
        help:
          `Where to look for the ${type} if it is not one of Appium's official ` +
          `${type}s. Possible values: ${INSTALL_TYPES_ARRAY.join(', ')}`,
        dest: 'installType',
      },
    ],
    [
      ['--package'],
      {
        required: false,
        default: null,
        type: 'str',
        help:
          `The Node.js package name of the ${type}. ` +
          `Required if "source" is set to "git" or "github".`,
        dest: 'packageName',
      },
    ],
  ]);
}

/**
 * Makes the opts for the `uninstall` subcommand for each extension type
 * @param {ExtensionType} type
 * @returns {ArgumentDefinitions}
 */
function makeUninstallArgs(type) {
  return new Map([
    ...globalExtensionArgs,
    [
      [type],
      {
        type: 'str',
        help:
          `Name of the ${type} to uninstall, for example: ` +
          (type === DRIVER_TYPE ? DRIVER_EXAMPLE : PLUGIN_EXAMPLE),
      },
    ],
  ]);
}

/**
 * Makes the opts for the `doctor` subcommand for each extension type
 * @param {ExtensionType} type
 * @returns {ArgumentDefinitions}
 */
function makeDoctorArgs(type) {
  return new Map([
    ...globalExtensionArgs,
    [
      [type],
      {
        type: 'str',
        help:
          `Name of the ${type} to run doctor checks for, for example: ` +
          (type === DRIVER_TYPE ? DRIVER_EXAMPLE : PLUGIN_EXAMPLE),
      },
    ],
  ]);
}

/**
 * Makes the opts for the `update` subcommand for each extension type
 * @param {ExtensionType} type
 * @returns {ArgumentDefinitions}
 */
function makeUpdateArgs(type) {
  return new Map([
    ...globalExtensionArgs,
    [
      [type],
      {
        type: 'str',
        help:
          `Name of the ${type} to update, or "installed" to update all installed ${type}s. ` +
          `To see available ${type} updates, run "appium ${type} list --installed --updates". ` +
          'For example: ' +
          (type === DRIVER_TYPE ? DRIVER_EXAMPLE : PLUGIN_EXAMPLE),
      },
    ],
    [
      ['--unsafe'],
      {
        required: false,
        default: false,
        action: 'store_true',
        help:
          'Include any available major revision updates, which may have breaking changes',
      },
    ],
  ]);
}

/**
 * Makes the opts for the `run` subcommand for each extension type
 * @param {ExtensionType} type
 * @returns {ArgumentDefinitions}
 */
function makeRunArgs(type) {
  return new Map([
    ...globalExtensionArgs,
    [
      [type],
      {
        type: 'str',
        help:
          `Name of the ${type} to run a script from, for example: ` +
          (type === DRIVER_TYPE ? DRIVER_EXAMPLE : PLUGIN_EXAMPLE),
      },
    ],
    [
      ['scriptName'],
      {
        default: null,
        nargs: '?',
        type: 'str',
        help:
          `Name of the ${type} script to run. If not provided, return a list ` +
          `of available scripts for this ${type}.`,
      },
    ],
  ]);
}

/**
 * Derives the options for the `server` command from the schema, and adds the arguments
 * which are disallowed in the config file.
 * @returns {ArgumentDefinitions}
 */
function getServerArgs() {
  return new Map([...toParserArgs(), ...serverArgsDisallowedInConfig]);
}

/**
 * These don't make sense in the context of a config file for obvious reasons.
 * @type {ArgumentDefinitions}
 */
const serverArgsDisallowedInConfig = new Map([
  [
    ['--shell'],
    {
      required: false,
      help: 'Enter REPL mode',
      action: 'store_const',
      const: true,
      dest: 'shell',
    },
  ],
  [
    ['--show-build-info'],
    {
      dest: 'showBuildInfo',
      action: 'store_const',
      const: true,
      required: false,
      help: 'Show info about the Appium build and exit',
    },
  ],
  [
    ['--show-debug-info'],
    {
      dest: 'showDebugInfo',
      action: 'store_const',
      const: true,
      required: false,
      help: 'Show debug info about the current Appium deployment and exit',
    },
  ],
  [
    ['--show-config'],
    {
      dest: 'showConfig',
      action: 'store_const',
      const: true,
      required: false,
      help: 'Show the current Appium configuration and exit',
    },
  ],
  [
    ['--config'],
    {
      dest: 'configFile',
      type: 'str',
      required: false,
      help: 'Explicit path to Appium configuration file',
    },
  ],
]);

export {getServerArgs, getExtensionArgs};

/**
 * @typedef {import('@appium/types').ExtensionType} ExtensionType
 */

/**
 * A tuple of argument aliases and argument options
 * @typedef {Map<[name: string]|[name: string, alias: string],import('argparse').ArgumentOptions>} ArgumentDefinitions
 */
