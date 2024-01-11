---
hide:
  - toc

title: Appium-Related Tools
---

There are several Appium tools that have been created to to assist with things not directly related
to testing, such as Appium installation, test development, and more.

### Appium Inspector

Appium has a graphical client which can be used to inspect application screenshots, view the
application hierarchy, run Appium commands, record app interactions, and more. It is very useful
for Appium test development.

Find downloads and more information on its GitHub page: [Appium Inspector](https://github.com/appium/appium-inspector)

### Appium Doctor

The `appium-doctor` CLI tool can be used to validate proper environment setup for Android and iOS
automation, and identify any common configuration issues. It can be installed with `npm`:

```sh
npm install -g @appium/doctor
```

Learn more on its GitHub page: [Appium Doctor](https://github.com/appium/appium/tree/master/packages/doctor)

### Other Tools

These tools are not maintained by the Appium team and can be used to assist with other problems:

|Name|Description|Supported By|
|---|---|---|
|[appium-installer](https://github.com/AppiumTestDistribution/appium-installer)|Help set up an Appium environment for Android and iOS|`@AppiumTestDistribution`|
|[appium-kit-vscode](https://github.com/sudharsan-selvaraj/appium-kit-vscode)|Visual Studio Code plugin for managing the Appium environment|`@sudharsan-selvaraj`|

!!! note

    If you maintain an Appium tool that you would like to be listed in the Appium docs, feel free
    to make a PR to add it to this section with a link to the tool documentation.
