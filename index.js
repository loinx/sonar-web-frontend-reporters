#!/usr/bin/env node

const fs = require('fs'),
  mkdirp = require('mkdirp'),
  chalk = require('chalk'),
  ReporterFactory = require('./reporters/reporter.factory');

class SonarWebReporters {

  constructor () {
    this.options = JSON.parse(fs.readFileSync('./.sreporterrc', 'utf8'));
  }

  launchReporters () {
    Object.keys(ReporterFactory.TYPE).forEach((key) => this.launch(ReporterFactory.TYPE[key], this.options));
  }

  launch (type, options) {
    let opts = options[type],
      reporter = ReporterFactory.create(type, opts, options.projectName, options.projectLanguage);

    if (opts) {
      this.makeReportDirectory(opts.report);
      reporter.launch();
    } else {
      console.info(chalk.gray(`\u002D ${chalk.gray.bold(reporter.linterName)} has been ignored`));
    }
  }

  makeReportDirectory (reportPath) {
    let path = reportPath.substring(0, reportPath.lastIndexOf('/'));

    if (!fs.existsSync(path)) {
      mkdirp.sync(path);
    }
  }

}

let sonarWebReporter = new SonarWebReporters();
sonarWebReporter.launchReporters();

module.exports = SonarWebReporters;
