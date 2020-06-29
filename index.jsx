/** @jsx pragma */

const express = require('express');

let PORT = 3000;
const App = () => {};
const Get = () => {};
const Router = () => {};

const app = <App>
  <Get path='/status' handler={getStatus} />
  <Router path='/api'>
    <Get path='/version' handler={getVersion} />
  </Router>
</App>;

function getStatus(req, res) {
  res.send('OK');
}

function getVersion(req, res) {
  res.json({ version: '0.1.0'});
}

app.listen(PORT, function() {
  console.log(`http://localhost: ${PORT}`);
});

function pragma(Element, props) {
  const children = Array.prototype.slice.call(arguments, 2);
  if (Element === App) {
    const app = express();
    for (const child of children) {
      app[child.method](child.path, child.handler);
    }
    return app;
  } else if (Element === Get) {
    // Whatever you return here, the parent 'App' or 'Router' gets as a 'child'
    return { handler: props.handler, path: props.path, method: 'get' };
  } else if (Element === Router) {
    const router = express.Router();
    // let the children decide what 'method', 'path', and 'handler' to use.
    for (const child of children) {
      router[child.method](child.path, child.handler);
    }
    return { method: 'use', path: props.path, handler: router };
  }
}