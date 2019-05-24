const axios = require('axios');//usaremos para receber o arquivo
const fs = require('fs');//usaremos para manipular o arquivo (escrever, atualizar, upload)
var sha1 = require('sha1');//usaremos para criar o resumo criptográfico
const path = require('path')//usaremos para definir o caminho padrão do arquivo
const request = require('request')//usaremos para fazer a requisição POST e enviar o arquivo

const pathJson = path.resolve(__dirname, 'answer.json')//aqui definimos um padrão de url para mantermos o arquivo de resposta
const iniciar = async () =>{ //inícia uma sequencia de métodos para resolver o desafio
axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=SEU-TOKEN')
    .then(function(response){     
        criaArquivo(response.data)//cria um arquivo com o valor dentro da chave "data" do json
    })
    .catch(function(error){
        console.log(error);
    });
}

const criaArquivo = async response =>{
    fs.writeFile(pathJson, JSON.stringify(response),
    erro =>{
        console.log(erro || 'arquivo salvo')
        descriptografar(response)//após criar o arquivo como é pedido no desafio, chamamos um método para decifrar a criptografia
    })
}
//o método a seguir serve para "quebrar" a criptografia
const descriptografar = async response => {
        texto = response.cifrado.toLowerCase(); //pega o texto criptografado e deixa todo minúsculo
        casas = response.numero_casas; //pega o número de casas da criptografia
        resultado = texto.split(""); //separa o texto em um array
        
        texto_descriptografado = "";
        var alfa = ["a","b","c","d","e","f","g","h"
,"i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        auxiliar = 0;
        resultado.forEach(element => {  //pega cada letra da palavra  
            auxiliar = casas;
            while(auxiliar>0){ //enquanto existirem 'casas', o while será executado
                for (let i = 0; i < alfa.length; i++) { //percorre o alfabeto
                    if(element == 'a'){ //se for a letra 'a', ela automaticamente passa para a letra 'z', já que nao temos nenhuma antes do 'a'
                        element='z'; 
                        break;
                    }else{
                        if(element == alfa[i]){ //se a letra do texto encriptado for igual a letra do array
                            element = alfa[i-1];//a letra do texto recebe a letra anterior a do array, como se estivessemos pegando a letra anterior do texto
                            break;
                        }
                    }
                    
                }
                auxiliar--;//diminiui em 1 o número de casas a serem andadas
            }
            texto_descriptografado+=element;//vai concatenando para formar o texto descriptografado      
        });
        
        response.decifrado = texto_descriptografado;
        chave = sha1(response.decifrado); //cria a sha1 com base no texto decifrado
        response.resumo_criptografico = chave;
        console.log(texto_descriptografado);
       // criando o arquivo descriptografado
       atualizarArquivo(response);
        
        
    }
//o método a seguir atualiza o arquivo com os novos dados (chave sha1 e texto decifrado)
const atualizarArquivo = async response =>{
  fs.writeFile(pathJson, JSON.stringify(response),
  erro =>{
      console.log(erro || 'arquivo salvo')
      sendDesafio() //chama o método para finalmente submeter o arquivo agora que ele já está criado
  })
}
  
//o método a seguir envia o arquivo do desafio "answer.json" para a url
const sendDesafio = async () => { 
  const headers = {
    'Content-Type': 'multipart/form-data' //este é o cabeçalho que usaremos para enviar o arquivo (pedido no desafio)
  }
  const r = request.post(//aqui definimos o método POST, com a url e o cabeçalho da requisição
    { url: 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=SEU-TOKEN', headers },
    function optionalCallback (err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err)
      }
      console.log('Upload successful!  Server responded with:', body)
    }
  )
  const form = r.form() //criamos um 'form' com a request.post como pedido no desafio, para enviarmos o arquivo
  form.append('answer', fs.createReadStream(pathJson), {//nome e endereço do arquivo
    filename: 'answer.json'//nome do arquivo
  })
}

iniciar()//inícia todo o processo de resolução do desafio
