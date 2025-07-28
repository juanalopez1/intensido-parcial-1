import { Departamento } from "../schemas/departamento.js";
import { LocalidadUsuario } from "../schemas/localidad.js";
import { Usuario } from "../schemas/usuario.js"
import { UCUNoAutorizadoError, UCUNoEncontradoError } from "../util/index.js";
import { BaseRepository } from "./base.repository.js"
import { myPool } from "./database.service.js"

class UsuarioRepository extends BaseRepository<Usuario> {

  baseQuery = `SELECT U.* FROM public.usuarios U`;

  async getAll(): Promise<Usuario[]> {
    const res = await myPool.query(`${this.baseQuery}`);
    return res.rows;
  }

  async getById(id: number): Promise<Usuario> {
    let consulta = `${this.baseQuery} WHERE id_usuario=$1`;
    const res = await myPool.query(consulta,[id]);
    if (res.rowCount === 0) throw new UCUNoEncontradoError("id_usuario " + id);
    return res.rows[0];
  }

  async getOneBy(data: Partial<Usuario>): Promise<Usuario> {
    let consulta = `${this.baseQuery}
      WHERE nombre=$1
    `; //En el where podríamos considerar todos los datos que hubieran en data
    const res = await myPool.query(consulta,[data.nombre]);
    if (res.rowCount === 0) {
      throw new UCUNoEncontradoError();
    }
    // if (res.rowCount > 1) throw new UCUMasDeUnaFilaError("");
    return res.rows[0];
  }

  async findAll(data: Partial<Usuario>): Promise<Usuario[]> {
    throw new Error('Not implemented')
  }

  async create(data: Usuario): Promise<Usuario> {
    const consulta = "INSERT INTO usuarios (nombre, roles) VALUES ($1, $2) RETURNING *";
    const res = await myPool.query(consulta,[data.nombre,data.roles]);
    const id_usuario = res.rows[0].id_usuario;
    console.log({id_usuario});
    return this.getById(id_usuario);
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario> {
    throw new Error('Not implemented')
  }

  async erase(id: number): Promise<void> {
    throw new Error('Not implemented')
  }

  async auth(nombre:string, password:string):Promise<Usuario>{

    const consulta = `
      ${this.baseQuery}
      JOIN credenciales C ON C.id_usuario = U.id_usuario
      WHERE nombre = $1
      AND password_hash = crypt($2, password_hash);
    `;
    const res = await myPool.query(consulta,[nombre,password]);

    if (res.rowCount === 0) //Si no existe usuario con esa pass
      throw new UCUNoAutorizadoError();

    return res.rows[0]
  }

  async getDepartamentos(id_usuario : number) : Promise<Departamento[]>{
    const consulta = `
      SELECT D.* 
      FROM public.usuarios U
      JOIN public.localidades L ON L.id_usuario = U.id_usuario
      JOIN public.departamentos D ON D.id_departamento = L.id_departamento
      WHERE U.id_usuario = $1
    `;
    const res = await myPool.query(consulta, [id_usuario]);
    return res.rows;
  }

  async getLocalidades(id_usuario : number, id_departamento:number){
    const consulta = `
      SELECT D.* 
      FROM public.usuarios U
      JOIN public.localidades L ON L.id_usuario = U.id_usuario
      JOIN public.departamentos D ON D.id_departamento = L.id_departamento AND D.id_departamento = $2
      WHERE U.id_usuario = $1
    `;
    const res = await myPool.query(consulta, [id_usuario, id_departamento]);
    return res.rows;
  }

  async addLocalidad (localidad : LocalidadUsuario) {
    const consulta = `
      INSERT INTO public.localidades (id_localidad, id_departamento, id_usuario, nombre)
      VALUES ($1,$2,$3,$4) returning id_localidad
      ;
    `;
    const result = await myPool.query(consulta,[
      localidad.id_localidad,
      localidad.id_departamento,
      localidad.id_usuario,
      localidad.nombre
    ]);

    return result.rows;
  }

  async removeLocalidad (id_usuario :number,id_departamento :number,id_localidad :number) {
    const consulta = `
      DELETE FROM public.localidades 
      WHERE id_localidad=$1 AND id_usuario=$2
      ;
    `;
    await myPool.query(consulta,[id_usuario,id_localidad]);
  }

}

export const usuarioRepository = new UsuarioRepository();