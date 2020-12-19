const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    lista(res){
        const sql = 'SELECT * FROM atendimentos'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    lista_id(id, res){
        const sql = `SELECT * FROM atendimentos where id=${id}`

        conexao.query(sql,(erro,resultados)=>{
            if (erro) {
                res.status(400).json(erro)
            } else {
                const atendimento = resultados[0]
                res.status(200).json(atendimento)
            }
        })
    }

    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')

        const dataValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: dataValida,
                mensagem: 'Data de Agendamento deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros) {
            res.status(400).json(erros)
        } else {
            const atendimentoDatatado = { ...atendimento, dataCriacao, data }
            console.log(atendimentoDatatado)
            const sql = 'INSERT INTO atendimentos SET ?'
            conexao.query(sql, atendimentoDatatado, (erro, resultado) => {
                if (erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(atendimentoDatatado)
                }
            })
        }

    }
    altera(id, valores, res){
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        }
        const sql = 'UPDATE atendimentos SET ? WHERE id= ?'
        conexao.query(sql, [valores, id], (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json({...valores, id})
            }
        })
    }

    deleta(id, res){
        const sql = `DELETE FROM atendimentos where id = ${id}`

        conexao.query(sql,(erro,resultados)=>{
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento()