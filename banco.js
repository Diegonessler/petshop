const mysql = require('mysql2/promise');

async function conectarBD() {
    if (global.conexao && global.conexao.state !== 'disconnected') {
        return global.conexao;
    }

    const conexao = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'petmimado'
    });

    global.conexao = conexao;
    return global.conexao;
}

async function cadastrarCliente(cliente) {
    const conexao = await conectarBD();
    const sql = `
        INSERT INTO clientes (nome, email, telefone, cpf, endereco, animal, raca, valor, observacao, e_plano)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [resultado] = await conexao.query(sql, [
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
    ]);
    return resultado;
}

async function listarClientes(search = '') {
    const conexao = await conectarBD();
    let sql = 'SELECT * FROM clientes';
    let params = [];

    if (search) {
        sql += ' WHERE nome LIKE ? OR email LIKE ?';
        params = [`%${search}%`, `%${search}%`];
    }

    const [rows] = await conexao.query(sql, params);
    return rows;
}

async function deletarCliente(id) {
    const conexao = await conectarBD(); // Conectar ao banco de dados
    await conexao.query('DELETE FROM clientes WHERE id = ?', [id]); // Executar o comando DELETE
}

async function buscarClientePorCpf(cpf) {
    const conexao = await conectarBD();  // Use a função conectarBD
    try {
        const [resultado] = await conexao.query('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
        return resultado.length > 0 ? resultado[0] : null;  // Retorna o cliente se encontrado, caso contrário retorna null
    } catch (err) {
        console.error('Erro ao buscar cliente por CPF:', err.message);
        throw err;  // Lança o erro para ser tratado na rota
    }
}

module.exports = { cadastrarCliente, listarClientes, deletarCliente, buscarClientePorCpf };
