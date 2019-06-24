const express = require('express');
const server = express();
let requests = 0;

server.use(express.json());

const projects = [
  {
    id: 1,
    title: 'Novo projeto',
    tasks: ['Task 1', 'Task 2', 'Task 3']
  },
  {
    id: 2,
    title: 'Novo projeto 2',
    tasks: ['Task 1', 'Task 2', 'Task 3']
  },
  {
    id: 3,
    title: 'Novo projeto 3',
    tasks: ['Task 1', 'Task 2', 'Task 3']
  }
];

server.use((req, res, next) => {
  requests++;
  console.log(`Requisições: ${requests}`);
  return next();
});

function checkIdExists(req, res, next) {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) {
    res.send(400, { error: 'Project not found.' });
  }
  return next();
}

server.get('/projects', (req, res) => {
  res.json(projects);
});

server.get('/projects/:id', checkIdExists, (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  res.json(project);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  project.title = title;

  res.json(projects);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projects[projectIndex], 1);

  res.send();
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  res.json(project);
});

server.listen(3000, () => console.log('server running...'));
