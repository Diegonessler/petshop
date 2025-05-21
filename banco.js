const { Pool } = require('pg');

// Conexão com PostgreSQL Render
const pool = new Pool({
    user: 'bancodb_66mg_user',
    host: 'dpg-d0m8u9gdl3ps73c5aar0-a.oregon-postgres.render.com',
    database: 'bancodb_66mg',
    password: 'CcKDGEnBAqIkMyvHLQTu6OJJPBbhy2Ka',
    port: 5432,
    ssl: { rejectUnauthorized: false } // importante para Render
});

// Cadastrar cliente
async function cadastrarCliente(cliente) {
    const sql = `
        INSERT INTO clientes (nome, email, telefone, cpf, endereco, animal, raca, valor, observacao, e_plano)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;
    const values = [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.cpf,
        cliente.endereco,
        cliente.animal,
        cliente.raca,
        cliente.valor,
        cliente.observacao,
        cliente.e_plano
    ];

    const res = await pool.query(sql, values);
    return res.rows[0];
}

// Listar clientes (com ou sem busca)
async function listarClientes(search = '') {
    let sql = 'SELECT * FROM clientes';
    let values = [];

    if (search) {
        sql += ' WHERE nome ILIKE $1 OR email ILIKE $2';
        values = [`%${search}%`, `%${search}%`];
    }

    const res = await pool.query(sql, values);
    return res.rows;
}

// Deletar cliente por ID
async function deletarCliente(id) {
    await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
}

// Buscar cliente por CPF
async function buscarClientePorCpf(cpf) {
    const res = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);
    return res.rows.length > 0 ? res.rows[0] : null;
}

module.exports = {
    cadastrarCliente,
    listarClientes,
    deletarCliente,
    buscarClientePorCpf
};
