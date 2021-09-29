// @ts-check

import path from 'path';
import rewiremock from 'rewiremock/node';
import sinon from 'sinon';

describe('ExtensionConfig', function () {
  describe('DriverConfig', function () {

    /**
     * @type {typeof import('../lib/driver-config').default}
     */
    let DriverConfig;
    let mocks;

    beforeEach(function () {
      mocks = {
        '../lib/schema': {
          registerSchema: sinon.stub(),
          readExtensionSchema: sinon.stub(),
          getSchema: sinon.stub(),
        },
        'resolve-from': sinon.stub().callsFake((cwd, id) => path.join(cwd, id))
      };

      DriverConfig = rewiremock.proxy(
        () => require('../lib/driver-config'),
        mocks,
      ).default;
    });

    describe('extensionDesc', function () {
      it('should return the description of the extension', function () {
        const config = new DriverConfig('/tmp/');
        config.extensionDesc('foo', {version: '1.0', automationName: 'bar'}).should.equal(`foo@1.0 (automationName 'bar')`);
      });
    });

    describe('getConfigProblems()', function () {
      /**
       * @type {InstanceType<DriverConfig>}
       */
      let driverConfig;

      beforeEach(function () {
        driverConfig = new DriverConfig('/tmp/');
      });

      describe('when provided no arguments', function () {
        it('should throw', function () {
          (() => driverConfig.getConfigProblems()).should.throw();
        });
      });

      describe('property `platformNames`', function () {
        describe('when provided an object with no `platformNames` property', function () {
          it('should return an array with an associated problem', function () {
            driverConfig.getConfigProblems({}).should.deep.include({
              err: 'Missing or incorrect supported platformNames list.',
              val: undefined,
            });
          });
        });

        describe('when provided an object with an empty `platformNames` property', function () {
          it('should return an array with an associated problem', function () {
            driverConfig
              .getConfigProblems({platformNames: []})
              .should.deep.include({
                err: 'Empty platformNames list.',
                val: [],
              });
          });
        });

        describe('when provided an object with a non-array `platformNames` property', function () {
          it('should return an array with an associated problem', function () {
            driverConfig
              .getConfigProblems({platformNames: 'foo'})
              .should.deep.include({
                err: 'Missing or incorrect supported platformNames list.',
                val: 'foo',
              });
          });
        });

        describe('when provided a non-empty array containing a non-string item', function () {
          it('should return an array with an associated problem', function () {
            driverConfig
              .getConfigProblems({platformNames: ['a', 1]})
              .should.deep.include({
                err: 'Incorrectly formatted platformName.',
                val: 1,
              });
          });
        });
      });

      describe('property `automationName`', function () {
        describe('when provided an object with a missing `automationName` property', function () {
          it('should return an array with an associated problem', function () {
            driverConfig.getConfigProblems({}).should.deep.include({
              err: 'Missing or incorrect automationName',
              val: undefined,
            });
          });
        });
        describe('when provided a conflicting automationName', function () {
          it('should return an array with an associated problem', function () {
            driverConfig.getConfigProblems({automationName: 'foo'});
            driverConfig
              .getConfigProblems({automationName: 'foo'})
              .should.deep.include({
                err: 'Multiple drivers claim support for the same automationName',
                val: 'foo',
              });
          });

        });
      });

      describe('property `schema`', function () {
        describe('when provided an object with a defined non-string `schema` property', function () {
          it('should return an array with an associated problem', function () {
            driverConfig.getConfigProblems({schema: []}).should.deep.include({
              err: 'Incorrectly formatted schema field.',
              val: [],
            });
          });
        });

        describe('when provided a string `schema` property', function () {
          describe('when the property ends in an unsupported extension', function () {
            it('should return an array with an associated problem', function () {
              driverConfig
                .getConfigProblems({schema: 'selenium.java'})
                .should.deep.include({
                  err: 'Schema file has unsupported extension. Allowed: .json, .js, .cjs',
                  val: 'selenium.java',
                });
            });
          });

          describe('when the property contains a supported extension', function () {
            describe('when the property as a path cannot be found', function () {
              beforeEach(function () {
                mocks['../lib/schema'].readExtensionSchema.throws(new Error());
              });
              it('should return an array with an associated problem', function () {
                const problems = driverConfig
                  .getConfigProblems({
                    installPath: '/usr/bin/derp',
                    pkgName: 'doop',
                    schema: 'herp.json',
                  });
                problems.should.deep.include({
                  err: `Unable to register schema at path herp.json`,
                  val: 'herp.json',
                });
              });
            });

            describe('when the property as a path is found', function () {
              it('should return an empty array', function () {
                const problems = driverConfig.getConfigProblems({
                  pkgName: 'fixtures', // just corresponds to a directory name relative to `installPath` `(__dirname)`
                  installPath: __dirname,
                  schema: 'driver.schema.js',
                  platformNames: ['foo'], // to avoid problem
                  automationName: 'fake' // to avoid problem
                });
                problems.should.be.empty;
              });
            });
          });
        });
      });
    });
  });
});