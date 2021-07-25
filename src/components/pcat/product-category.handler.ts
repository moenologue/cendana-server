import { FastifyRequest, FastifyReply } from 'fastify'
import * as repo from './product-category.repo';
import * as views from './product-category.view';
import * as DTO from './product-category.dto'
import { ID } from '@cend/commons/request';

type PostRequest = FastifyRequest<{ Body: DTO.Create.Marker }>;
type PutRequest = FastifyRequest<{ Params: ID.Marker, Body: DTO.Update.Marker }>;
type DeleteRequest = FastifyRequest<{ Params: ID.Marker }>;
type FindRequest = FastifyRequest<{ Querystring: DTO.Find.Marker }>;
type FindOneRequest = FastifyRequest<{ Params: ID.Marker }>;

export async function post(request: PostRequest, reply: FastifyReply) {
  const result = await repo.create(request.body);
  reply.send(result);
}

export async function put(request: PutRequest, reply: FastifyReply) {
  const { id } = request.params;
  const payload = request.body;
  const result = await repo.update(id, payload);
  reply.send(result);
}

export async function remove(request: DeleteRequest, reply: FastifyReply) {
  const { id } = request.params;
  const result = await repo.remove(id);
  reply.send(result);
}

export async function find(request: FindRequest, reply: FastifyReply) {
  const { keyword, ...options } = request.query;
  const result = await views.find(keyword, options);
  reply.send(result);
}

export async function findOne(request: FindOneRequest, reply: FastifyReply) {
  const productCategory = await views.findOne(request.params.id);
  if (!productCategory) {
    throw new Error(`can't find ProductCategory(id=${request.params.id})`);
  }
  reply.send(productCategory);
}