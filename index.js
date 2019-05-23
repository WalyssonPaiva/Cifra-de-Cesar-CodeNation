const axios = require('axios');
const fs = require('fs')
var sha1 = require('sha1');
var FormData = require('form-data');

axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=1138f7c271366dfb6772cd6984bc9add249108b3')
    .then(function(response){     
        criaArquivo(response.data) 
    })
    .catch(function(error){
        console.log(error);
    });

function criaArquivo(response){
    fs.writeFile(__dirname +'/answer.json', JSON.stringify(response),
    erro =>{
        console.log(erro || 'arquivo salvo')
        descriptografar(response);
    })
}
function descriptografar(response){
        texto = response.cifrado.toLowerCase();
        casas = response.numero_casas;
        resultado = texto.split("");
        chave = sha1(texto);
        textoOk = "";
        var alfa = ["a","b","c","d","e","f","g","h"
,"i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        auxiliar = 0;
        resultado.forEach(element => {    
            auxiliar = casas;
            while(auxiliar>0){
                for (let i = 0; i < alfa.length; i++) {
                    if(element == 'a'){
                        element='z';
                        break;
                    }else{
                        if(element == alfa[i]){
                            element = alfa[i-1];
                            break;
                        }
                    }
                    
                }
                auxiliar--;
            }
            textoOk+=element;      
        });
        response.decifrado = textoOk;
        response.resumo_criptografico = chave;
        console.log(textoOk);
       // criando o arquivo descriptografado
       fs.writeFile(__dirname +'/answer.json', JSON.stringify(response),
    erro =>{
        console.log(erro || 'arquivo salvo')
       // enviarArquivo()
    })
        
        enviarArquivo();
        
    }
    function enviarArquivo(){
        let formData = new FormData();
        // const answerFile = fs.readFileSync('answer.json');
        const answerFile = fs.createReadStream('answer.json')
        formData.append("answer", answerFile);
        axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=1138f7c271366dfb6772cd6984bc9add249108b3', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then( ret => {console.log(ret)} )
        .catch(error => {console.log(error.response)});
}
