var express = require('express');
var router = express.Router();
const { cadastrarCliente, listarClientes, deletarCliente, buscarClientePorCpf } = require('../banco');

// Rota principal de cadastro
router.get('/', function(req, res, next) {
  const mensagem = req.query.mensagem || null;
  res.render('index', { 
    title: 'Cadastro de Clientes', 
    mensagem: mensagem
  });
});

router.post('/cadastro', async function(req, res, next) {
  const {
    nome, email, telefone, cpf, endereco,
    animal, raca, valor, observacao, e_plano
  } = req.body;

  console.log('Dados recebidos:', req.body);

  try {
    // Verifica se o CPF já está cadastrado
    const clienteExistente = await buscarClientePorCpf(cpf);
    if (clienteExistente) {
      return res.render('index', {
        title: 'Cadastro de Clientes',
        mensagem: 'CPF já cadastrado! Por favor, insira um CPF diferente.'
      });
    }

    await cadastrarCliente({
      nome, email, telefone, cpf, endereco,
      animal, raca, valor, observacao, e_plano
    });

    res.render('index', {
      title: 'Cadastro de Clientes',
      mensagem: 'Cadastro realizado com sucesso!'
    });
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err.message);

    res.render('index', {
      title: 'Cadastro de Clientes',
      mensagem: err.message || 'Erro ao realizar o cadastro. Tente novamente!'
    });
  }
});

// Página de pesquisa
router.get('/pesquisar', async function(req, res, next) {
  const mensagem = req.query.mensagem || null;

  try {
    const clientes = await listarClientes();
    res.render('pesquisar', {
      title: 'Lista de Clientes',
      clientes: clientes,
      mensagem: mensagem
    });
  } catch (err) {
    console.error('Erro ao listar clientes:', err);

    res.render('pesquisar', {
      title: 'Lista de Clientes',
      clientes: [],
      mensagem: mensagem || 'Erro ao carregar a lista de clientes. Tente novamente!'
    });
  }
});

// Exclusão de cliente
router.post('/deletar', async function(req, res, next) {
  const { id } = req.body;

  console.log('Tentando deletar cliente com ID:', id);

  if (!id) {
    console.error('ID do cliente não fornecido');
    return res.redirect('/pesquisar?mensagem=Erro:%20ID%20do%20cliente%20não%20fornecido!');
  }

  try {
    await deletarCliente(id);
    console.log('Cliente deletado com sucesso, ID:', id);

    res.redirect('/pesquisar?mensagem=Cliente%20excluído%20com%20sucesso!');
  } catch (err) {
    console.error('Erro ao deletar cliente:', err.message);

    res.redirect('/pesquisar?mensagem=Erro%20ao%20excluir%20cliente.%20Tente%20novamente!');
  }
});

module.exports = router;
