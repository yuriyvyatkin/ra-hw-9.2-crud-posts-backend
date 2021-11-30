const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const { nanoid } = require('nanoid');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const notes = [
  { "text": "123", "id": "DB5wcQrs8fqZWQMepOD6p", "created": 1638164527204 },
];
const router = new Router();

router.get('/notes', async (ctx, next) => {
  const id = ctx.request.query.id;
  let response;

  if (id) {
    response = notes.find(o => o.id === id);
  } else {
    response = notes;
  }

  ctx.response.body = response;
});

router.post('/notes', async (ctx, next) => {
  const { id } = ctx.request.body;

  if (id) {
    noteIndex = notes.findIndex((note) => note.id === id);
    notes[noteIndex] = {
      ...notes[noteIndex],
      ...ctx.request.body,
    };
  } else {
    notes.push({ ...ctx.request.body, id: nanoid(), created: Date.now() });
  }

  ctx.response.body = notes;
});

router.delete('/notes/:id', async(ctx, next) => {
  const noteId = ctx.params.id;
  const index = notes.findIndex(o => o.id === noteId);

  if (index !== -1) {
    notes.splice(index, 1);
  }

  ctx.response.body = notes;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());

server.listen(port, () => console.log('server started'));
