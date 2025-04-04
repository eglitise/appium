import {FakePlugin as _FakePlugin} from '../../lib/plugin';
import B from 'bluebird';

// Let's not use the actual FakePlugin because it runs a timer and we don't want to worry about
// needing to clean up timers so that unit test processes can exit!
class FakePlugin extends _FakePlugin {
  _clockRunning = false;
}

class FakeExpress {
  constructor() {
    this.routes = {};
  }

  all(route, handler) {
    this.routes[route] = handler;
  }

  async get(route) {
    return await new B((resolve, reject) => {
      try {
        const res = {
          send: resolve,
        };
        this.routes[route]({}, res);
      } catch (e) {
        reject(e);
      }
    });
  }
}

describe('fake plugin', function () {
  let should;

  before(async function () {
    const chai = await import('chai');
    const chaiAsPromised = await import('chai-as-promised');
    chai.use(chaiAsPromised.default);
    should = chai.should();
  });

  it('should exist', function () {
    should.exist(FakePlugin);
  });

  it('should update an express app with a fake route', async function () {
    const app = new FakeExpress();
    await app.get('/fake').should.eventually.be.rejected;
    FakePlugin.updateServer(app);
    await app.get('/fake').should.eventually.eql(JSON.stringify({fake: 'fakeResponse'}));
  });

  it('should wrap find element', async function () {
    const p = new FakePlugin('fake');
    await p
      .findElement(() => ({el: 'fakeEl'}), {}, 'arg1', 'arg2')
      .should.eventually.eql({
        el: 'fakeEl',
        fake: true,
      });
  });

  it('should handle page source', async function () {
    const p = new FakePlugin('fake');
    await p
      .getPageSource(() => {}, {}, 'arg1', 'arg2')
      .should.eventually.eql('<Fake>["arg1","arg2"]</Fake>');
  });

  it('should handle getFakeSessionData', async function () {
    const p = new FakePlugin('fake');
    await p.getFakeSessionData(() => {}, {fakeSessionData: 'hi'}).should.eventually.eql('hi');
    await p.getFakeSessionData(() => {}, {}).should.eventually.eql(null);
  });

  it('should handle setFakeSessionData', async function () {
    const p = new FakePlugin('fake');
    const driver = {};
    await p.setFakeSessionData(() => {}, driver, 'foobar').should.eventually.eql(null);
    await p.getFakeSessionData(() => {}, driver).should.eventually.eql('foobar');
  });
});
