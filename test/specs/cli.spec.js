"use strict";

const { files, bump } = require("../utils");
const { expect } = require("chai");
const manifest = require("../../package.json");

describe("bump", () => {

  it("should run without any arguments", () => {
    // Create a dummy package.json, otherwise an error will occur
    files.create("package.json", { version: "1.0.0" });

    // Run the CLI without any arguments.
    // It will prompt the user and wait forever, so add a timeout.
    let cli = bump("", { timeout: 6000 });

    // It should have prompted for input
    expect(cli.stdout).to.contain("The current version in package.json is 1.0.0\nHow would you like to bump it? (Use arrow keys)");
  });

  it("should error if an invalid argument is used", () => {
    let cli = bump("--commit --help --fizzbuzz --quiet");

    expect(cli).to.have.exitCode(9);
    expect(cli).to.have.stdout("");
    expect(cli.stderr).to.match(/^Unknown option: --fizzbuzz\n\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    expect(cli.stderr).to.contain(manifest.description);
  });

  it("should error if an invalid shorthand argument is used", () => {
    let cli = bump("-cqhzt");

    expect(cli).to.have.exitCode(9);
    expect(cli).to.have.stdout("");
    expect(cli.stderr).to.match(/^Unknown option: -z\n\nUsage: bump \[release\] \[options\] \[files...\]\n/);
    expect(cli.stderr).to.contain(manifest.description);
  });

  it("should error if an argument is missing its value", () => {
    let cli = bump("--commit --help --preid --quiet");

    expect(cli).to.have.exitCode(9);
    expect(cli).to.have.stdout("");
    expect(cli.stderr).to.match(
      /^The --preid option requires a value, such as "alpha", "beta", etc\.\n\nUsage: bump \[release\] \[options\] \[files...\]\n/
    );
    expect(cli.stderr).to.contain(manifest.description);
  });

  describe("bump --help", () => {
    it("should show usage text", () => {
      let cli = bump("--help");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      expect(cli.stdout).to.contain(manifest.description);
    });

    it("should support -h shorthand", () => {
      let cli = bump("-h");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      expect(cli.stdout).to.contain(manifest.description);
    });

    it("should ignore other arguments", () => {
      let cli = bump("--quiet --help --tag");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      expect(cli.stdout).to.contain(manifest.description);
    });

    it("should ignore other shorthand arguments", () => {
      let cli = bump("-cht");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli.stdout).to.match(/^\nUsage: bump \[release\] \[options\] \[files...\]\n/);
      expect(cli.stdout).to.contain(manifest.description);
    });
  });

  describe("bump --version", () => {
    it("should show the version number", () => {
      let cli = bump("--version");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });

    it("should support -v shorthand", () => {
      let cli = bump("-v");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });

    it("should ignore other arguments", () => {
      let cli = bump("--quiet --version --tag");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });

    it("should ignore other shorthand arguments", () => {
      let cli = bump("-cvt");

      expect(cli).to.have.exitCode(0);
      expect(cli).to.have.stderr("");
      expect(cli).to.have.stdout(manifest.version + "\n");
    });
  });
});
