// @ts-check

import {BaseDriver} from '../../../lib';
// eslint-disable-next-line import/named
import {createSandbox} from 'sinon';

describe('timeout', function () {
  before(async function () {
    const chai = await import('chai');
    const chaiAsPromised = await import('chai-as-promised');
    chai.use(chaiAsPromised.default);
    chai.should();
  });

  let driver = new BaseDriver();
  let implicitWaitSpy;
  let sandbox;
  beforeEach(function () {
    sandbox = createSandbox();
    driver.implicitWaitMs = 0;
    implicitWaitSpy = sandbox.spy(driver, 'setImplicitWait');
  });
  afterEach(function () {
    sandbox.restore();
  });
  // expected errors are for checks against runtime type failures. the types we're giving the function are not allowed
  describe('timeouts', function () {
    describe('errors', function () {
      it('should throw an error if something random is sent', async function () {
        await driver.timeouts('random timeout', 'howdy').should.eventually.be.rejected;
      });
      it('should throw an error if timeout is negative', async function () {
        await driver.timeouts('random timeout', -42).should.eventually.be.rejected;
      });
      it('should throw an errors if timeout type is unknown', async function () {
        await driver.timeouts('random timeout', 42).should.eventually.be.rejected;
      });
      it('should throw an error if something random is sent to scriptDuration', async function () {
        await driver.timeouts(undefined, undefined, 123, undefined, undefined).should.eventually.be
          .rejected;
      });
      it('should throw an error if something random is sent to pageLoadDuration', async function () {
        await driver.timeouts(undefined, undefined, undefined, 123, undefined).should.eventually.be
          .rejected;
      });
    });
    describe('implicit wait', function () {
      it('should call setImplicitWait when given an integer', async function () {
        await driver.timeouts('implicit', 42);
        implicitWaitSpy.calledOnce.should.be.true;
        implicitWaitSpy.firstCall.args[0].should.equal(42);
        driver.implicitWaitMs.should.eql(42);
      });
      it('should call setImplicitWait when given a string', async function () {
        await driver.timeouts('implicit', '42');
        implicitWaitSpy.calledOnce.should.be.true;
        implicitWaitSpy.firstCall.args[0].should.equal(42);
        driver.implicitWaitMs.should.eql(42);
      });
      it('should call setImplicitWait when given an integer to implicitDuration', async function () {
        await driver.timeouts(undefined, undefined, undefined, undefined, 42);
        implicitWaitSpy.calledOnce.should.be.true;
        implicitWaitSpy.firstCall.args[0].should.equal(42);
        driver.implicitWaitMs.should.eql(42);
      });
      it('should call setImplicitWait when given a string to implicitDuration', async function () {
        await driver.timeouts(undefined, undefined, undefined, undefined, '42');
        implicitWaitSpy.calledOnce.should.be.true;
        implicitWaitSpy.firstCall.args[0].should.equal(42);
        driver.implicitWaitMs.should.eql(42);
      });
    });
  });

  describe('set implicit wait', function () {
    it('should set the implicit wait with an integer', function () {
      driver.setImplicitWait(42);
      driver.implicitWaitMs.should.eql(42);
    });
    describe('with managed driver', function () {
      let managedDriver1 = new BaseDriver();
      let managedDriver2 = new BaseDriver();
      before(function () {
        driver.addManagedDriver(managedDriver1);
        driver.addManagedDriver(managedDriver2);
      });
      after(function () {
        driver.managedDrivers = [];
      });
      it('should set the implicit wait on managed drivers', function () {
        driver.setImplicitWait(42);
        driver.implicitWaitMs.should.eql(42);
        managedDriver1.implicitWaitMs.should.eql(42);
        managedDriver2.implicitWaitMs.should.eql(42);
      });
    });
  });
  describe('set new command timeout', function () {
    it('should set the new command timeout with an integer', function () {
      driver.setNewCommandTimeout(42);
      driver.newCommandTimeoutMs.should.eql(42);
    });
    describe('with managed driver', function () {
      let managedDriver1 = new BaseDriver();
      let managedDriver2 = new BaseDriver();
      before(function () {
        driver.addManagedDriver(managedDriver1);
        driver.addManagedDriver(managedDriver2);
      });
      after(function () {
        driver.managedDrivers = [];
      });
      it('should set the new command timeout on managed drivers', function () {
        driver.setNewCommandTimeout(42);
        driver.newCommandTimeoutMs.should.eql(42);
        managedDriver1.newCommandTimeoutMs.should.eql(42);
        managedDriver2.newCommandTimeoutMs.should.eql(42);
      });
    });
  });
});
