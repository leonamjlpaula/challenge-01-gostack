const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateId = (request, response, next) => {
  const {id} = request.params;

  if(!isUuid(id))
    return response.status(400).json({message: 'Invalid ID'});

  return next();
}

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  
  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const index = repositories.findIndex(p => p.id === id);

  if(index<0)
    return response.status(400).json({message: 'Repository not found'});

  const repository = repositories[index];  
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[index] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const index = repositories.findIndex(p => p.id === id);

  if(index<0)
    return response.status(400).json({message: 'Repository not found'});

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;  
  const repository = repositories.find(p => p.id === id);

  if(!repository)
    return response.status(400).json({message: 'Repository not found'});

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;