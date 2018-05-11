const express = require('express');
const app = express();
const { EventEmitter } = require('events');
const clock = new EventEmitter();
const html = require('html-template-tag');

setInterval(() => {
  const time = (new Date()).toLocaleString();
  clock.emit('tick', time);
}, 5000);

/* clock.on('tick', (time) => {
  console.log('The time is ', time);
}); */

app.get('/', (req, res) => {
  res.send( html`
    <html>
      <head>
        <script type="text/javascript">
          function longPollForTime() {
            fetch('/the-time')
              .then(response => response.text())
              .then(time => {
                console.log('The time is:', time);
                longPollForTime()
              })
              .catch(error => {
                console.error(error);
              });
          }

          longPollForTime();
        </script>
      </head>
    </html>
  `);
});

app.get('/the-time', (req, res) => {
  clock.once('tick', time => res.send(time));
});

app.listen(3333, () => {
  console.log('Listening on port 3333');
});
